import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, OrdinalEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import GroupShuffleSplit

def get_preprocessing_pipeline():
    """
    Returns a scikit-learn ColumnTransformer that handles missing values,
    encodes categorical variables, and scales numeric features.
    """
    numeric_features = ['Study_Year', 'Difficulty_Rating', 'Days_To_Deadline', 'Assessment_Weight', 'Available_Hours']
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    # We use OrdinalEncoder for Prior_Performance as it has a logical order
    ordinal_features = ['Prior_Performance']
    ordinal_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='None')),
        ('encoder', OrdinalEncoder(categories=[['None', 'Low', 'Medium', 'High']], handle_unknown='use_encoded_value', unknown_value=-1))
    ])
    
    # We could use OneHotEncoder for other categorical features if needed
    # For now, we only have Prior_Performance which is ordinal
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('ord', ordinal_transformer, ordinal_features)
        ],
        remainder='drop' # Drop Participant_ID and Subject_ID from ML features
    )
    
    return preprocessor

def create_grouped_splits(df, target_col='Target_Priority', group_col='Participant_ID', test_size=0.2, random_state=42):
    """
    Splits the dataframe into train and test sets, ensuring that the same participant 
    does not appear in both train and test sets (preventing leakage).
    """
    gss = GroupShuffleSplit(n_splits=1, test_size=test_size, random_state=random_state)
    
    train_idx, test_idx = next(gss.split(df, groups=df[group_col]))
    
    train_df = df.iloc[train_idx]
    test_df = df.iloc[test_idx]
    
    X_train = train_df.drop(columns=[target_col])
    y_train = train_df[target_col]
    
    X_test = test_df.drop(columns=[target_col])
    y_test = test_df[target_col]
    
    return X_train, X_test, y_train, y_test

if __name__ == "__main__":
    import os
    from src.data.validate_data import load_and_validate
    
    filepath = 'data/synthetic_demo/synthetic_data.csv'
    if os.path.exists(filepath):
        df, _, is_valid = load_and_validate(filepath)
        if is_valid:
            print(f"Data loaded successfully. Shape: {df.shape}")
            
            # Grouped Split
            X_train, X_test, y_train, y_test = create_grouped_splits(df)
            print(f"Train size: {X_train.shape[0]}, Test size: {X_test.shape[0]}")
            
            # Preprocessing
            preprocessor = get_preprocessing_pipeline()
            X_train_processed = preprocessor.fit_transform(X_train)
            X_test_processed = preprocessor.transform(X_test)
            
            print("Preprocessing successful.")
            print(f"Processed Train Shape: {X_train_processed.shape}")
            print(f"Processed Test Shape: {X_test_processed.shape}")
        else:
            print("Data validation failed.")
