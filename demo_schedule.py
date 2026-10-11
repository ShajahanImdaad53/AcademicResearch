import json
from src.recommender.priority import PriorityEngine
from src.recommender.schedule_generator import ScheduleGenerator

def run_demo():
    print("--- AI Schedule Generator Demo ---")
    
    # 1. Setup Engine
    engine = PriorityEngine(model_path='experiments/models/Random_Forest.pkl')
    sg = ScheduleGenerator(engine)
    print(f"Model loaded: {'Rule-Based Fallback' if engine.is_fallback else 'Random Forest ML Model'}\n")
    
    # 2. Mock Student Data
    subjects = [
        {'Subject_ID': 'Advanced Machine Learning', 'Assessment_Weight': 50.0, 'Days_To_Deadline': 3, 'Difficulty_Rating': 5},
        {'Subject_ID': 'Data Ethics', 'Assessment_Weight': 10.0, 'Days_To_Deadline': 21, 'Difficulty_Rating': 2},
        {'Subject_ID': 'Capstone Project', 'Assessment_Weight': 30.0, 'Days_To_Deadline': 10, 'Difficulty_Rating': 4}
    ]
    
    prefs = {
        'available_hours': 8.0, 
        'session_duration': 60,
        'break_duration': 15,
        'preferred_windows': [
            {'day': 'Monday', 'start': '10:00', 'end': '14:00'}, # 4 hours
            {'day': 'Wednesday', 'start': '13:00', 'end': '17:00'} # 4 hours
        ]
    }
    
    # 3. Generate Schedule
    result = sg.generate(subjects, prefs)
    
    # 4. Print Results
    print("--- Priority Analysis ---")
    for s in result['subject_priorities']:
        print(f"Subject: {s['id']}\nPriority: {s['priority']}\nReason: {s['explanation']}\n")
        
    print("--- Generated Timetable ---")
    current_day = None
    for slot in result['timetable']:
        if slot['day'] != current_day:
            print(f"\n{slot['day']}:")
            current_day = slot['day']
        print(f"  {slot['start']} - {slot['end']} : {slot['subject']} ({slot['type']})")
        
    print("\n--- System Messages ---")
    for msg in result['messages']:
        print(f"- {msg}")

if __name__ == "__main__":
    run_demo()
