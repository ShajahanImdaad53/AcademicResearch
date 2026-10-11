import os
import joblib
import pandas as pd
from src.models.baseline import RuleBasedBaseline
from src.models.predict import load_trained_model, predict_subject_priority

class PriorityEngine:
    def __init__(self, model_path='experiments/models/Random_Forest.pkl'):
        """
        Initializes the Priority Engine. Attempts to load a trained ML model.
        If unavailable or invalid, falls back to the Rule-Based Baseline.
        """
        self.model_path = model_path
        self.model, self.is_fallback = load_trained_model(self.model_path)
            
    def predict_priority(self, subject_data):
        """
        Predicts priority and provides an explanation.
        subject_data is a dictionary containing the features.
        Missing features are automatically completed with valid defaults.
        """
        preds, used_fallback = predict_subject_priority(self.model, subject_data, self.is_fallback)
        priority = preds[0]
        
        # If fallback was triggered dynamically during prediction
        if used_fallback and not self.is_fallback:
            self.is_fallback = True
            
        explanation = self._generate_explanation(subject_data, priority)
        return priority, explanation
        
    def _generate_explanation(self, data, priority):
        weight = data.get('Assessment_Weight', 20.0)
        days = data.get('Days_To_Deadline', 14)
        diff = data.get('Difficulty_Rating', 3)
        perf = data.get('Prior_Performance', 'None')
        
        reasons = []
        if priority == 'High':
            if days <= 7:
                reasons.append(f"urgent deadline in {days} day(s)")
            if weight >= 30:
                reasons.append(f"high assessment weight ({weight}%)")
            if diff >= 4:
                reasons.append(f"high perceived difficulty ({diff}/5)")
            if perf in ['Low', 'None']:
                reasons.append(f"prior performance level ('{perf}') requiring active review")
            
            if not reasons:
                reasons.append("the model detected a complex pattern requiring urgent attention")
                
            return f"Assigned HIGH priority because of " + ", and ".join(reasons) + "."
            
        elif priority == 'Medium':
            reasons.append("steady pacing is required")
            if days <= 14:
                reasons.append(f"an approaching deadline in {days} day(s)")
            if diff == 3:
                reasons.append("moderate difficulty")
            return f"Assigned MEDIUM priority because " + " and ".join(reasons) + "."
            
        else:
            if days > 14:
                reasons.append(f"deadline is far away ({days} days)")
            if diff <= 2:
                reasons.append("it is perceived as relatively easy")
            if weight <= 15:
                reasons.append(f"lower assessment weight ({weight}%)")
            
            if not reasons:
                reasons.append("other subjects have greater urgency")
                
            return f"Assigned LOW priority because " + " and ".join(reasons) + "."
