# Final Undergraduate Research Presentation Outline & Presenter Script
## AI-Based Personalized Study Schedule Recommendation System

**Candidate:** Undergraduate Student Researcher  
**Degree Programme:** BSc (Hons) Computer Science / Software Engineering  
**Target Presentation Duration:** 15 Minutes (12 Slides) + 10 Minutes Q&A  
**Date:** Academic Year 2026–2027  

---

### Overview & Presentation Strategy for Beginners
This guide provides a slide-by-slide visual layout and a **word-for-word spoken presenter script**. 
- **Pacing:** Aim for approximately 1 minute to 1 minute 15 seconds per slide.
- **Tone:** Academic, confident, and methodologically honest. 
- **Golden Rule:** Never pretend you tested on thousands of real students. Academic examiners respect a student who honestly explains: *"We built and validated the complete ML and scheduling pipeline using synthetic data while our ethical approval application is being processed."*

---

### Slide 1: Title & Introduction
- **Time:** 0:00 – 1:00 (1 min)
- **Slide Title:** AI-Based Personalized Study Schedule Recommendation System
- **Visuals on Slide:**
  - University Logo & Department Name
  - Candidate Name & Student ID
  - Academic Supervisor Name
  - Subtitle: *A Two-Stage Machine Learning and Constraint-Satisfaction Framework for Higher Education*
- **Key Points on Slide:**
  - Bridging Educational Data Mining and Actionable Study Timetabling
  - Multi-Class Priority Prediction + Conflict-Free Slot Scheduling
  - Methodologically Audited Undergraduate Research Project
- **Presenter Script (Spoken Word):**
  > "Good morning, respected members of the examination committee and my supervisor. My name is [Your Name], and today I am proud to present my undergraduate research project titled: **'AI-Based Personalized Study Schedule Recommendation System'**. 
  > 
  > In this project, we address a ubiquitous challenge faced by university students: the difficulty of organizing independent study time across multiple demanding modules. Over the next fifteen minutes, I will explain why existing calendar and AI tools fall short, introduce our novel two-stage hybrid architecture, share our empirical model benchmarking results, and demonstrate our audited working prototype."

---

### Slide 2: The Problem: The Undergraduate Time-Management Dilemma
- **Time:** 1:00 – 2:15 (1 min 15 sec)
- **Slide Title:** The Problem: Cognitive Overload & Passive Calendars
- **Visuals on Slide:**
  - Split graphic: Left = Student overwhelmed by concurrent deadlines, exam dates, and varying subject difficulty. Right = A blank, static electronic calendar.
  - Three callout boxes: Urgency Bias, Cognitive Fatigue, Semantic Gap.
- **Key Points on Slide:**
  - **Multivariate Prioritization:** Balancing difficulty, upcoming deadlines, and assessment weightings simultaneously is cognitively exhausting.
  - **The 'Urgency Bias' Trap:** Students default to cramming for tomorrow's quiz while neglecting high-weight coursework due next week.
  - **Passive Digital Tools:** Google Calendar and Todoist store deadlines, but cannot tell a student *when* or *how long* to study.
  - **The Semantic Gap:** Machine learning predicts student grades, but fails to output structured, usable calendars.
- **Presenter Script (Spoken Word):**
  > "Every undergraduate student experiences the pressure of managing multiple coursework deadlines, exams, and personal commitments all at once. Research shows that poor time management directly increases anxiety, procrastination, and student dropout rates.
  > 
  > But why hasn't technology solved this? The core problem is twofold. First, human students suffer from what psychologists call 'urgency bias'—we intuitively study whatever deadline is nearest, even if it is worth only 5% of our grade, while neglecting difficult modules worth 50% that are due two weeks later. 
  > 
  > Second, existing digital calendars are completely passive. They require manual data entry and offer zero advice on how to allocate time. Meanwhile, academic machine-learning models predict whether a student will pass or fail, but do nothing to help the student structure their daily routine to prevent failure. This is the gap our research addresses."

---

### Slide 3: Research Aims, Objectives & Research Questions
- **Time:** 2:15 – 3:30 (1 min 15 sec)
- **Slide Title:** Research Aim, Objectives & Research Questions
- **Visuals on Slide:**
  - Clean three-column summary mapping Objectives (RO) to Research Questions (RQ).
