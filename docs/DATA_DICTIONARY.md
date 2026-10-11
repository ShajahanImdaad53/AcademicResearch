# Data Dictionary

This document defines the schema for the dataset that will be used for training the machine learning models. Each row represents a specific `Participant-Subject` instance.

| Feature Name | Data Type | Description | Valid Range / Categories |
|---|---|---|---|
| `Participant_ID` | String | Pseudonymous identifier for the student. | e.g., P001, P002 (Excluded from ML training) |
| `Subject_ID` | String | Identifier for the subject. | e.g., SUB_A, SUB_B |
| `Study_Year` | Integer | The student's current year of study. | 1, 2, 3, 4, 5 |
| `Difficulty_Rating` | Integer | Self-reported difficulty of the subject. | 1 (Very Easy) to 5 (Very Difficult) |
| `Prior_Performance` | String | Historical performance band. | 'High', 'Medium', 'Low', 'None' |
| `Days_To_Deadline` | Integer | Number of days until the next major assessment. | 0 to 365 |
| `Assessment_Weight` | Float | The percentage weight of the upcoming assessment. | 0.0 to 100.0 |
| `Available_Hours` | Float | Total hours available for studying this week. | 0.0 to 168.0 |
| `Target_Priority` | String | (Target Variable) Priority category for scheduling. | 'Low', 'Medium', 'High' |

*Note: This schema will be implemented in `src/data/validate_data.py` to ensure all ingested CSV files meet these specifications.*
