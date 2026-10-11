import pytest
import pandas as pd
import numpy as np
from src.data.validate_data import load_and_validate
from src.data.preprocess import get_preprocessing_pipeline, create_grouped_splits

@pytest.fixture
def valid_dataframe():
    data = {
        'Participant_ID': ['P001', 'P001', 'P002'],
        'Subject_ID': ['SUB_1', 'SUB_2', 'SUB_1'],
        'Study_Year': [1, 1, 3],
        'Difficulty_Rating': [2, 5, 3],
        'Prior_Performance': ['High', 'None', 'Medium'],
        'Days_To_Deadline': [10, 2, 45],
        'Assessment_Weight': [20.0, 50.0, 10.0],
        'Available_Hours': [15.0, 15.0, 30.0],
        'Target_Priority': ['Low', 'High', 'Medium']
    }
    return pd.DataFrame(data)

@pytest.fixture
def invalid_dataframe():
    data = {
        'Participant_ID': ['P001'],
        'Subject_ID': ['SUB_1'],
        'Study_Year': [1],
        'Difficulty_Rating': [6], # Invalid: > 5
        'Prior_Performance': ['Excellent'], # Invalid category
        'Days_To_Deadline': [-5], # Invalid: negative
        'Assessment_Weight': [150.0], # Invalid: > 100
        'Available_Hours': [15.0],
        'Target_Priority': ['Super High'] # Invalid category
    }
    return pd.DataFrame(data)

def test_validation_schema(tmp_path, valid_dataframe):
    file_path = tmp_path / "valid.csv"
    valid_dataframe.to_csv(file_path, index=False)
    
    df, report, is_valid = load_and_validate(file_path)
    assert is_valid == True
    assert len(report['schema_errors']) == 0
    assert len(report['category_errors']) == 0

def test_validation_invalid_data(tmp_path, invalid_dataframe):
    file_path = tmp_path / "invalid.csv"
    invalid_dataframe.to_csv(file_path, index=False)
    
    df, report, is_valid = load_and_validate(file_path)
    assert is_valid == False
    assert len(report['category_errors']) > 0

def test_grouped_splits(valid_dataframe):
    # Add more rows to ensure split works properly
    df = pd.concat([valid_dataframe] * 10, ignore_index=True)
    # Modify participant IDs to have distinct groups
    df['Participant_ID'] = [f'P{i:03d}' for i in range(30)]
    
    X_train, X_test, y_train, y_test = create_grouped_splits(df, test_size=0.2)
    
    train_participants = set(X_train['Participant_ID'])
    test_participants = set(X_test['Participant_ID'])
    
    # Assert no overlap between train and test participants (Leakage check)
    assert len(train_participants.intersection(test_participants)) == 0

def test_preprocessing_pipeline(valid_dataframe):
    preprocessor = get_preprocessing_pipeline()
    
    X = valid_dataframe.drop(columns=['Target_Priority'])
    X_processed = preprocessor.fit_transform(X)
    
    # Check shape: 5 numeric + 1 ordinal = 6 features
    assert X_processed.shape[1] == 6
    # Participant_ID and Subject_ID should be dropped
    assert np.isnan(X_processed).sum() == 0
