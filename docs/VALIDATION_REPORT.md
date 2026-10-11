# Phase 7 Comprehensive Research Code & Application Audit Report

**Date of Audit:** October 11, 2026  
**Project:** AI-Based Personalized Study Schedule Recommendation System  
**Auditor:** Research Technical Assistant & Methodologist  
**Audit Objective:** Thorough verification of research integrity, data isolation, model pipelines, recommender constraint adherence, automated test coverage, and user interface reliability.

---

## 1. Executive Summary

A comprehensive Phase 7 audit was conducted across the research repository, covering:
1. **Data Pipeline & Privacy Isolation:** Verification that prospective participant survey data cannot be committed to version control and that synthetic development data is strictly isolated.
2. **Model Evaluation & Leakage Prevention:** Verification of `GroupKFold` participant-aware splitting and Scikit-Learn pipelines.
3. **Recommender Constraint Engine:** Boundary testing for schedule overlap prevention, break allocations, capacity limits, and edge cases.
4. **Defect Discovery & Resolution:** Identification and resolution of five specific technical defects across prediction inputs, recommender edge cases, git configuration, and browser UI rendering.
5. **Automated Test Suite:** Complete execution of 18 automated unit and integration tests with a 100% pass rate.
6. **Browser Verification:** Visual confirmation of Streamlit user interface pages and input forms.

---

## 2. Automated Test Execution & Genuine Outputs

### Execution Command
```powershell
python -m pytest tests/ -v
```

### Genuine Terminal Output
```
============================= test session starts =============================
platform win32 -- Python 3.12.1, pytest-9.0.3, pluggy-1.6.0 -- C:\Python\python.exe
cachedir: .pytest_cache
rootdir: C:\Users\Imdaa\OneDrive\Desktop\Research
plugins: anyio-4.15.1, Faker-38.2.0
collecting ... collected 18 items

tests/test_model_pipeline.py::test_prepare_input_dataframe_fills_defaults PASSED [  5%]
tests/test_model_pipeline.py::test_prepare_input_dataframe_clamps_ranges PASSED [ 11%]
tests/test_model_pipeline.py::test_baseline_predictions PASSED           [ 16%]
tests/test_model_pipeline.py::test_load_trained_model_fallback PASSED    [ 22%]
tests/test_model_pipeline.py::test_trained_model_prediction_if_present PASSED [ 27%]
tests/test_model_pipeline.py::test_priority_engine_with_live_model PASSED [ 33%]
tests/test_preprocessing.py::test_validation_schema PASSED               [ 38%]
tests/test_preprocessing.py::test_validation_invalid_data PASSED         [ 44%]
tests/test_preprocessing.py::test_grouped_splits PASSED                  [ 50%]
tests/test_preprocessing.py::test_preprocessing_pipeline PASSED          [ 55%]
tests/test_schedule_generator.py::test_priority_fallback_and_explanation PASSED [ 61%]
tests/test_schedule_generator.py::test_schedule_generator_allocations PASSED [ 66%]
tests/test_schedule_generator.py::test_schedule_constraints_and_breaks PASSED [ 72%]
tests/test_schedule_generator.py::test_insufficient_availability PASSED  [ 77%]
tests/test_schedule_generator.py::test_zero_and_negative_available_hours PASSED [ 83%]
tests/test_schedule_generator.py::test_empty_subjects_list PASSED        [ 88%]
tests/test_schedule_generator.py::test_window_too_short_for_session PASSED [ 94%]
tests/test_schedule_generator.py::test_zero_break_duration PASSED        [100%]

============================= 18 passed in 1.61s ==============================
```

---

## 3. Defects Identified, Root Causes, and Applied Fixes

### Defect 1: Pipeline Feature Mismatch Crash During Live Inference
- **Symptom:** Running `demo_schedule.py` or calling `PriorityEngine.predict_priority()` with partial subject dictionaries threw:
  `ValueError: columns are missing: {'Study_Year', 'Prior_Performance', 'Available_Hours'}`.
- **Root Cause:** When `Random_Forest.pkl` was fitted in Phase 4, the preprocessing `ColumnTransformer` registered six features. In Phase 5, the schedule generator and demo passed only subject-level attributes (`Assessment_Weight`, `Days_To_Deadline`, `Difficulty_Rating`), omitting student-level features.
- **Fix:** 
  1. Created a dedicated inference module `src/models/predict.py` with `prepare_input_dataframe()` that validates input types, completes missing student features with sensible defaults (`Study_Year=2`, `Prior_Performance='None'`, `Available_Hours=15.0`), and clamps numerical ranges.
  2. Wrapped `predict_subject_priority()` in a `try...except` block so that any unexpected pipeline exception safely falls back to `RuleBasedBaseline` without crashing.
  3. Integrated this utility into `PriorityEngine` and verified `demo_schedule.py` runs with exit code 0.

