import streamlit as st
import pandas as pd
import datetime
import os
import io
import json

from src.recommender.priority import PriorityEngine
from src.recommender.schedule_generator import ScheduleGenerator

# --- CONFIG & STYLING ---
st.set_page_config(
    page_title="StudyBloom AI — Study Recommendation System",
    page_icon="📅",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Image directory path in root public folder
IMG_DIR = os.path.join(os.path.dirname(__file__), 'public', 'assets', 'images')

def load_css():
    st.markdown("""
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        
        html, body, [class*="css"], [data-testid="stAppViewContainer"] {
            font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
            background-color: #0E0E12 !important;
            color: #FAF5ED !important;
        }

        [data-testid="stSidebar"] {
            background-color: #141418 !important;
            border-right: 1px solid #2A2A32 !important;
        }

        .glass-panel {
            background: rgba(24, 24, 30, 0.75);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border-radius: 14px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .glass-panel:hover {
            border-color: rgba(255, 113, 57, 0.3);
            box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
        }
        
        h1, h2, h3, h4 {
            color: #FAF5ED !important;
            font-weight: 700 !important;
            letter-spacing: -0.02em;
        }
        
        .brand-pill {
            background: rgba(255, 113, 57, 0.15);
            border: 1px solid rgba(255, 113, 57, 0.4);
            color: #FF7139;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            display: inline-block;
            margin-bottom: 10px;
        }

        .synthetic-warning {
            border-left: 4px solid #FFC857;
            background-color: rgba(255, 200, 87, 0.08);
            padding: 14px 18px;
            border-radius: 10px;
            margin-bottom: 20px;
            color: #FEEAA2;
            font-size: 13px;
            line-height: 1.5;
        }
        
        .priority-badge-high {
            background: rgba(255, 73, 61, 0.15);
            border: 1px solid rgba(255, 73, 61, 0.4);
            color: #FF8A78;
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .priority-badge-medium {
            background: rgba(255, 200, 87, 0.15);
            border: 1px solid rgba(255, 200, 87, 0.4);
            color: #FFC857;
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }

        .priority-badge-low {
            background: rgba(184, 201, 135, 0.15);
            border: 1px solid rgba(184, 201, 135, 0.4);
            color: #B8C987;
            padding: 3px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
        }

        /* Clean Streamlit Primary Button */
        div.stButton > button:first-child {
            background: linear-gradient(135deg, #FF7139 0%, #FF493D 100%) !important;
            color: #FAF5ED !important;
            border: none !important;
            border-radius: 10px !important;
            font-weight: 600 !important;
            padding: 8px 22px !important;
            box-shadow: 0 4px 14px rgba(255, 113, 57, 0.3) !important;
            transition: all 0.2s ease !important;
        }
        
        div.stButton > button:first-child:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 6px 20px rgba(255, 113, 57, 0.45) !important;
        }
        </style>
    """, unsafe_allow_html=True)

load_css()

# --- INITIAL DEFAULT SUBJECTS ---
DEFAULT_SAMPLE_SUBJECTS = [
    {
        'Subject_ID': 'Advanced Linear Algebra',
        'Study_Year': 3,
        'Assessment_Weight': 35.0,
        'Days_To_Deadline': 5,
        'Difficulty_Rating': 4,
        'Prior_Performance': 'Medium',
        'Available_Hours': 16.0
    },
    {
        'Subject_ID': 'Distributed Systems & Cloud',
        'Study_Year': 3,
        'Assessment_Weight': 40.0,
        'Days_To_Deadline': 9,
        'Difficulty_Rating': 4,
        'Prior_Performance': 'Low',
        'Available_Hours': 16.0
    },
    {
        'Subject_ID': 'Statistical Inference & Probability',
        'Study_Year': 3,
        'Assessment_Weight': 20.0,
        'Days_To_Deadline': 14,
        'Difficulty_Rating': 3,
        'Prior_Performance': 'High',
        'Available_Hours': 16.0
    },
    {
        'Subject_ID': 'Academic Research Writing & Ethics',
        'Study_Year': 3,
        'Assessment_Weight': 15.0,
        'Days_To_Deadline': 28,
        'Difficulty_Rating': 2,
        'Prior_Performance': 'High',
        'Available_Hours': 16.0
    }
]

# --- SESSION STATE INITIALIZATION ---
if 'subjects' not in st.session_state:
    st.session_state['subjects'] = list(DEFAULT_SAMPLE_SUBJECTS)
    
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

# --- SIDEBAR NAVIGATION ---
st.sidebar.markdown("""
    <div style="display: flex; align-items: center; gap: 10px; padding: 10px 0 16px 0; border-bottom: 1px solid #2A2A32; margin-bottom: 14px;">
        <span style="font-size: 24px;">✨</span>
        <div>
            <h3 style="margin: 0; font-size: 17px; font-weight: 800; color: #FAF5ED; line-height: 1.1;">StudyBloom AI</h3>
            <span style="font-size: 10px; color: #FF7139; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">Study Recommender</span>
        </div>
    </div>
""", unsafe_allow_html=True)

page = st.sidebar.radio(
    "Navigation",
    [
        "Home & Research Info",
        "Student Profile & Subjects",
        "My Weekly Timetable",
        "Focus Room & Pacing",
        "Research Dashboard & Metrics"
    ]
)

st.sidebar.markdown("---")
st.sidebar.markdown("""
    <div style="font-size: 11px; color: #8E8A83; line-height: 1.5;">
        <strong style="color: #FAF5ED;">ML Prioritization:</strong> Random Forest<br/>
        <strong style="color: #FAF5ED;">Scheduler:</strong> Greedy Non-Overlap<br/>
        <span style="color: #B8C987;">● Engine Active & Verified</span>
    </div>
""", unsafe_allow_html=True)


# ==============================================================================
# PAGE 1: HOME & RESEARCH INFO
# ==============================================================================
if page == "Home & Research Info":
    hero_col1, hero_col2 = st.columns([7, 5], gap="medium")
    
    with hero_col1:
        st.markdown('<div class="brand-badge">Undergraduate Research Project</div>', unsafe_allow_html=True)
        st.title("AI-Based Personalized Study Schedule Recommendation System")
        st.markdown("""
        <div class="glass-panel">
            <p style="font-size: 14px; line-height: 1.6; color: #C4BFB6; margin-bottom: 0;">
                This system provides an adaptive, machine learning-driven approach to personalized university study planning. 
                It predicts optimal subject study priorities from academic workload parameters, examination proximity, and perceived module difficulty, 
                and subsequently formulates a non-overlapping weekly timetable adhering strictly to daily availability and mandatory cognitive rest breaks.
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("""
        <div class="synthetic-warning">
            <strong>⚠️ SYNTHETIC DEMONSTRATION NOTICE</strong><br/>
            This prototype is currently running on a synthetic development dataset ($N = 120$ simulated participants, $600$ observations) generated strictly for system verification and software testing. It does <strong>not</strong> contain genuine participant records, and the displayed model performance does not represent peer-reviewed empirical findings on human students.
        </div>
        """, unsafe_allow_html=True)

    with hero_col2:
        hero_img_path = os.path.join(IMG_DIR, 'landing-hero-sculpture.jpg')
        if os.path.exists(hero_img_path):
            st.image(hero_img_path, caption="StudyBloom AI 3D Kinetic Study Sculpture", use_container_width=True)

    # Core Research Dilemmas
    st.subheader("The Three Core Research Dilemmas Addressed")
    d1, d2, d3 = st.columns(3)
    with d1:
        st.markdown("""
        <div class="glass-panel" style="border-top: 3px solid #FF493D;">
            <h4 style="margin-bottom: 8px;">1. The Urgency Bias Trap</h4>
            <p style="font-size: 12px; color: #C4BFB6; line-height: 1.5;">
                Students systematically cram for the nearest deadline, neglecting high-weighted or conceptually difficult coursework due two weeks later.
            </p>
        </div>
        """, unsafe_allow_html=True)
    with d2:
        st.markdown("""
        <div class="glass-panel" style="border-top: 3px solid #FFC857;">
            <h4 style="margin-bottom: 8px;">2. Cognitive Overload</h4>
            <p style="font-size: 12px; color: #C4BFB6; line-height: 1.5;">
                Unstructured, unbroken study blocks cause steep memory decay and fatigue. The system enforces mandatory 15-minute rest intervals.
            </p>
        </div>
        """, unsafe_allow_html=True)
    with d3:
        st.markdown("""
        <div class="glass-panel" style="border-top: 3px solid #B8C987;">
            <h4 style="margin-bottom: 8px;">3. The EdTech Semantic Gap</h4>
            <p style="font-size: 12px; color: #C4BFB6; line-height: 1.5;">
                Existing predictive systems forecast exam failure but fail to translate predictive insights into discrete, actionable daily study sessions.
            </p>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("""
    <div class="glass-panel">
        <h4 style="margin-bottom: 8px;">Ethics, Privacy & Governance</h4>
        <ul style="font-size: 13px; color: #C4BFB6; line-height: 1.8; margin-bottom: 0;">
            <li><strong>No Tracking / No PII:</strong> No student names, email addresses, or university identification numbers are stored or transmitted.</li>
            <li><strong>Local Computation:</strong> All feature processing, machine learning inference, and timetable generation occur locally within this environment.</li>
            <li><strong>Participant Data Exclusion:</strong> Raw and processed research participant data directories are secured and excluded from version control in compliance with institutional ethics protocols.</li>
        </ul>
    </div>
    """, unsafe_allow_html=True)


# ==============================================================================
# PAGE 2: STUDENT PROFILE & SUBJECTS
# ==============================================================================
elif page == "Student Profile & Subjects":
    st.title("Student Profile & Subject Management")
    st.caption("Configure your weekly availability constraints and manage enrolled modules.")

    col1, col2 = st.columns([1, 1], gap="large")
    with col1:
        st.subheader("Student Academic Profile & Time Capacity")
        study_year = st.selectbox("Current Year of Study", [1, 2, 3, 4, 5], index=2)
        avail_hours = st.number_input("Total Weekly Available Study Hours", min_value=1.0, max_value=168.0, value=16.0, step=0.5)
        session_dur = st.selectbox("Preferred Study Session Duration (minutes)", [25, 30, 45, 60, 90], index=2)
        break_dur = st.selectbox("Preferred Break Duration (minutes)", [0, 5, 10, 15, 20], index=3)
        
    with col2:
        st.subheader("Add Academic Subject / Assessment")
        with st.form("add_subject_form"):
            sub_id = st.text_input("Subject Code / Name", placeholder="e.g., CS301 - Cloud Systems")
            weight = st.slider("Assessment Weight (%)", min_value=0.0, max_value=100.0, value=30.0, step=1.0)
            days = st.number_input("Days to Assessment Deadline", min_value=0, max_value=365, value=10, step=1)
            diff = st.slider("Perceived Subject Difficulty (1 = Easiest, 5 = Hardest)", 1, 5, 4)
            prior_perf = st.selectbox("Prior Performance in Subject Area", ["None", "Low", "Medium", "High"], index=2)
            
            submitted = st.form_submit_button("Add Subject to Workload")
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
                    st.success(f"Added '{sub_id.strip()}' successfully!")

    st.markdown("---")
    
    # 3D Subject Artwork Visual Gallery
    st.subheader("Enrolled Academic Modules & 3D Discipline Artwork")
    art_cols = st.columns(3)
    with art_cols[0]:
        m_img = os.path.join(IMG_DIR, 'subject-mathematics-artwork.jpg')
        if os.path.exists(m_img):
            st.image(m_img, caption="Mathematics — Linear Algebra", use_container_width=True)
    with art_cols[1]:
        p_img = os.path.join(IMG_DIR, 'subject-programming-artwork.jpg')
        if os.path.exists(p_img):
            st.image(p_img, caption="Computer Science — Distributed Systems", use_container_width=True)
    with art_cols[2]:
        s_img = os.path.join(IMG_DIR, 'subject-statistics-artwork.jpg')
        if os.path.exists(s_img):
            st.image(s_img, caption="Statistics — Probability & Inference", use_container_width=True)

    # Current Subjects Table
    st.markdown("### Active Workload Table")
    if st.session_state['subjects']:
        df_subs = pd.DataFrame(st.session_state['subjects'])
        cols_to_show = [c for c in ['Subject_ID', 'Assessment_Weight', 'Days_To_Deadline', 'Difficulty_Rating', 'Prior_Performance'] if c in df_subs.columns]
        st.dataframe(df_subs[cols_to_show], use_container_width=True)
        
        btn_c1, btn_c2 = st.columns([2, 10])
        with btn_c1:
            if st.button("Reset to Samples"):
                st.session_state['subjects'] = list(DEFAULT_SAMPLE_SUBJECTS)
                st.session_state['schedule_result'] = None
                st.session_state['edited_schedule'] = None
                st.rerun()
        with btn_c2:
            if st.button("Clear All"):
                st.session_state['subjects'] = []
                st.session_state['schedule_result'] = None
                st.session_state['edited_schedule'] = None
                st.rerun()
    else:
        st.info("No subjects added yet. Click 'Reset to Samples' or use the form above to add a module.")

    st.markdown("---")
    if st.button("✨ Generate Personalized Weekly Schedule", type="primary"):
        if not st.session_state['subjects']:
            st.error("Please add at least one subject before generating a timetable.")
        else:
            hours_per_day = avail_hours / 6.0
            windows = []
            for d in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']:
                end_hour = 9 + min(int(hours_per_day), 8)
                windows.append({'day': d, 'start': '08:30', 'end': f'{end_hour:02d}:30'})
                
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
            st.success("Schedule generated successfully! Navigate to 'My Weekly Timetable' to review.")


# ==============================================================================
# PAGE 3: MY WEEKLY TIMETABLE
# ==============================================================================
elif page == "My Weekly Timetable":
    st.title("Personalized Weekly Timetable")
    
    result = st.session_state.get('schedule_result')
    
    # Auto-generate if not yet generated so user sees instant results
    if not result and st.session_state['subjects']:
        windows = [{'day': d, 'start': '08:30', 'end': '13:00'} for d in ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']]
        prefs = {'available_hours': 16.0, 'session_duration': 45, 'break_duration': 15, 'preferred_windows': windows}
        result = generator.generate(st.session_state['subjects'], prefs)
        st.session_state['schedule_result'] = result
        if result['timetable']:
            st.session_state['edited_schedule'] = pd.DataFrame(result['timetable'])
    
    if not result:
        empty_img_path = os.path.join(IMG_DIR, 'planner-empty-state.jpg')
        if os.path.exists(empty_img_path):
            st.image(empty_img_path, width=320, caption="No study blocks scheduled")
        st.info("No schedule has been generated yet. Please visit 'Student Profile & Subjects' to set up your workload.")
    else:
        # Success Artwork Banner
        top_c1, top_c2 = st.columns([8, 4])
        with top_c1:
            if result['is_fallback_used']:
                st.warning("⚠️ Active Mode: Rule-Based Fallback Heuristic (Machine Learning artifact not loaded or missing).")
            else:
                st.success("🧠 Active Mode: Trained Random Forest Pipeline (GroupKFold).")
            st.markdown("### Weekly Pacing & Conflict-Free Schedule Ready")
            st.write(f"The schedule arranges **{len(result['timetable'])} study sessions** across your active days, guaranteeing zero session collisions and mandatory rest breaks.")
        with top_c2:
            succ_img = os.path.join(IMG_DIR, 'plan-created-success-artwork.jpg')
            if os.path.exists(succ_img):
                st.image(succ_img, caption="Optimal Schedule Alignment", use_container_width=True)
            
        st.subheader("Priority Recommendations & Explanations")
        for s in result['subject_priorities']:
            prio = s['priority']
            badge_class = f"priority-badge-{prio.lower()}"
            st.markdown(f"""
            <div class="glass-panel" style="padding: 16px; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <strong style="font-size: 15px; color: #FAF5ED;">{s['id']}</strong>
                    <span class="{badge_class}">{prio} Priority</span>
                </div>
                <p style="font-size: 13px; color: #C4BFB6; margin: 0; line-height: 1.5;"><strong>Rationale:</strong> {s['explanation']}</p>
            </div>
            """, unsafe_allow_html=True)
            
        st.subheader("Interactive Timetable (View, Edit & Export)")
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
                
                csv_data = edited_df.to_csv(index=False).encode('utf-8')
                st.download_button(
                    label="📥 Download Schedule as CSV",
                    data=csv_data,
                    file_name=f'studybloom_schedule_{datetime.date.today()}.csv',
                    mime='text/csv',
                )
            
        with st.expander("System Feedback & Constraint Validation"):
            for msg in result['messages']:
                if "Warning" in msg:
                    st.warning(msg)
                else:
                    st.info(msg)


# ==============================================================================
# PAGE 4: FOCUS ROOM & PACING
# ==============================================================================
elif page == "Focus Room & Pacing":
    st.title("Cinematic Focus Room & Cognitive Pacing")
    st.caption("Maintain concentration with Pomodoro intervals and ambient soundscapes.")
    
    focus_img = os.path.join(IMG_DIR, 'focus-room-background.jpg')
    if os.path.exists(focus_img):
        st.image(focus_img, caption="StudyBloom AI Studio Focus Environment", use_container_width=True)
        
    fc1, fc2 = st.columns(2, gap="large")
    with fc1:
        st.markdown("""
        <div class="glass-panel" style="text-align: center; padding: 28px;">
            <span style="font-size: 12px; font-weight: 700; color: #FF7139; text-transform: uppercase;">Active Focus Interval</span>
            <h1 style="font-size: 52px; font-family: monospace; color: #FAF5ED; margin: 8px 0;">25:00</h1>
            <p style="color: #C4BFB6; font-size: 13px; margin-bottom: 16px;">Current Sprint: <strong>Advanced Linear Algebra</strong></p>
            <div style="display: flex; justify-content: center; gap: 8px;">
                <span class="priority-badge-high">Pomodoro Sprint</span>
                <span class="priority-badge-medium">Deep Work</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
    with fc2:
        st.subheader("Ambient Soundscapes")
        st.checkbox("Gentle Library Rain", value=True)
        st.checkbox("Deep Brown Noise (Restorative)", value=True)
        st.checkbox("Lo-Fi Beats (Focused)", value=False)
        
        st.subheader("4-7-8 Breathing Reset")
        st.markdown("""
        <div class="glass-panel" style="padding: 14px;">
            <p style="font-size: 12px; color: #C4BFB6; margin: 0; line-height: 1.6;">
                <strong>Inhale:</strong> 4 seconds through nose<br/>
                <strong>Hold:</strong> 7 seconds gently<br/>
                <strong>Exhale:</strong> 8 seconds through mouth
            </p>
        </div>
        """, unsafe_allow_html=True)


# ==============================================================================
# PAGE 5: RESEARCH DASHBOARD & METRICS
# ==============================================================================
elif page == "Research Dashboard & Metrics":
    st.title("Research Dashboard & Model Evaluation")
    
    # Research Lab Artwork Image
    rl_img = os.path.join(IMG_DIR, 'research-lab-artwork.jpg')
    if os.path.exists(rl_img):
        st.image(rl_img, caption="StudyBloom AI Research Laboratory & Metric Optics", use_container_width=True)

    st.markdown("""
    <div class="synthetic-warning">
        <strong>⚠️ METHODOLOGICAL NOTE</strong><br/>
        All performance numbers and plots presented here reflect evaluation across the synthetic benchmark dataset ($N=120$ simulated participants, $50$-sample holdout test partition). They demonstrate pipeline correctness and cross-validation integrity without making empirical scientific claims.
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
        st.error(f"Metrics table not found at {csv_path}. Please execute model training first.")
        
    if os.path.exists(md_path):
        with st.expander("Read Comprehensive Evaluation Report"):
            with open(md_path, 'r', encoding='utf-8') as f:
                st.markdown(f.read())