- **Key Points on Slide:**
  - **Overall Aim:** Design, implement, and evaluate an AI-driven system combining supervised classification and constraint scheduling.
  - **RO1 / RQ1 (Factors):** Identify key academic and temporal variables influencing study priority.
  - **RO2 / RQ2 (Architecture):** Engineer a two-stage hybrid architecture (ML prioritization + constraint scheduler).
  - **RO3 / RQ3 (Model Comparison):** Empirically benchmark Decision Tree, Random Forest, KNN, and Logistic Regression under participant-grouped cross-validation.
  - **RQ4 (Usability):** Evaluate conflict-free timetable generation and establish a user-evaluation framework.
- **Presenter Script (Spoken Word):**
  > "To solve this problem, our research established three clear objectives and four guiding research questions. 
  > 
  > In Objective 1, we identify the key factors that dictate study urgency—such as assessment weighting, days to deadline, and perceived difficulty. In Objective 2, we design and build a two-stage hybrid system that translates these factors into an actual weekly timetable. In Objective 3, we conduct a rigorous empirical comparison between four machine learning algorithms—Decision Tree, Random Forest, K-Nearest Neighbors, and Logistic Regression—against a rule-based baseline. 
  > 
  > Finally, in Research Question 4, we evaluate whether our scheduling engine produces conflict-free, fatigue-aware timetables that fit real student life."

---

### Slide 4: Literature Review & Key Gaps
- **Time:** 3:30 – 4:45 (1 min 15 sec)
- **Slide Title:** Literature Review: Where Current Systems Fall Short
- **Visuals on Slide:**
  - Synthesis table showing Educational Data Mining (EDM), Operations Research (CSP/ILP), and Educational Recommender Systems (ERS).
- **Key Points on Slide:**
  - **Educational Data Mining (EDM):** Predicts dropout or grades (Zawacki-Richter et al., 2019), but lacks prescriptive intervention.
  - **Operations Research & Timetabling:** Excellent at university exam room scheduling, but too rigid for personal, dynamic student habits.
  - **Educational Recommenders (ERS):** Collaborative filtering (Resnick et al., 1994) identifies *what* to read, not *when* to study.
  - **Identified Gap:** An absence of systems that combine personalized predictive prioritization with constraint-aware timetable generation.
- **Presenter Script (Spoken Word):**
  > "In our literature review, which synthesized 34 verified academic sources, we examined three main domains. 
  > 
  > First, Educational Data Mining. Researchers have built excellent models to predict grades, but prediction alone does not solve the student's daily struggle. Second, Operations Research. Algorithms like Integer Linear Programming can solve complex university timetabling problems, but they are rigid and do not adapt to individual student difficulty or cognitive fatigue. Third, Educational Recommenders, which typically recommend textbooks or courses, but ignore calendar constraints.
  > 
  > Our literature gap analysis clearly demonstrated the need for a hybrid bridge: using machine learning to deduce subject priority, and constraint satisfaction to build the calendar."

---

### Slide 5: Proposed Solution: The Two-Stage Hybrid Architecture
- **Time:** 4:45 – 6:00 (1 min 15 sec)
- **Slide Title:** System Architecture: A Two-Stage Hybrid Pipeline
- **Visuals on Slide:**
  - High-level architecture flowchart (Figure 3.1 from the research report).
  - Stage 1 box (ML Classifier) feeding into Stage 2 box (Constraint-Satisfaction Scheduler).
- **Key Points on Slide:**
  - **Stage 1: Machine Learning Priority Classification:**
    - Inputs: Subject difficulty, performance history, days until deadline, assessment weight.
    - Output: Discrete Priority Tier (`High`, `Medium`, `Low`).
  - **Stage 2: Constraint-Satisfaction Heuristic Timetabling:**
    - Inputs: Predicted priority tiers, student availability windows, break preferences.
    - Output: Conflict-free weekly calendar with Pomodoro-style rest breaks.
  - **Decoupled Architecture:** Eliminates black-box calendar hallucination and guarantees mathematical feasibility.
