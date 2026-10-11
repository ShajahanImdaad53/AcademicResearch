import streamlit as st
import pandas as pd
import datetime
import os
import io
import json

from src.recommender.priority import PriorityEngine
from src.recommender.schedule_generator import ScheduleGenerator

# --- CONFIG & STYLING ---
st.set_page_config(page_title="AI Study Scheduler", page_icon="📅", layout="wide")

def load_css():
    st.markdown("""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        html, body, [class*="css"] {
            font-family: 'Inter', sans-serif;
        }
        
        .glass-panel {
            background: rgba(30, 30, 30, 0.65);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 22px;
            margin-bottom: 22px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .glass-panel:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        
        h1, h2, h3, h4 {
            color: #F8FAFC !important;
            font-weight: 600 !important;
        }
        
        .synthetic-warning {
            border-left: 5px solid #F59E0B;
            background-color: rgba(245, 158, 11, 0.12);
            padding: 16px;
            border-radius: 6px;
            margin-bottom: 20px;
            color: #FDE68A;
        }
        </style>
    """, unsafe_allow_html=True)

load_css()

# --- SESSION STATE INITIALIZATION ---
if 'subjects' not in st.session_state:
    st.session_state['subjects'] = []
    
if 'schedule_result' not in st.session_state:
    st.session_state['schedule_result'] = None

if 'edited_schedule' not in st.session_state:
    st.session_state['edited_schedule'] = None

# --- ENGINE SETUP ---
@st.cache_resource
def get_engine():
    return PriorityEngine(model_path='experiments/models/Random_Forest.pkl')

engine = get_engine()
generator = ScheduleGenerator(engine)

# --- NAVIGATION ---
st.sidebar.title("Navigation")
page = st.sidebar.radio("Go to", ["Home & Research Info", "Student Profile & Subjects", "My Timetable", "Research Dashboard"])

# --- PAGE: HOME ---
if page == "Home & Research Info":
    st.title("AI-Based Personalized Study Schedule Recommendation System")
    st.markdown("""
    <div class="glass-panel">
        <h3>Undergraduate Research Prototype</h3>
        <p>This prototype demonstrates an adaptive, machine learning-driven study planning system. It predicts subject study priorities using academic profile variables, deadlines, and perceived difficulty, and then formulates a non-overlapping weekly timetable adhering to study and break duration constraints.</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div class="synthetic-warning">
        <strong>⚠️ SYNTHETIC DEMONSTRATION NOTICE</strong><br/>
        This prototype is currently running on a synthetic development dataset generated strictly for system verification and software testing. It does <strong>not</strong> contain genuine participant records, and the displayed model performance does not represent peer-reviewed empirical findings on human students.
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("""
    <div class="glass-panel">
        <h3>Ethics, Privacy & Governance</h3>
        <ul>
            <li><strong>No Tracking / No PII:</strong> No student names, email addresses, or university identification numbers are stored or transmitted.</li>
            <li><strong>Local Computation:</strong> All feature processing, machine learning inference, and timetable generation occur locally within this environment.</li>
            <li><strong>Participant Data Exclusion:</strong> Raw and processed research participant data directories are secured and excluded from version control in compliance with institutional ethics protocols.</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)

# --- PAGE: PROFILE & SUBJECTS ---
elif page == "Student Profile & Subjects":
    st.title("Student Profile & Subject Management")
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Student Academic Profile & Time Capacity")
        study_year = st.selectbox("Current Year of Study", [1, 2, 3, 4], index=1)
        avail_hours = st.number_input("Total Weekly Available Study Hours", min_value=1.0, max_value=168.0, value=15.0, step=0.5)
        session_dur = st.selectbox("Preferred Study Session Duration (minutes)", [30, 45, 60, 90, 120], index=2)
        break_dur = st.selectbox("Preferred Break Duration (minutes)", [0, 5, 10, 15, 20, 30], index=3)
        
    with col2:
        st.subheader("Add Academic Subject / Assessment")
        with st.form("add_subject_form"):
            sub_id = st.text_input("Subject Code / Name", placeholder="e.g., CS101 - Algorithms")
            weight = st.slider("Assessment Weight (%)", min_value=0.0, max_value=100.0, value=30.0, step=1.0)
            days = st.number_input("Days to Assessment Deadline", min_value=0, max_value=365, value=14, step=1)
            diff = st.slider("Perceived Subject Difficulty (1 = Easiest, 5 = Hardest)", 1, 5, 3)
            prior_perf = st.selectbox("Prior Performance in Subject Area", ["None", "Low", "Medium", "High"], index=0)
            
            submitted = st.form_submit_button("Add Subject to Plan")
            
            if submitted:
                if not sub_id.strip():
                    st.error("Please enter a valid Subject Code or Name.")
                else:
                    st.session_state['subjects'].append({
                        'Subject_ID': sub_id.strip(),
                        'Study_Year': study_year,
                        'Assessment_Weight': weight,
                        'Days_To_Deadline': days,
                        'Difficulty_Rating': diff,
                        'Prior_Performance': prior_perf,
                        'Available_Hours': avail_hours
                    })
                    st.success(f"Added {sub_id.strip()} successfully!")
                
    st.subheader("Current Subjects in Workload")
    if st.session_state['subjects']:
        df_subs = pd.DataFrame(st.session_state['subjects'])
        st.dataframe(df_subs[['Subject_ID', 'Assessment_Weight', 'Days_To_Deadline', 'Difficulty_Rating', 'Prior_Performance']], use_container_width=True)
        if st.button("Clear All Subjects"):
            st.session_state['subjects'] = []
            st.session_state['schedule_result'] = None
            st.session_state['edited_schedule'] = None
            st.rerun()
    else:
        st.info("No subjects added yet. Add at least one subject using the form above.")
            
    st.markdown("---")
    if st.button("Generate Personalized Weekly Schedule", type="primary"):
        if not st.session_state['subjects']:
            st.error("Please add at least one subject before generating a timetable.")
        else:
            # Construct week study windows
            hours_per_day = avail_hours / 5.0
            windows = []
            for d in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']:
                end_hour = 9 + min(int(hours_per_day), 8)
                windows.append({'day': d, 'start': '09:00', 'end': f'{end_hour:02d}:00'})
                
            prefs = {
                'available_hours': avail_hours,
                'session_duration': session_dur,
                'break_duration': break_dur,
                'preferred_windows': windows
            }
            
            result = generator.generate(st.session_state['subjects'], prefs)
            st.session_state['schedule_result'] = result
            if result['timetable']:
                st.session_state['edited_schedule'] = pd.DataFrame(result['timetable'])
            st.success("Schedule successfully created! Navigate to 'My Timetable' to review and customize.")

