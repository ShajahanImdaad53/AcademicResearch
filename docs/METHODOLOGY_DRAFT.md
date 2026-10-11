# Methodology Draft
**Status:** DRAFT (Requires Supervisor Approval before Data Collection)

## 1. Research Design
This study employs a **Mixed-Methods approach** integrating quantitative predictive modeling with a qualitative usability evaluation. 
- **Phase A (Machine Learning):** A supervised classification model will be trained to predict the optimal `Subject Priority Category` (Low, Medium, High) for a student's subjects based on their academic context.
- **Phase B (System Engineering):** A constraint-based scheduling algorithm will consume these predictions to generate a realistic, conflict-free weekly timetable.
- **Phase C (Human-Computer Interaction):** A task-based usability study will evaluate the perceived effectiveness and usefulness of the generated schedules.

## 2. Population and Sampling Approach
- **Target Population:** Undergraduate university students who manage multiple subjects simultaneously.
- **Sampling Strategy:** Convenience and snowball sampling. We will distribute an online questionnaire to peers within the university via student forums and mailing lists.
- **Sample Size Justification:** For an undergraduate prototype, a target of 50-100 participant responses is realistic. Each participant will provide data for up to 5 subjects, yielding ~250-500 observations for training the classification models. If this sample size is insufficient for robust ML generalization, synthetic data augmentation will be used for model testing, with transparent reporting of this limitation.

## 3. Data Collection Procedure & Questionnaire
Data will be collected using an online survey platform (e.g., Qualtrics or Google Forms). The questionnaire is divided into:
1. **Academic Profile:** Current study year, subjects enrolled.
2. **Subject Context:** Self-perceived difficulty, prior performance bands.
3. **Deadlines:** Days until the next assessment, weight of assessment.
4. **Constraints:** Weekly available study hours, preferred session length, unavailable days.
5. **Target Ground Truth:** Self-reported priority labels for each subject.

Participants must actively agree to a digital consent form before accessing the questionnaire.

## 4. Feature Definitions
The model will use the following independent variables (features) extracted from the questionnaire:
- `Difficulty_Rating` (Ordinal: 1-5): Subjective difficulty.
- `Prior_Performance` (Categorical: High, Medium, Low, None): Historical aptitude.
- `Days_To_Deadline` (Numeric): Urgency metric.
- `Assessment_Weight` (Numeric): Importance metric (0-100%).
- `Available_Hours` (Numeric): Total weekly time capacity.

## 5. The Target Variable and Labeling Strategy
**Target Variable:** `Target_Priority` (Categorical: Low, Medium, High)

**Recommendation for Labeling:** 
We recommend a **Hybrid Labeling Approach**. 
1. **Primary Collection (Organic Labels):** Ask students to self-report the priority of each of their subjects for the upcoming week based on their submitted context. 
2. **Fallback/Baseline (Rule-Based Labels):** Since self-reported data can be noisy (e.g., a student might label everything "High" priority), we will concurrently develop an expert rule-based heuristic formula `Priority_Score = (Assessment_Weight / Days_To_Deadline) * Difficulty_Rating`. This score will be discretized into Low, Medium, and High quantiles.

**What the Model Legitimately Claims to Predict:**
- If trained on **Organic Labels**, the model predicts *human scheduling intuition* (how a typical student would prioritize the subject).
- If trained on **Rule-Based Labels**, the model merely approximates the deterministic formula. 
- *Relation to RQs:* Predicting priority directly answers RQ2 and allows us to compare ML models for RQ3. 

## 6. Ethics Requirements and Privacy Protections
- **Anonymity:** No personally identifiable information (PII) such as Names, Student IDs, or email addresses will be collected in the dataset.
- **Data Minimization:** Only data directly relevant to scheduling will be requested.
- **Storage:** Raw CSV exports will be stored on a password-protected local machine and `.gitignore` will prevent uploads to cloud repositories.
- **Withdrawal:** Participants can withdraw from the survey at any point before submission.

## 7. Evaluation Plan (Addressing RQ4)
Model accuracy metrics (F1-score, Precision) do not prove human usefulness. To evaluate RQ4 ("Can personalized schedules improve perceived planning effectiveness?"), we will conduct a **Task-Based Usability Evaluation**:
1. **Intervention:** A subset of participants will interact with the Streamlit prototype, inputting a hypothetical week of subjects.
2. **Measurement:** Participants will complete a post-interaction System Usability Scale (SUS) questionnaire and a bespoke Perceived Usefulness survey (Likert scale 1-5) evaluating the generated timetable's realism, flexibility, and priority alignment.
3. **Analysis:** Descriptive statistics of the survey responses will determine if the AI approach is perceived as an improvement over conventional manual planning.

---
**REQUIRES SUPERVISOR APPROVAL:**
- [ ] Approval of the `Target_Priority` definition and Hybrid Labeling strategy.
- [ ] Approval of the Population Sampling strategy and Sample Size targets.
- [ ] Approval to submit the Ethics Application and Consent Form.
- [ ] Approval of the Usability Evaluation Plan for RQ4.
