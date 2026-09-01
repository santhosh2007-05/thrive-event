import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def generate_clinical_dataset(n_samples=3500):
    np.random.seed(42)

    total_appts = np.random.randint(1, 31, size=n_samples)
    missed_count = np.array([np.random.randint(0, min(total, 16)) for total in total_appts])

    attended_count = total_appts - missed_count
    attendance_rate = (attended_count / total_appts) * 100.0

    distance_km = np.random.uniform(0.5, 50.0, size=n_samples)
    age = np.random.randint(1, 100, size=n_samples)
    duration_months = np.random.randint(1, 60, size=n_samples)
    frequency_days = np.random.choice([7, 14, 30, 60, 90], size=n_samples)

    # Risk Log Odds based on Attendance Rate as strong predictor
    risk_score_raw = (
        ((100.0 - attendance_rate) * 0.05) +
        (missed_count * 0.15) +
        (distance_km * 0.03) +
        (1.0 / (frequency_days / 30.0) * 0.2) +
        (duration_months * 0.01) +
        ((1.0 if age >= 65 or age <= 12 else 0.0) * 0.3)
    )

    probabilities = 1.0 / (1.0 + np.exp(-(risk_score_raw - 2.8)))
    no_show = (np.random.rand(n_samples) < probabilities).astype(int)

    df = pd.DataFrame({
        'total_appts': total_appts,
        'missed_count': missed_count,
        'attendance_rate': attendance_rate,
        'distance_km': distance_km,
        'age': age,
        'duration_months': duration_months,
        'frequency_days': frequency_days,
        'no_show': no_show
    })
    return df

def train_and_save_model():
    print("Generating 7-feature clinical dataset...")
    df = generate_clinical_dataset(3500)

    features = ['total_appts', 'missed_count', 'attendance_rate', 'distance_km', 'age', 'duration_months', 'frequency_days']
    X = df[features]
    y = df['no_show']

    print("Training RandomForest ML Model on 7 features...")
    model = RandomForestClassifier(
        n_estimators=120,
        max_depth=7,
        random_state=42
    )
    model.fit(X, y)

    os.makedirs('model_artifacts', exist_ok=True)
    model_path = os.path.join('model_artifacts', 'patient_risk_rf_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model successfully saved to {model_path}")

    importances = model.feature_importances_
    print("\n7-Feature ML Importances:")
    for feat, imp in zip(features, importances):
        print(f" - {feat}: {round(imp * 100, 2)}%")

if __name__ == '__main__':
    train_and_save_model()
