import os
import pandas as pd
import numpy as np

def generate_synthetic_data(num_participants=50, subjects_per_participant=5, seed=42):
    np.random.seed(seed)
    
    data = []
    prior_performance_options = ['High', 'Medium', 'Low', 'None']
    target_priority_options = ['Low', 'Medium', 'High']
    
    for i in range(1, num_participants + 1):
        participant_id = f'P{i:03d}'
        study_year = np.random.choice([1, 2, 3, 4, 5])
        available_hours = np.round(np.random.uniform(5.0, 40.0), 1)
        
        for j in range(1, subjects_per_participant + 1):
            subject_id = f'SUB_{j}'
            difficulty = np.random.randint(1, 6)
            prior_perf = np.random.choice(prior_performance_options, p=[0.3, 0.4, 0.2, 0.1])
            days_to_deadline = np.random.randint(0, 90)
            assessment_weight = np.round(np.random.uniform(0.0, 100.0), 1)
            
            # For purely synthetic purposes, we simulate the rule-based logic to assign target
            # So the ML model has a pattern to learn.
            # priority_score = (Assessment_Weight / (Days_To_Deadline + 1)) * Difficulty
            score = (assessment_weight / (days_to_deadline + 1)) * difficulty
            if score > 50:
                target = 'High'
            elif score > 15:
                target = 'Medium'
            else:
                target = 'Low'
                
            # Add some noise (10% of the time, pick random target)
            if np.random.rand() < 0.1:
                target = np.random.choice(target_priority_options)
            
            data.append({
                'Participant_ID': participant_id,
                'Subject_ID': subject_id,
                'Study_Year': study_year,
                'Difficulty_Rating': difficulty,
                'Prior_Performance': prior_perf,
                'Days_To_Deadline': days_to_deadline,
                'Assessment_Weight': assessment_weight,
                'Available_Hours': available_hours,
                'Target_Priority': target
            })
            
    df = pd.DataFrame(data)
    
    # Create required directories
    os.makedirs('data/synthetic_demo', exist_ok=True)
    os.makedirs('data/raw', exist_ok=True)
    os.makedirs('data/processed', exist_ok=True)
    
    output_path = 'data/synthetic_demo/synthetic_data.csv'
    df.to_csv(output_path, index=False)
    print(f"Generated synthetic dataset with {len(df)} records at {output_path}")

if __name__ == "__main__":
    generate_synthetic_data()
