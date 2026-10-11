# Model Evaluation Report

## 1. Metrics Explanation
- **Accuracy**: The percentage of priorities the model guessed correctly overall. (e.g., 0.85 means 85% correct).
- **Precision (Macro)**: When the model predicts a specific priority (like 'High'), how often is it actually correct? Macro average means we average the precision of Low, Medium, and High equally.
- **Recall (Macro)**: Out of all the actual 'High' priorities in the data, how many did the model successfully find? Macro average treats all classes equally.
- **F1-Score (Macro)**: The balance between Precision and Recall. It is the most reliable metric when classes are unbalanced.

## 2. Class Distribution in Test Set
This shows if the data is unbalanced (e.g., if there are way more 'Low' than 'High' priorities).
- Low: 38 instances
- Medium: 7 instances
- High: 5 instances

## 3. Results Comparison
| Model                 |   Accuracy |   Precision (Macro) |   Recall (Macro) |   F1-Score (Macro) |
|:----------------------|-----------:|--------------------:|-----------------:|-------------------:|
| Baseline (Rule-Based) |       0.9  |              0.9612 |           0.6857 |             0.7316 |
| Decision Tree         |       0.74 |              0.4272 |           0.5188 |             0.4599 |
| KNN                   |       0.72 |              0.4288 |           0.4712 |             0.4474 |
| Logistic Regression   |       0.78 |              0.7743 |           0.5942 |             0.5858 |
| Random Forest         |       0.8  |              0.4697 |           0.5451 |             0.5037 |

## 4. Confusion Matrices
A confusion matrix shows exactly where the model gets confused. Rows are the *Actual* priority, Columns are the *Predicted* priority. Order: Low, Medium, High.

### Baseline (Rule-Based)
```text
[[38  0  0]
 [ 1  6  0]
 [ 4  0  1]]
```

### Decision Tree
```text
[[32  6  0]
 [ 1  5  1]
 [ 4  1  0]]
```

### KNN
```text
[[32  4  2]
 [ 2  4  1]
 [ 4  1  0]]
```

### Logistic Regression
```text
[[33  5  0]
 [ 2  5  0]
 [ 3  1  1]]
```

### Random Forest
```text
[[35  3  0]
 [ 2  5  0]
 [ 4  1  0]]
```

## 5. Limitations & Data Leakage Risks
- **Synthetic Data**: These metrics are generated from a *synthetic demonstration dataset*. The models learned the underlying mathematical rule we used to generate the data, rather than organic human intuition. Therefore, a high score here does not mean the model is 'scientifically validated' for real students.
- **Class Imbalance**: Depending on the synthetic generation, some priority classes may be underrepresented, causing poor Recall for those specific classes.
- **Leakage Protection**: We used `GroupKFold` during training and splitting to ensure a single participant's subjects were not split between train and test sets. If we hadn't done this, the model might just memorize the participant's habits (leakage), over-inflating the accuracy.