- **Presenter Script (Spoken Word):**
  > "Why did we choose a two-stage hybrid architecture rather than having an AI model generate the schedule directly? 
  > 
  > Direct schedule generation using machine learning or neural networks often causes severe constraint violations—sessions overlap, breaks are forgotten, or schedules exceed available hours. 
  > 
  > By decoupling the system into two distinct stages, we get the best of both worlds. In Stage 1, supervised machine learning handles the subjective, pattern-recognition task: deciding which subjects require High, Medium, or Low attention. In Stage 2, a deterministic scheduling engine handles the strict mathematics: allocating hours proportionally, placing sessions into available windows, and enforcing mandatory rest breaks. This guarantees that our system never produces an overlapping or impossible timetable."

---

### Slide 6: Methodology & Preventing Data Leakage
- **Time:** 6:00 – 7:15 (1 min 15 sec)
- **Slide Title:** Methodological Rigor: GroupKFold & Data Leakage Prevention
- **Visuals on Slide:**
  - Diagram contrasting standard `train_test_split` (leaking participant rows) vs. `GroupKFold` (keeping all subjects of Participant A in the same fold).
  - Ethics shield graphic: Data minimization, no PII, Git isolation.
- **Key Points on Slide:**
  - **The Grouping Trap in EDM:** Students study 4–6 subjects simultaneously. If rows are randomly shuffled, the model memorizes student traits across train and test sets.
  - **Participant-Aware GroupKFold ($k=5$):** All subjects belonging to a single participant remain strictly isolated in either training or testing.
  - **Scikit-Learn Pipelines:** Feature scaling and imputation are fitted exclusively on training folds.
  - **Ethics & Privacy:** Complete omission of Personally Identifiable Information (PII); raw data secured from Git repositories.
- **Presenter Script (Spoken Word):**
  > "Methodological rigor was a top priority in this research. In educational datasets, each student typically contributes four to six subjects. A very common beginner mistake is using standard random train/test splitting. If you randomly shuffle the dataset, Module 1 and Module 2 from the same student end up in training, while Module 3 ends up in the test set. Because student-level traits like available hours are shared, the model simply memorizes the student's identity, causing severe data leakage and artificially inflated scores.
  > 
  > To prevent this, we implemented participant-aware `GroupKFold` cross-validation with five splits. We ensured that zero data from test participants ever leaked into the training folds. Furthermore, we encapsulated all scaling and imputation inside Scikit-Learn pipelines so that no test statistics could bias model training."

---

### Slide 7: Feature Engineering & The Ground Truth Dilemma
- **Time:** 7:15 – 8:30 (1 min 15 sec)
- **Slide Title:** Feature Engineering & The Ground Truth Labeling Dilemma
- **Visuals on Slide:**
  - Feature table: Difficulty Rating (1–5), Prior Performance, Days to Deadline, Assessment Weight, Available Hours.
  - Formula box showing the Heuristic Priority Index.
- **Key Points on Slide:**
  - **Five Operational Features:** Capturing cognitive difficulty, academic importance, and temporal urgency.
  - **The Labeling Dilemma:**
    - *Organic Labels:* Subjective student self-ratings (prone to noise and optimism bias).
    - *Formula Baseline:* Multi-factor index: $\text{Score} = (\frac{\text{Weight}}{\text{Days}}) \times \text{Difficulty}$.
  - **Transparent Interpretation:** On formula-labeled data, ML models learn to approximate the formula. Real human intuition requires prospective empirical trials.
- **Presenter Script (Spoken Word):**
  > "Our classification models use five carefully engineered features that represent student reality: self-reported difficulty from 1 to 5, historical performance band, days remaining until the deadline, assessment weight percentage, and weekly available study hours.
  > 
  > An important methodological challenge we encountered is what we call the 'ground truth dilemma'. When training an AI to prioritize, what is the correct label? If we ask students directly, their answers are subjective—many students mark everything as high priority. If we use an expert mathematical formula, the machine learning model is simply learning to approximate that formula.
  > 
  > We implemented an expert multi-factor heuristic as our developmental benchmark. We explicitly acknowledge that high accuracy on this benchmark proves our pipeline learns mathematical urgency, but does not yet represent organic human intuition."

