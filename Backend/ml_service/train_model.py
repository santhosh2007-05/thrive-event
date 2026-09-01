import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def generate_clinical_dataset(n_samples=2000):
    np.random.seed(42)

    missed_count = np.random.poisson(lam=1.5, size=n_samples)
    distance_km = np.random.uniform(1.0, 50.0, size=n_samples)
    age = np.random.randint(18, 88, size=n_samples)
    duration_months = np.random.randint(1, 36, size=n_samples)
    frequency_days = np.random.choice([7, 14, 30, 60, 90], size=n_samples)

    # Risk log-odds formula based on clinical factors
    risk_score_raw = (
        (missed_count * 0.45) +
        (distance_km * 0.035) +
        (age * 0.015) +
        (duration_months * 0.02) +
        (1.0 / (frequency_days / 30.0) * 0.25)
    )

    # Convert to binary target (1 = High Risk of No-Show, 0 = Likely Attended)
    probabilities = 1.0 / (1.0 + np.exp(-(risk_score_raw - 2.2)))
    no_show = (np.random.rand(n_samples) < probabilities).astype(int)

    df = pd.DataFrame({
        'missed_count': missed_count,
        'distance_km': distance_km,
        'age': age,
        'duration_months': duration_months,
        'frequency_days': frequency_days,
        'no_show': no_show
    })
    return df

def train_and_save_model():
    print("Generating synthetic clinical patient dataset...")
    df = generate_clinical_dataset(2500)

    X = df[['missed_count', 'distance_km', 'age', 'duration_months', 'frequency_days']]
    y = df['no_show']

    print("Training RandomForest Classifier model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        random_state=42
    )
    model.fit(X, y)

    os.makedirs('model_artifacts', exist_ok=True)
    model_path = os.path.join('model_artifacts', 'patient_risk_rf_model.pkl')
    joblib.dump(model, model_path)
    print(f"Model successfully saved to {model_path}")

    # Feature Importance Printout
    importances = model.feature_importances_
    features = X.columns
    print("\nFeature Importances:")
    for feat, imp in zip(features, importances):
        print(f" - {feat}: {round(imp * 100, 2)}%")

if __name__ == '__main__':
    train_and_save_model()
