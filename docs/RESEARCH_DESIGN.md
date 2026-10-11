# Research Design and Methodology

## 1. Objective-to-Evidence Mapping
- **RQ1 (Factors influencing scheduling):** Literature review & descriptive statistics from the participant questionnaire.
- **RQ2 (ML for personalized recommendations):** Successful development of a predictive model that outputs subject priority based on student data, outperforming baselines.
- **RQ3 (Best ML approach):** Empirical comparison of Decision Tree, Random Forest, KNN, and Logistic Regression using accuracy, precision, recall, and macro F1-score.
- **RQ4 (Improvement in planning effectiveness):** Usability and usefulness evaluation using student feedback (Task-based testing or surveys).

## 2. Target Variable Formulation
**Proposed Target:** `Subject Priority Category` (Classes: Low, Medium, High).
- **What it measures:** The relative urgency and necessity of studying a specific subject during a specific week.
- **How it is obtained:** For the prototype/development phase, we will collect self-reported priority ratings from students via a questionnaire based on hypothetical scenarios, or use a transparent rule-based heuristic as a ground truth baseline to train the model. 
- **Consistency with objectives:** Yes, predicting priority enables the downstream schedule generator to allocate time proportionally.
- **Limitations:** Self-reported labels can be noisy or subjective. If a rule-based heuristic is used for labels, the ML model is merely approximating the rule.

## 3. Machine Learning Algorithms
The target variable is categorical, making it suitable for the proposed algorithms:
- **Decision Tree & Random Forest:** Good for capturing non-linear relationships (e.g., urgency spikes right before a deadline).
- **K-Nearest Neighbours (KNN):** Useful if students with similar profiles prioritize subjects similarly.
- **Logistic Regression:** A strong, interpretable baseline for linear feature contributions.

## 4. The Schedule Generator (Post-ML processing)
The ML model outputs a Priority (Low, Medium, High). The Schedule Generator will:
1. Map priorities to time blocks (e.g., High = 3 hours/week, Low = 1 hour/week).
2. Distribute blocks into the student's available timeslots.
3. Enforce constraints (no overlaps, mandatory breaks).

## 5. Next Steps for Approval
- Supervisor approval on the definition of the target variable (`Subject Priority Category`).
- Ethics approval for the data collection protocol to gather training data.
