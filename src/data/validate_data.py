import pandas as pd
import numpy as np

EXPECTED_SCHEMA = {
    'Participant_ID': 'object',
    'Subject_ID': 'object',
    'Study_Year': ['int64', 'int32'],
    'Difficulty_Rating': ['int64', 'int32'],
    'Prior_Performance': 'object',
    'Days_To_Deadline': ['int64', 'int32'],
    'Assessment_Weight': ['float64', 'float32'],
    'Available_Hours': ['float64', 'float32'],
    'Target_Priority': 'object'
}

VALID_CATEGORIES = {
    'Prior_Performance': ['High', 'Medium', 'Low', 'None'],
    'Target_Priority': ['Low', 'Medium', 'High']
}

def load_and_validate(filepath):
    """
    Loads CSV data and validates it against the expected schema and constraints.
    Returns the dataframe and a data quality report dictionary.
    """
    try:
        df = pd.read_csv(filepath)
    except Exception as e:
        raise ValueError(f"Failed to load data from {filepath}. Error: {e}")
        
    report = {
        'total_rows': len(df),
        'missing_values': df.isnull().sum().to_dict(),
        'duplicates': df.duplicated().sum(),
        'schema_errors': [],
        'category_errors': []
    }
    
    # 1. Check Schema
    for col, expected_types in EXPECTED_SCHEMA.items():
        if col not in df.columns:
            report['schema_errors'].append(f"Missing required column: {col}")
        else:
            actual_type = str(df[col].dtype)
            if isinstance(expected_types, list):
                if actual_type not in expected_types:
                     report['schema_errors'].append(f"Column {col} has type {actual_type}, expected one of {expected_types}")
            else:
                if actual_type != expected_types:
                    report['schema_errors'].append(f"Column {col} has type {actual_type}, expected {expected_types}")
    
    # 2. Check Valid Categories
    for col, valid_vals in VALID_CATEGORIES.items():
        if col in df.columns:
            invalid_rows = df[~df[col].isin(valid_vals) & df[col].notnull()]
            if not invalid_rows.empty:
                report['category_errors'].append(f"Column {col} contains invalid categories: {invalid_rows[col].unique()}")
                
    # 3. Check Ranges
    if 'Difficulty_Rating' in df.columns:
        invalid = df[~df['Difficulty_Rating'].between(1, 5)]
        if not invalid.empty:
            report['category_errors'].append("Difficulty_Rating contains values outside 1-5.")
            
    if 'Assessment_Weight' in df.columns:
        invalid = df[~df['Assessment_Weight'].between(0, 100)]
        if not invalid.empty:
            report['category_errors'].append("Assessment_Weight contains values outside 0-100.")
            
    if 'Days_To_Deadline' in df.columns:
        invalid = df[df['Days_To_Deadline'] < 0]
        if not invalid.empty:
            report['category_errors'].append("Days_To_Deadline cannot be negative.")
            
    # Raise exception if critical errors exist
    is_valid = len(report['schema_errors']) == 0 and len(report['category_errors']) == 0
    return df, report, is_valid

def print_quality_report(report):
    print("=== Data Quality Report ===")
    print(f"Total Rows: {report['total_rows']}")
    print(f"Duplicates: {report['duplicates']}")
    print("Missing Values:")
    for col, count in report['missing_values'].items():
        if count > 0:
            print(f"  - {col}: {count}")
    
    if report['schema_errors']:
        print("Schema Errors:")
        for err in report['schema_errors']:
            print(f"  - {err}")
            
    if report['category_errors']:
        print("Category Errors:")
        for err in report['category_errors']:
            print(f"  - {err}")
    print("===========================")

if __name__ == "__main__":
    filepath = 'data/synthetic_demo/synthetic_data.csv'
    import os
    if os.path.exists(filepath):
        df, report, is_valid = load_and_validate(filepath)
        print_quality_report(report)
        print(f"Is Valid: {is_valid}")
    else:
        print(f"File {filepath} not found. Generate it first.")
