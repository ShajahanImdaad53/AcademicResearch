import pytest
import datetime
from src.recommender.priority import PriorityEngine
from src.recommender.schedule_generator import ScheduleGenerator

@pytest.fixture
def mock_subjects():
    return [
        {
            'Subject_ID': 'CS101',
            'Assessment_Weight': 50.0,
            'Days_To_Deadline': 3, # Urgent, should be High priority
            'Difficulty_Rating': 5,
            'Study_Year': 2,
            'Prior_Performance': 'Low',
            'Available_Hours': 4.0
        },
        {
            'Subject_ID': 'ENG201',
            'Assessment_Weight': 10.0,
            'Days_To_Deadline': 30, # Low priority
            'Difficulty_Rating': 2,
            'Study_Year': 2,
            'Prior_Performance': 'High',
            'Available_Hours': 4.0
        }
    ]

@pytest.fixture
def mock_preferences():
    return {
        'available_hours': 4.0, # 240 minutes total
        'session_duration': 60,
        'break_duration': 15,
        'preferred_windows': [
            {'day': 'Monday', 'start': '10:00', 'end': '15:00'} # 5 hours window (300 mins)
        ]
    }

def test_priority_fallback_and_explanation(mock_subjects):
    engine = PriorityEngine(model_path='invalid_path.pkl')
    assert engine.is_fallback is True
    
    priority_cs, exp_cs = engine.predict_priority(mock_subjects[0])
    assert priority_cs == 'High'
    assert "urgent deadline" in exp_cs or "high assessment" in exp_cs
    
    priority_eng, exp_eng = engine.predict_priority(mock_subjects[1])
    assert priority_eng == 'Low'
    assert "deadline is far away" in exp_eng or "relatively easy" in exp_eng

def test_schedule_generator_allocations(mock_subjects, mock_preferences):
    engine = PriorityEngine(model_path='invalid_path.pkl')
    sg = ScheduleGenerator(engine)
    
    result = sg.generate(mock_subjects, mock_preferences)
    
    allocs = result['time_allocations']
    # Weights: High=3, Low=1. Total=4. 
    # CS101 should get 3/4 of 4 hours = 3 hours (180 mins)
    # ENG201 should get 1/4 of 4 hours = 1 hour (60 mins)
    assert allocs['CS101'] == 180.0
    assert allocs['ENG201'] == 60.0

def test_schedule_constraints_and_breaks(mock_subjects, mock_preferences):
    engine = PriorityEngine(model_path='invalid_path.pkl')
    sg = ScheduleGenerator(engine)
    
    result = sg.generate(mock_subjects, mock_preferences)
    timetable = result['timetable']
    
    assert len(timetable) > 0
    
    # Check no overlap
    for i in range(len(timetable) - 1):
        current_end = datetime.datetime.strptime(timetable[i]['end'], "%H:%M")
        next_start = datetime.datetime.strptime(timetable[i+1]['start'], "%H:%M")
        assert current_end <= next_start, f"Overlapping sessions detected: {timetable[i]} vs {timetable[i+1]}"
        
    # Check session durations
    for session in timetable:
        start = datetime.datetime.strptime(session['start'], "%H:%M")
        end = datetime.datetime.strptime(session['end'], "%H:%M")
        duration = (end - start).seconds / 60
        if session['type'] == 'Study':
            assert duration == mock_preferences['session_duration']
        else:
            assert duration == mock_preferences['break_duration']

def test_insufficient_availability(mock_subjects):
    engine = PriorityEngine(model_path='invalid_path.pkl')
    sg = ScheduleGenerator(engine)
    
    prefs = {
        'available_hours': 10.0, # Wants 10 hours
        'session_duration': 60,
        'break_duration': 15,
        'preferred_windows': [
            {'day': 'Monday', 'start': '10:00', 'end': '11:00'} # Only 1 hour actual window!
        ]
    }
    
    result = sg.generate(mock_subjects, prefs)
    assert any("Insufficient available time" in msg for msg in result['messages'])

def test_zero_and_negative_available_hours(mock_subjects):
    engine = PriorityEngine(model_path='invalid_path.pkl')
    sg = ScheduleGenerator(engine)
    
    # Zero hours
    result_zero = sg.generate(mock_subjects, {'available_hours': 0.0})
    assert result_zero['timetable'] == []
    assert any("zero or negative" in msg for msg in result_zero['messages'])
    
    # Negative hours
    result_neg = sg.generate(mock_subjects, {'available_hours': -5.0})
    assert result_neg['timetable'] == []
    assert any("zero or negative" in msg for msg in result_neg['messages'])

def test_empty_subjects_list():
    engine = PriorityEngine(model_path='invalid_path.pkl')
    sg = ScheduleGenerator(engine)
    
    result = sg.generate([], {'available_hours': 10.0})
    assert result['timetable'] == []
    assert any("No subjects" in msg for msg in result['messages'])

def test_window_too_short_for_session(mock_subjects):
    engine = PriorityEngine(model_path='invalid_path.pkl')
    sg = ScheduleGenerator(engine)
    
    prefs = {
        'available_hours': 2.0,
        'session_duration': 60,
        'break_duration': 15,
        'preferred_windows': [
            {'day': 'Monday', 'start': '10:00', 'end': '10:30'} # 30 mins window, session is 60 mins
        ]
    }
    result = sg.generate(mock_subjects, prefs)
    # No session can fit in 30 mins
    assert len(result['timetable']) == 0
    assert any("Insufficient available time" in msg for msg in result['messages'])

def test_zero_break_duration(mock_subjects):
    engine = PriorityEngine(model_path='invalid_path.pkl')
    sg = ScheduleGenerator(engine)
    
    prefs = {
        'available_hours': 2.0,
        'session_duration': 60,
        'break_duration': 0, # Zero break
        'preferred_windows': [
            {'day': 'Monday', 'start': '10:00', 'end': '12:00'}
        ]
    }
    result = sg.generate(mock_subjects, prefs)
    # Timetable should have only study sessions, no break sessions
    break_sessions = [s for s in result['timetable'] if s['type'] == 'Break']
    assert len(break_sessions) == 0
    assert len(result['timetable']) == 2
