import os
import joblib
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.model_selection import GroupKFold, GridSearchCV
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression

from src.data.validate_data import load_and_validate
from src.data.preprocess import get_preprocessing_pipeline, create_grouped_splits

# Define parameter grids for modest tuning
PARAM_GRIDS = {
    'Decision Tree': {
        'classifier__max_depth': [3, 5, 10, None],
        'classifier__min_samples_split': [2, 5, 10]
    },
    'Random Forest': {
        'classifier__n_estimators': [50, 100],
        'classifier__max_depth': [3, 5, 10, None],
        'classifier__random_state': [42]
    },
    'KNN': {
        'classifier__n_neighbors': [3, 5, 7, 9],
        'classifier__weights': ['uniform', 'distance']
    },
    'Logistic Regression': {
        'classifier__C': [0.1, 1.0, 10.0],
        'classifier__max_iter': [1000],
        'classifier__random_state': [42]
    }
}

MODELS = {
    'Decision Tree': DecisionTreeClassifier(random_state=42),
    'Random Forest': RandomForestClassifier(random_state=42),
    'KNN': KNeighborsClassifier(),
    'Logistic Regression': LogisticRegression()
}

def train_and_tune_models(data_path, output_dir):
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. Load Data
    df, _, is_valid = load_and_validate(data_path)
    if not is_valid:
        raise ValueError("Data validation failed.")
        
    # 2. Split Data (keeping participants separate)
    X_train, X_test, y_train, y_test = create_grouped_splits(df, test_size=0.2, random_state=42)
    groups_train = X_train['Participant_ID']
    
    # 3. Save test set for evaluation later
    test_data = X_test.copy()
    test_data['Target_Priority'] = y_test
    test_data.to_csv(os.path.join(output_dir, 'test_data.csv'), index=False)
    
    preprocessor = get_preprocessing_pipeline()
    trained_models = {}
    
    print("Starting Model Training and Tuning...")
    # GroupKFold ensures participants aren't split across CV folds
    gkf = GroupKFold(n_splits=3)
    
    for name, model in MODELS.items():
        print(f"Tuning {name}...")
        
        # Build pipeline: Preprocessing -> Model
        # This prevents data leakage during cross-validation
        pipeline = Pipeline([
            ('preprocessor', preprocessor),
            ('classifier', model)
        ])
        
        param_grid = PARAM_GRIDS[name]
        
        grid_search = GridSearchCV(
            pipeline, 
            param_grid, 
            cv=gkf, 
            scoring='f1_macro', 
            n_jobs=-1
        )
        
        # Fit with groups
        grid_search.fit(X_train, y_train, groups=groups_train)
        
        print(f"Best {name} F1 Score (CV): {grid_search.best_score_:.4f}")
        print(f"Best Parameters: {grid_search.best_params_}")
        
        best_model = grid_search.best_estimator_
        trained_models[name] = best_model
        
        # Save model artifact
        joblib.dump(best_model, os.path.join(output_dir, f"{name.replace(' ', '_')}.pkl"))
        
    print("All models trained and saved successfully.")
    return trained_models

if __name__ == "__main__":
    train_and_tune_models('data/synthetic_demo/synthetic_data.csv', 'experiments/models')
