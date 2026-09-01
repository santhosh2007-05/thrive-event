import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join('model_artifacts', 'patient_risk_rf_model.pkl')

# Train model automatically if artifact doesn't exist
if not os.path.exists(MODEL_PATH):
    print("Model artifact not found. Training model now...")
    from train_model import train_and_save_model
    train_and_save_model()

model = joblib.load(MODEL_PATH)

def generate_explanation(missed_count, distance_km, age, duration_months, frequency_days, risk_score):
    reasons = []

    if missed_count >= 3:
        reasons.append(f"• {missed_count} previous missed appointments (Significant history)")
    elif missed_count >= 1:
        reasons.append(f"• {missed_count} previous missed appointment")

    if distance_km >= 20.0:
        reasons.append(f"• {round(distance_km, 1)} km travel distance from hospital")
    elif distance_km >= 10.0:
        reasons.append(f"• Moderate travel distance ({round(distance_km, 1)} km)")

    if age >= 65:
        reasons.append(f"• Elderly age demographic ({age} years)")

    if duration_months >= 12:
        reasons.append(f"• Extended treatment duration ({duration_months} months)")

    if frequency_days <= 14:
        reasons.append(f"• High appointment frequency (every {frequency_days} days)")

    if not reasons:
        reasons.append("• Regular attendance pattern & close travel proximity")

    return reasons

@app.route('/api/ml/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'engine': 'Python scikit-learn RandomForest Classifier v2.1',
        'features_evaluated': ['missed_count', 'distance_km', 'age', 'duration_months', 'frequency_days']
    })

@app.route('/api/ml/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json() or {}

        patient_id = data.get('patientId', 'P-10234')
        patient_name = data.get('name', 'Patient')
        missed_count = float(data.get('missedAppointments', 1))
        distance_km = float(data.get('distanceKm', 12.0))
        age = float(data.get('age', 45))
        duration_months = float(data.get('treatmentDurationMonths', 6))
        frequency_days = float(data.get('appointmentFrequencyDays', 30))

        # Build feature DataFrame
        input_df = pd.DataFrame([{
            'missed_count': missed_count,
            'distance_km': distance_km,
            'age': age,
            'duration_months': duration_months,
            'frequency_days': frequency_days
        }])

        # Calculate prediction probability
        prob = model.predict_proba(input_df)[0][1]
        risk_score = round(float(prob * 100.0), 1)

        # Classify risk level
        if risk_score >= 70.0:
            risk_level = 'HIGH'
            status_color = '#e11d48'
        elif risk_score >= 45.0:
            risk_level = 'MEDIUM'
            status_color = '#d97706'
        else:
            risk_level = 'LOW'
            status_color = '#059669'

        # Feature Importance Contributions (SHAP style approximation)
        feature_importances = model.feature_importances_
        feature_names = ['Missed Appointments', 'Hospital Distance', 'Patient Age', 'Treatment Duration', 'Appointment Frequency']
        feature_values = [f"{int(missed_count)} visits", f"{round(distance_km,1)} km", f"{int(age)} yrs", f"{int(duration_months)} mos", f"Every {int(frequency_days)}d"]

        breakdown = []
        for name, val, imp in zip(feature_names, feature_values, feature_importances):
            points = round(imp * risk_score, 1)
            breakdown.append({
                'label': name,
                'raw': val,
                'points': points,
                'contributionPct': round(float(imp * 100.0), 1)
            })

        breakdown.sort(key=lambda x: x['points'], reverse=True)

        reasons = generate_explanation(missed_count, distance_km, age, duration_months, frequency_days, risk_score)

        return jsonify({
            'success': True,
            'patientId': patient_id,
            'name': patient_name,
            'riskScore': risk_score,
            'riskLevel': risk_level,
            'statusColor': status_color,
            'modelVersion': 'scikit-learn RandomForest ML v2.1',
            'explanationSummary': f"Risk = {risk_score} ({risk_level})",
            'explanationBulletPoints': reasons,
            'factorsBreakdown': breakdown
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print("Starting Machine Learning Risk Service on http://127.0.0.1:5000 ...")
    app.run(host='0.0.0.0', port=5000, debug=True)
