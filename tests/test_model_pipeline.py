import pytest
import os
import pandas as pd
import numpy as np
from src.models.baseline import RuleBasedBaseline
from src.models.predict import load_trained_model, prepare_input_dataframe, predict_subject_priority
from src.recommender.priority import PriorityEngine

def test_prepare_input_dataframe_fills_defaults():
    # Provide sparse dictionary
    sparse_data = {
        'Subject_ID': 'CS50',
        'Assessment_Weight': 40.0,
        'Days_To_Deadline': 5
    }
    df = prepare_input_dataframe(sparse_data)
    
    assert 'Study_Year' in df.columns
    assert 'Prior_Performance' in df.columns
    assert 'Available_Hours' in df.columns
    assert df['Study_Year'].iloc[0] == 2
    assert df['Prior_Performance'].iloc[0] == 'None'
    assert df['Available_Hours'].iloc[0] == 15.0

def test_prepare_input_dataframe_clamps_ranges():
    invalid_data = {
        'Subject_ID': 'CS99',
        'Difficulty_Rating': 10, # Out of range (max 5)
        'Assessment_Weight': 150.0, # Out of range (max 100)
        'Days_To_Deadline': -5 # Negative days
    }
    df = prepare_input_dataframe(invalid_data)
    assert df['Difficulty_Rating'].iloc[0] == 5
    assert df['Assessment_Weight'].iloc[0] == 100.0
    assert df['Days_To_Deadline'].iloc[0] == 0

def test_baseline_predictions():
    baseline = RuleBasedBaseline()
    
    # Urgent high-weight course
    high_input = pd.DataFrame([{
        'Assessment_Weight': 60.0,
        'Days_To_Deadline': 2,
        'Difficulty_Rating': 5,
        'Study_Year': 2,
        'Prior_Performance': 'None',
        'Available_Hours': 15.0
    }])
    preds_high = baseline.predict(high_input)
    assert preds_high[0] == 'High'
    
    # Easy far-away course
    low_input = pd.DataFrame([{
        'Assessment_Weight': 5.0,
        'Days_To_Deadline': 40,
        'Difficulty_Rating': 1,
        'Study_Year': 2,
        'Prior_Performance': 'None',
        'Available_Hours': 15.0
    }])
    preds_low = baseline.predict(low_input)
    assert preds_low[0] == 'Low'

def test_load_trained_model_fallback():
    # Loading non-existent model path should return baseline and True for is_fallback
    model, is_fallback = load_trained_model("non_existent_model_dir/model.pkl")
    assert is_fallback is True
    assert isinstance(model, RuleBasedBaseline)

def test_trained_model_prediction_if_present():
    model_path = 'experiments/models/Random_Forest.pkl'
    if os.path.exists(model_path):
        model, is_fallback = load_trained_model(model_path)
        assert is_fallback is False
        
        test_data = {
            'Subject_ID': 'CS301',
            'Assessment_Weight': 35.0,
            'Days_To_Deadline': 7,
            'Difficulty_Rating': 4,
            'Study_Year': 3,
            'Prior_Performance': 'Medium',
            'Available_Hours': 12.0
        }
        preds, used_fallback = predict_subject_priority(model, test_data, is_fallback=False)
        assert len(preds) == 1
        assert preds[0] in ['Low', 'Medium', 'High']
        assert used_fallback is False

def test_priority_engine_with_live_model():
    engine = PriorityEngine(model_path='experiments/models/Random_Forest.pkl')
    # Even if model file is missing or present, engine should output valid priority and explanation
    priority, explanation = engine.predict_priority({
        'Subject_ID': 'MATH101',
        'Assessment_Weight': 50.0,
        'Days_To_Deadline': 3,
        'Difficulty_Rating': 4
    })
    assert priority in ['Low', 'Medium', 'High']
    assert isinstance(explanation, str)
    assert len(explanation) > 10
