"""
FastAPI Backend Server for StudyBloom AI
Serves the Machine Learning Priority Classification and Constraint-Satisfaction Scheduling Engine.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os
import pandas as pd

from src.recommender.priority import PriorityEngine
from src.recommender.schedule_generator import ScheduleGenerator

app = FastAPI(
    title="StudyBloom AI Backend API",
    description="Machine Learning Priority Recommendation & Constraint Timetabling API",
    version="2.0.0"
)

# Enable CORS for the Vite React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
priority_engine = PriorityEngine(model_path='experiments/models/Random_Forest.pkl')
schedule_generator = ScheduleGenerator(priority_engine)


class SubjectInput(BaseModel):
    Subject_ID: Optional[str] = "SUB_01"
    Subject_Name: str
    Difficulty_Rating: int = Field(ge=1, le=5, default=3)
    Prior_Performance: str = Field(default="Medium")
    Days_To_Deadline: int = Field(ge=1, le=180, default=14)
    Assessment_Weight: float = Field(ge=0.0, le=100.0, default=25.0)
    Available_Hours: Optional[float] = 15.0


class TimeWindow(BaseModel):
    day: str
    start: str  # e.g. "09:00"
    end: str    # e.g. "13:00"


class SchedulePreferences(BaseModel):
    available_hours: float = 15.0
    session_duration: int = 45  # minutes
    break_duration: int = 15    # minutes
    preferred_windows: List[Dict[str, str]] = []


class ScheduleRequest(BaseModel):
    subjects: List[SubjectInput]
    preferences: SchedulePreferences


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "StudyBloom AI API",
        "model_loaded": not priority_engine.is_fallback,
        "active_model": "Random Forest Classifier (GroupKFold)" if not priority_engine.is_fallback else "Rule-Based Baseline"
    }


@app.get("/api/models")
def list_models():
    models_dir = "experiments/models"
    available = []
    if os.path.exists(models_dir):
        for f in os.listdir(models_dir):
            if f.endswith(".pkl"):
                available.append(f.replace(".pkl", ""))
    return {
        "active_model": "Random_Forest",
        "available_models": available,
        "is_fallback_active": priority_engine.is_fallback
    }


@app.post("/api/predict-priority")
def predict_priority(subject: SubjectInput):
    data = subject.model_dump()
    priority, explanation = priority_engine.predict_priority(data)
    return {
        "subject_name": subject.Subject_Name,
        "priority": priority,
        "explanation": explanation,
        "source": "Machine Learning (Random Forest)" if not priority_engine.is_fallback else "Rule-Based Fallback"
    }


@app.post("/api/generate-schedule")
def generate_schedule(req: ScheduleRequest):
    subjects_context = [s.model_dump() for s in req.subjects]
    prefs = req.preferences.model_dump()
    
    result = schedule_generator.generate(subjects_context, prefs)
    return result


@app.get("/api/research-metrics")
def get_research_metrics():
    comparison_csv = "reports/model_comparison.csv"
    if os.path.exists(comparison_csv):
        df = pd.read_csv(comparison_csv)
        records = df.to_dict(orient="records")
        return {
            "source": "reports/model_comparison.csv",
            "metrics": records,
            "test_sample_size": 50,
            "synthetic_participants": 120,
            "human_participants": 0,
            "ethics_status": "Pending Formal Review"
        }
    return {
        "error": "Metrics file not found"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