---

### Slide 8: The Constraint-Satisfaction Scheduling Engine
- **Time:** 8:30 – 9:45 (1 min 15 sec)
- **Slide Title:** The Scheduling Engine: Constraints & Cognitive Rest
- **Visuals on Slide:**
  - Visual timeline showing a 45-minute study block, followed by a mandatory 15-minute rest block.
  - Table of Hard vs. Soft Constraints.
- **Key Points on Slide:**
  - **Proportional Time Budgeting:** High Priority = 3x weight, Medium = 2x, Low = 1x.
  - **Hard Constraints (Never Violated):**
    - Zero session overlaps: $(t_a \cap t_b = \emptyset)$.
    - Window adherence: sessions strictly placed within user's active timeslots.
    - Capacity limit: total study time $\le$ stated weekly availability.
  - **Soft Constraints (Cognitive Well-being):**
    - Mandatory rest breaks (15 min default) between consecutive sessions.
    - Session clamping (default 45 min; min 15 min) to prevent mental fatigue.
- **Presenter Script (Spoken Word):**
  > "Once Stage 1 assigns priorities, Stage 2 generates the actual timetable. 
  > 
  > The scheduler first calculates a proportional weekly time budget: high-priority subjects receive three times the weighting of low-priority subjects. It then applies a greedy slot placement algorithm with strict mathematical constraints.
  > 
  > We enforce three hard constraints: first, sessions can never overlap; second, study blocks must stay strictly within the student's chosen morning, afternoon, evening, or night windows; and third, total study time can never exceed the student's capacity. Crucially, we also enforce cognitive rest principles: single sessions are clamped to 45 minutes to prevent burnout, and mandatory 15-minute breaks are inserted between consecutive sessions."

---

### Slide 9: Experimental Results & Model Performance
- **Time:** 9:45 – 11:00 (1 min 15 sec)
- **Slide Title:** Experimental Results: Quantitative Benchmark
- **Visuals on Slide:**
  - Table 6.2 from the research report showing Accuracy, Precision, Recall, and Macro F1.
  - Callout emphasizing Macro F1 over simple Accuracy.
- **Key Points on Slide:**
  - **Baseline Heuristic:** Accuracy 0.9000 | Macro F1: 0.7316 (Highest benchmark on rule-derived data).
  - **Random Forest:** Accuracy 0.8000 | Macro F1: 0.5037 (Highest ML accuracy).
  - **Logistic Regression:** Accuracy 0.7800 | Macro F1: 0.5858 (Highest ML Macro F1).
  - **Decision Tree & KNN:** Macro F1 0.4599 and 0.4474 respectively.
  - **Key Insight:** Class imbalance (High priority = 10%) severely degraded tree recall for urgent tasks, while Logistic Regression provided more balanced decision boundaries.
- **Presenter Script (Spoken Word):**
  > "Let us look at our authentic experimental findings, summarized in this benchmark table. 
  > 
  > The rule-based baseline achieved the highest overall accuracy of 90% and a Macro F1-score of 0.7316. This is expected because the synthetic development data was generated using that underlying formula.
  > 
  > Among our machine learning models, Random Forest achieved the highest overall accuracy of 80%. However, when we look at Macro F1-score—which treats all classes equally and is much more reliable under class imbalance—Logistic Regression actually performed best with a Macro F1 of 0.5858. 
  > 
  > Why? Our confusion matrix analysis revealed that because urgent 'High' priority subjects make up only 10% of the dataset, Random Forest tended to guess 'Low' to maximize accuracy, missing high-urgency deadlines. Logistic Regression created smoother linear boundaries, successfully capturing urgent deadlines."

---

### Slide 10: System Demonstration & Interface Walkthrough
- **Time:** 11:00 – 12:15 (1 min 15 sec)
- **Slide Title:** Software Prototype: Interactive Streamlit Web Application
- **Visuals on Slide:**
  - Screenshots of the application (Home & Ethics, Student Profile Form, Interactive Timetable Editor, Model Transparency Tab).
  - Pytest terminal banner: `18 passed in 1.61s`.