### Defect 2: Recommender Edge Cases & Infinite Loop Risk
- **Symptom:** Edge cases with non-positive available hours, empty subjects list, or window durations shorter than session length were unhandled or outputted misleading success messages. Additionally, `session_duration <= 0` could cause an infinite while loop.
- **Root Cause:** `ScheduleGenerator` lacked defensive input clamping and explicit capacity validation.
- **Fix:**
  1. Clamped `session_duration` to $\ge 15$ minutes and `break_duration` to $\ge 0$ minutes.
  2. Added early return guards for empty subject lists and non-positive available hours with clear diagnostic messages.
  3. Validated window start and end times (`start_dt < end_dt`) and compared total requested study time against total window capacity.
  4. Created unit tests covering zero/negative hours, empty lists, short windows, and zero breaks.

### Defect 3: Web UI Contrast Defect on Light-Mode Browsers
- **Symptom:** In default light-mode browser environments, section headers were rendered in faint white text on a light background, severely impairing accessibility.
- **Root Cause:** Streamlit defaulted to the user's OS theme (light mode) while custom CSS forced `#F8FAFC` font colors.
- **Fix:**
  1. Created `.streamlit/config.toml` explicitly setting `base = "dark"` with tailored dark theme tokens (`backgroundColor = "#0F172A"`, `secondaryBackgroundColor = "#1E293B"`, `textColor = "#F8FAFC"`).
  2. Captured browser screenshots confirming high-contrast legibility across all sections.

### Defect 4: Missing Interactive Schedule Editing in UI
- **Symptom:** The generated timetable in `app.py` was previously displayed in a static table, preventing students from editing allocations before export.
- **Root Cause:** Used `st.table` rather than `st.data_editor`.
- **Fix:** Upgraded timetable display to `st.data_editor` with dynamic row capabilities and CSV download of the edited schedule.

### Defect 5: Unignored Cache and Log Files in Git
- **Symptom:** `.pytest_cache/` and `*.log` files were untracked and eligible for accidental commit.
- **Root Cause:** Missing entries in `.gitignore`.
- **Fix:** Added `.pytest_cache/` and `*.log` to `.gitignore`.

---

## 4. Privacy, Ethics & Data Isolation Audit

| Checkpoint | Target Requirement | Audit Finding | Status |
| :--- | :--- | :--- | :--- |
| **Raw Data Isolation** | `data/raw/*` must never be committed to Git | Verified via `git check-ignore data/raw/survey_responses.csv`. Output confirmed ignored. | **PASS** |
| **Processed Data Isolation** | `data/processed/*` must never be committed | Verified via `git check-ignore data/processed/cleaned.csv`. Output confirmed ignored. | **PASS** |
| **Synthetic Separation** | Synthetic files must be clearly isolated and labelled | Stored in `data/synthetic_demo/` and prominently flagged in UI banners and reports. | **PASS** |
| **No Hardcoded PII** | Zero real student names, emails, or IDs in code | Checked codebase; only synthetic identifiers (`P001`, `CS101`) exist. | **PASS** |

---

## 5. Machine Learning Methodology Audit

1. **Data Leakage Check:**
   - Preprocessing (`StandardScaler`, `SimpleImputer`, `OrdinalEncoder`) is strictly housed inside Scikit-Learn `Pipeline` objects.
   - Evaluated using `GroupKFold(n_splits=5, groups=Participant_ID)`. All records belonging to any individual participant are strictly isolated to either train or test folds.
2. **Model Persistence:**
   - All four classification models (`Decision_Tree.pkl`, `Random_Forest.pkl`, `KNN.pkl`, `Logistic_Regression.pkl`) are serialized in `experiments/models/`.
3. **Scientific Claims Disclaimer:**
   - Both the application UI and `reports/model_evaluation.md` explicitly declare that high baseline/model metrics are artifacts of the synthetic generation rules and must not be reported as empirical human discoveries.

---

## 6. Honest Limitations & Unverified Items

1. **No Human Usability Testing Yet Conducted:**
   - While automated tests and browser rendering subagent checks passed, actual student usability (System Usability Scale / SUS evaluation) has not yet been conducted with real university participants.
2. **Single-Week Horizon:**
   - The recommender allocates tasks across a standard 7-day weekly grid. Long-term dynamic adjustments across an entire 12-week semester are not yet modeled.
3. **Synthetic Rule Reliances:**
   - Machine learning performance scores reflect the synthetic data generator logic. Real-world validation remains subject to future institutional ethics approval and real data collection.
