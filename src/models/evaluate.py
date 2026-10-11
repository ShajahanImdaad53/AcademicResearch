import os
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

from src.models.baseline import RuleBasedBaseline

def evaluate_models(models_dir, test_data_path, reports_dir):
    os.makedirs(reports_dir, exist_ok=True)
    
    # 1. Load Test Data
    test_df = pd.read_csv(test_data_path)
    X_test = test_df.drop(columns=['Target_Priority'])
    y_test = test_df['Target_Priority']
    
    # Check class distribution
    class_dist = y_test.value_counts().to_dict()
    
    # 2. Load Models
    models = {
        'Baseline (Rule-Based)': RuleBasedBaseline()
    }
    
    for file in os.listdir(models_dir):
        if file.endswith('.pkl'):
            name = file.replace('.pkl', '').replace('_', ' ')
            models[name] = joblib.load(os.path.join(models_dir, file))
            
    # 3. Evaluate
    results = []
    confusion_matrices = {}
    
    # Ensure consistent label ordering
    labels = ['Low', 'Medium', 'High']
    
    for name, model in models.items():
        # Predict
        y_pred = model.predict(X_test)
        
        # Calculate Metrics
        # using macro average to treat all classes equally regardless of support
        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred, average='macro', zero_division=0)
        rec = recall_score(y_test, y_pred, average='macro', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='macro', zero_division=0)
        cm = confusion_matrix(y_test, y_pred, labels=labels)
        
        confusion_matrices[name] = cm
        
        results.append({
            'Model': name,
            'Accuracy': round(acc, 4),
            'Precision (Macro)': round(prec, 4),
            'Recall (Macro)': round(rec, 4),
            'F1-Score (Macro)': round(f1, 4)
        })
        
    # 4. Save CSV
    results_df = pd.DataFrame(results)
    results_df.to_csv(os.path.join(reports_dir, 'model_comparison.csv'), index=False)
    
    # 5. Generate Markdown Report
    with open(os.path.join(reports_dir, 'model_evaluation.md'), 'w', encoding='utf-8') as f:
        f.write("# Model Evaluation Report\n\n")
        f.write("## 1. Metrics Explanation\n")
        f.write("- **Accuracy**: The percentage of priorities the model guessed correctly overall. (e.g., 0.85 means 85% correct).\n")
        f.write("- **Precision (Macro)**: When the model predicts a specific priority (like 'High'), how often is it actually correct? Macro average means we average the precision of Low, Medium, and High equally.\n")
        f.write("- **Recall (Macro)**: Out of all the actual 'High' priorities in the data, how many did the model successfully find? Macro average treats all classes equally.\n")
        f.write("- **F1-Score (Macro)**: The balance between Precision and Recall. It is the most reliable metric when classes are unbalanced.\n\n")
        
        f.write("## 2. Class Distribution in Test Set\n")
        f.write("This shows if the data is unbalanced (e.g., if there are way more 'Low' than 'High' priorities).\n")
        for k, v in class_dist.items():
            f.write(f"- {k}: {v} instances\n")
        f.write("\n")
        
        f.write("## 3. Results Comparison\n")
        f.write(results_df.to_markdown(index=False))
        f.write("\n\n")
        
        f.write("## 4. Confusion Matrices\n")
        f.write("A confusion matrix shows exactly where the model gets confused. Rows are the *Actual* priority, Columns are the *Predicted* priority. Order: Low, Medium, High.\n\n")
        for name, cm in confusion_matrices.items():
            f.write(f"### {name}\n")
            f.write("```text\n")
            f.write(f"{cm}\n")
            f.write("```\n\n")
            
        f.write("## 5. Limitations & Data Leakage Risks\n")
        f.write("- **Synthetic Data**: These metrics are generated from a *synthetic demonstration dataset*. The models learned the underlying mathematical rule we used to generate the data, rather than organic human intuition. Therefore, a high score here does not mean the model is 'scientifically validated' for real students.\n")
        f.write("- **Class Imbalance**: Depending on the synthetic generation, some priority classes may be underrepresented, causing poor Recall for those specific classes.\n")
        f.write("- **Leakage Protection**: We used `GroupKFold` during training and splitting to ensure a single participant's subjects were not split between train and test sets. If we hadn't done this, the model might just memorize the participant's habits (leakage), over-inflating the accuracy.\n")

    print(f"Evaluation complete. Reports saved to {reports_dir}")

if __name__ == "__main__":
    evaluate_models('experiments/models', 'experiments/models/test_data.csv', 'reports')
