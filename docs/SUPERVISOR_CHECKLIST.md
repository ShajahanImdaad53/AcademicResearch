# Supervisor Discussion Checklist

Use this checklist during your next meeting with your research supervisor to ensure all methodological decisions are approved before beginning data collection or model training.

## 1. Research Scope and Architecture
- [ ] **Discuss Architecture:** Clarify that the Machine Learning model predicts *Subject Priority* (Low, Medium, High), and a separate constraint-based algorithm will map those priorities to an actual calendar schedule. This ensures realistic constraints (like available hours and breaks) are respected.

## 2. Target Variable & Labeling Approach
- [ ] **Approve Target Variable:** Confirm that `Target_Priority` is a valid target variable for answering the research questions.
- [ ] **Approve Labeling Strategy:** Discuss the "Hybrid Labeling Approach". We plan to ask students to self-report priority (Organic Labels) but will also calculate a deterministic baseline formula `(Assessment_Weight / Days_To_Deadline) * Difficulty_Rating` (Rule-Based Labels) in case self-reported data is too noisy or imbalanced. Confirm which label type the ML model should officially claim to predict.

## 3. Data Collection & Sampling
- [ ] **Approve Sampling Strategy:** Confirm convenience/snowball sampling targeting university undergraduates.
- [ ] **Approve Sample Size:** Discuss the target of 50-100 participants (yielding 250-500 observations). Discuss the acceptability of using synthetic data augmentation if the dataset is too small for the models to generalize properly.
- [ ] **Approve Features:** Review the features outlined in the `DATA_DICTIONARY.md` (Difficulty, Prior Performance, Days to Deadline, Assessment Weight, Available Hours). Are there any missing predictors?

## 4. Ethics and Privacy
- [ ] **Review Questionnaire:** Ensure the `QUESTIONNAIRE_DRAFT.md` is acceptable and lacks any sensitive/identifiable questions.
- [ ] **Review Consent Form:** Approve the wording in `PARTICIPANT_INFORMATION_AND_CONSENT_DRAFT.md`.
- [ ] **Ethics Application:** Ask if a formal university ethics application (IRB) is required for this data collection, and initiate that process if needed.

## 5. Evaluation (Answering RQ4)
- [ ] **Approve Usability Study:** Confirm that a Task-Based Usability Evaluation and a post-task survey (measuring perceived usefulness and system usability) is a sufficient methodology for RQ4, rather than conducting a longitudinal study on actual grades.

## 6. Next Steps
- [ ] **Proceed to Phase 3:** Get explicit permission to begin generating the synthetic demonstration dataset and building the data preprocessing pipeline while waiting for official data collection approval.
