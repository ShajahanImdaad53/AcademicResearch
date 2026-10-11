import os
import joblib
import pandas as pd
import numpy as np
from src.models.baseline import RuleBasedBaseline

FEATURE_DEFAULTS = {
    'Participant_ID': 'P_USER',
    'Subject_ID': 'SUB_DEFAULT',
    'Study_Year': 2,
    'Difficulty_Rating': 3,
    'Prior_Performance': 'None',
    'Days_To_Deadline': 14,
    'Assessment_Weight': 20.0,
    'Available_Hours': 15.0
}

def load_trained_model(model_path='experiments/models/Random_Forest.pkl'):
    """
    Loads a saved model pipeline or returns the rule-based baseline fallback.
    """
    if os.path.exists(model_path):
        try:
            model = joblib.load(model_path)
            return model, False # False means not fallback
        except Exception as e:
            print(f"Warning: Failed to load model from {model_path} ({e}). Using rule-based fallback.")
            return RuleBasedBaseline(), True
    return RuleBasedBaseline(), True

def prepare_input_dataframe(data):
    """
    Converts a dict, list of dicts, or DataFrame into a standardized DataFrame
    guaranteeing that all expected schema columns exist with sensible defaults.
    """
    if isinstance(data, dict):
        df = pd.DataFrame([data])
    elif isinstance(data, list):
        df = pd.DataFrame(data)
    elif isinstance(data, pd.DataFrame):
        df = data.copy()
    else:
        raise ValueError(f"Unsupported data format for prediction: {type(data)}")

    # Ensure all required features are present
    for col, default_val in FEATURE_DEFAULTS.items():
        if col not in df.columns:
            df[col] = default_val
        else:
            # Fill NaN values with defaults
            df[col] = df[col].fillna(default_val)

    # Coerce types safely
    df['Study_Year'] = df['Study_Year'].astype(int)
    df['Difficulty_Rating'] = df['Difficulty_Rating'].clip(1, 5).astype(int)
    df['Days_To_Deadline'] = df['Days_To_Deadline'].clip(lower=0).astype(int)
    df['Assessment_Weight'] = df['Assessment_Weight'].clip(0.0, 100.0).astype(float)
    df['Available_Hours'] = df['Available_Hours'].clip(lower=0.0).astype(float)
    df['Prior_Performance'] = df['Prior_Performance'].astype(str)

    return df

def predict_subject_priority(model, data, is_fallback=False):
    """
    Predicts priority for given subject inputs using the supplied model or fallback.
    Returns (predictions_array, used_fallback_flag).
    """
    df = prepare_input_dataframe(data)
    baseline = RuleBasedBaseline()

    if is_fallback or model is None:
        return baseline.predict(df), True

    try:
        preds = model.predict(df)
        return preds, False
    except Exception as e:
        # Fallback gracefully if model pipeline fails on unexpected input
        print(f"Warning: Model prediction failed ({e}). Falling back to rule-based heuristic.")
        return baseline.predict(df), True