# --- PAGE: TIMETABLE ---
elif page == "My Timetable":
    st.title("Personalized Weekly Timetable")
    
    result = st.session_state.get('schedule_result')
    
    if not result:
        st.info("No schedule has been generated yet. Please visit the 'Student Profile & Subjects' page to set up your workload.")
    else:
        if result['is_fallback_used']:
            st.warning("⚠️ Active Mode: Rule-Based Fallback Heuristic (Machine Learning artifact not loaded or missing).")
        else:
            st.success("🧠 Active Mode: Trained Random Forest Pipeline.")
            
        st.subheader("Priority Recommendations & Explanations")
        for s in result['subject_priorities']:
            color = "#10B981" if s['priority'] == 'Low' else "#F59E0B" if s['priority'] == 'Medium' else "#EF4444"
            st.markdown(f"""
            <div class="glass-panel" style="border-left: 5px solid {color};">
                <h4>{s['id']} — <span style="color: {color};">{s['priority'].upper()} PRIORITY</span></h4>
                <p><strong>Rationale:</strong> {s['explanation']}</p>
            </div>
            """, unsafe_allow_html=True)
            
        st.subheader("Interactive Timetable (View & Edit)")
        if not result['timetable']:
            st.error("No sessions could be scheduled based on the provided time constraints.")
        else:
            st.caption("You can edit session titles, start/end times, and days directly in the table below before exporting.")
            
            if st.session_state.get('edited_schedule') is not None:
                edited_df = st.data_editor(
                    st.session_state['edited_schedule'],
                    num_rows="dynamic",
                    use_container_width=True
                )
                st.session_state['edited_schedule'] = edited_df
                
                # CSV Export
                csv_data = edited_df.to_csv(index=False).encode('utf-8')
                st.download_button(
                    label="📥 Download Schedule as CSV",
                    data=csv_data,
                    file_name='personalized_study_schedule.csv',
                    mime='text/csv',
                )
            
        st.subheader("System Feedback & Constraint Validation")
        for msg in result['messages']:
            if "Warning" in msg:
                st.warning(msg)
            else:
                st.info(msg)

# --- PAGE: DASHBOARD ---
elif page == "Research Dashboard":
    st.title("Research Dashboard & Model Evaluation")
    st.markdown("""
    <div class="synthetic-warning">
        <strong>⚠️ METHODOLOGICAL NOTE</strong><br/>
        All performance numbers and plots presented here reflect evaluation across the synthetic benchmark dataset. They demonstrate pipeline correctness and cross-validation integrity without making empirical scientific claims.
    </div>
    """, unsafe_allow_html=True)
    
    csv_path = 'reports/model_comparison.csv'
    md_path = 'reports/model_evaluation.md'
    
    if os.path.exists(csv_path):
        df_metrics = pd.read_csv(csv_path)
        st.subheader("Model Comparison Summary Table")
        st.dataframe(df_metrics, use_container_width=True)
        
        st.subheader("Macro F1-Score Comparison")
        st.bar_chart(data=df_metrics, x='Model', y='F1-Score (Macro)')
    else:
        st.error(f"Metrics table not found at {csv_path}. Please execute Phase 4 training first.")
        
    if os.path.exists(md_path):
        with st.expander("Read Comprehensive Evaluation Report"):
            with open(md_path, 'r', encoding='utf-8') as f:
                st.markdown(f.read())
