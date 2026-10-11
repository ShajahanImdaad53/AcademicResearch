import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, ClassifierMixin

class RuleBasedBaseline(BaseEstimator, ClassifierMixin):
    """
    A simple transparent rule-based heuristic that assigns priority based on
    Assessment Weight, Days to Deadline, and Difficulty Rating.
    This serves as our baseline.
    """
    def __init__(self):
        self.classes_ = np.array(['Low', 'Medium', 'High'])
        
    def fit(self, X, y=None):
        # The rule-based baseline doesn't require fitting to data
        return self
        
    def predict(self, X):
        # We assume X is a pandas DataFrame before scikit-learn preprocessing,
        # or we have to extract the original features if it's an array.
        # To make it compatible with raw DataFrame evaluation:
        if not isinstance(X, pd.DataFrame):
            raise ValueError("RuleBasedBaseline expects a Pandas DataFrame to extract feature names.")
            
        predictions = []
        for _, row in X.iterrows():
            weight = row['Assessment_Weight']
            days = row['Days_To_Deadline']
            difficulty = row['Difficulty_Rating']
            
            # Simple heuristic formula
            score = (weight / (days + 1)) * difficulty
            
            if score > 50:
                predictions.append('High')
            elif score > 15:
                predictions.append('Medium')
            else:
                predictions.append('Low')
                
        return np.array(predictions)