- **Key Points on Slide:**
  - **Interactive Streamlit Application:** Accessible dark-mode UI (`#0F172A`) ensuring high contrast.
  - **Dynamic Timetable Editor:** Students can inspect and adjust slots (`st.data_editor`) and export to CSV.
  - **Explainable Recommendations:** Explicit textual explanations for why each priority was assigned.
  - **Rigorous Software Testing:** 18 automated unit and integration tests covering model fallbacks, negative hours, and overlap prevention.
- **Presenter Script (Spoken Word):**
  > "To make our research actionable for students, we engineered a complete web prototype using Streamlit. 
  > 
  > The application features an accessible, high-contrast dark theme. In the Student Profile section, students set their daily study windows and input their enrolled subjects. The AI engine predicts priorities, provides clear textual explanations for each recommendation, and generates a clean weekly timetable. Students can make manual edits using our interactive grid and export their schedule to CSV.
  > 
  > During our Phase 7 audit, we subjected the codebase to comprehensive automated testing. All 18 unit and integration tests passed in 1.61 seconds, confirming that boundary conditions—like zero available hours or missing model files—fail gracefully without system crashes."

---

### Slide 11: Critical Discussion, Limitations & Academic Transparency
- **Time:** 12:15 – 13:30 (1 min 15 sec)
- **Slide Title:** Critical Reflection: Limitations & Academic Transparency
- **Visuals on Slide:**
  - Clear disclosure box: Human Sample Size $N=0$ (Pending Ethics Clearance).
  - Summary of answered vs. pending research questions.
- **Key Points on Slide:**
  - **Authentic Sample Disclosure:** All models evaluated on $N=120$ simulated participants ($600$ observations).
  - **No Fabricated Claims:** Zero invented student questionnaires, fake p-values, or unverified claims of GPA improvement.
  - **RO1, RO2, and RO3 Answered:** Factors identified, two-stage architecture built, ML models benchmarked.
  - **RQ4 Status (Pending):** Algorithmic scheduling feasibility verified, but human longitudinal usability remains pending institutional ethical review.
- **Presenter Script (Spoken Word):**
  > "In any research project, academic honesty is just as important as code execution. I want to clearly state our project's limitations. 
  > 
  > While our software architecture, preprocessing pipelines, and model evaluation protocols are complete, our human participant sample size is currently $N=0$. Because university ethical approval takes several months, all experimental results shown today were obtained from an isolated synthetic development dataset of 120 simulated participants.
  > 
  > We have not invented questionnaire statistics or claimed that our system miraculously boosts student grades. Objectives 1, 2, and 3 are fully achieved from a systems engineering and machine learning perspective. However, Research Question 4—evaluating real student usability and stress reduction—is marked as 'Pending Ethical Clearance'."

---

### Slide 12: Conclusion & Future Roadmap
- **Time:** 13:30 – 14:30 (1 min)
- **Slide Title:** Conclusion & Future Roadmap
- **Visuals on Slide:**
  - Roadmap timeline: Supervisor Review $\rightarrow$ Ethics Approval $\rightarrow$ Cohort Pilot Study $\rightarrow$ LMS Integration.
  - Summary badges: Reproducible Code, Leakage-Free ML, Working Web App.
- **Key Points on Slide:**
  - **Key Contributions:**
    - A validated two-stage hybrid framework for personal study scheduling.
    - Implementation of participant-grouped cross-validation preventing EDM data leakage.
    - An audited, open-source Streamlit prototype with zero critical defects.
  - **Next Steps:** Formal submission to Faculty Ethics Committee; launching undergraduate user trials ($N=50–100$); investigating continuous regression time prediction.
- **Presenter Script (Spoken Word):**
  > "To conclude, this research demonstrates that combining supervised machine learning with deterministic constraint scheduling offers a viable, robust solution to the undergraduate time-management dilemma. 
  > 
  > We have delivered a complete, audited software prototype, established a leakage-free machine learning evaluation protocol, and provided a transparent benchmark between four algorithms. 
  > 
  > Our immediate next step is to submit our ethics application and launch our pilot study with real undergraduate cohorts. Thank you very much for your time and attention. I now welcome any questions from the examination committee."
