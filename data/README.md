# Data Directory Management & Privacy Notice

## 1. Directory Structure
- `data/raw/`: Dedicated exclusively to genuine, raw participant survey responses or source exports. **Ignored by Git (`.gitignore`). Never commit or push raw survey data to public repositories.**
- `data/processed/`: Dedicated to cleaned, anonymized, validated participant data ready for model training. **Ignored by Git (`.gitignore`).**
- `data/synthetic_demo/`: Contains explicitly labelled, programmatically generated mock datasets used exclusively for software testing, interface demonstrations, and pipeline verification.

## 2. Research Integrity & Synthetic Data Separation
- Synthetic datasets (such as `data/synthetic_demo/synthetic_data.csv`) must **NEVER** be mixed with, substituted for, or reported as genuine participant data.
- Any evaluation metrics calculated using synthetic demonstration datasets are marked with explicit warnings and must never be cited as real empirical research findings.

## 3. Data Protection & Ethical Compliance
- No Personally Identifiable Information (PII) such as student names, emails, student IDs, or IP addresses may be stored in this directory.
- All genuine participant data must be pseudonymous and secured in accordance with [docs/ETHICS_AND_DATA_PROTECTION.md](../docs/ETHICS_AND_DATA_PROTECTION.md).
