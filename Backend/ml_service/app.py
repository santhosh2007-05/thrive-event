import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join('model_artifacts', 'patient_risk_rf_model.pkl')

if not os.path.exists(MODEL_PATH):
    from train_model import train_and_save_model
    train_and_save_model()

model = joblib.load(MODEL_PATH)

def generate_explanation(total_appts, missed_count, attendance_rate, distance_km, age, duration_months, frequency_days, risk_score):
    reasons = []

    if missed_count > 0:
        reasons.append(f"• {missed_count} previous appointment{'s' if missed_count > 1 else ''} missed")
    else:
        reasons.append("• 0 previous appointments missed (Good history)")

    if attendance_rate < 90.0:
        reasons.append(f"• Attendance rate is only {round(attendance_rate, 1)}%")
    else:
        reasons.append(f"• Excellent attendance rate of {round(attendance_rate, 1)}%")

    if distance_km >= 20.0:
        reasons.append(f"• Hospital is {round(distance_km, 1)} km away (High travel burden)")
    elif distance_km >= 10.0:
        reasons.append(f"• Hospital is {round(distance_km, 1)} km away")
    else:
        reasons.append(f"• Hospital is close ({round(distance_km, 1)} km away)")

    if frequency_days <= 14:
        reasons.append(f"• High frequency follow-up interval ({frequency_days} days)")
    else:
        reasons.append(f"• Follow-up interval is {frequency_days} days")

    return reasons

@app.route('/api/ml/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'engine': 'Python scikit-learn RandomForest Classifier 7-Feature v3.0',
        'features': ['total_appts', 'missed_count', 'attendance_rate', 'distance_km', 'age', 'duration_months', 'frequency_days']
    })

@app.route('/api/ml/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json() or {}

        total_appts = float(data.get('totalAppointments', 12))
        missed_count = float(data.get('missedAppointments', 3))
        missed_count = min(missed_count, total_appts)

        # Dynamic Attendance Rate calculation
        if total_appts > 0:
            attendance_rate = float(((total_appts - missed_count) / total_appts) * 100.0)
        else:
            attendance_rate = 100.0

        distance_km = float(data.get('distanceKm', 13.5))
        age = float(data.get('age', 25))
        duration_months = float(data.get('treatmentDurationMonths', 8))
        frequency_days = float(data.get('appointmentFrequencyDays', 30))

        input_df = pd.DataFrame([{
            'total_appts': total_appts,
            'missed_count': missed_count,
            'attendance_rate': attendance_rate,
            'distance_km': distance_km,
            'age': age,
            'duration_months': duration_months,
            'frequency_days': frequency_days
        }])

        prob = model.predict_proba(input_df)[0][1]
        risk_score = round(float(prob * 100.0), 1)

        if risk_score >= 70.0:
            risk_level = 'HIGH'
            status_color = '#e11d48'
        elif risk_score >= 45.0:
            risk_level = 'MEDIUM'
            status_color = '#d97706'
        else:
            risk_level = 'LOW'
            status_color = '#059669'

        reasons = generate_explanation(total_appts, missed_count, attendance_rate, distance_km, age, duration_months, frequency_days, risk_score)

        return jsonify({
            'success': True,
            'totalAppointments': total_appts,
            'missedAppointments': missed_count,
            'attendanceRate': round(attendance_rate, 1),
            'distanceKm': distance_km,
            'age': age,
            'treatmentDurationMonths': duration_months,
            'appointmentFrequencyDays': frequency_days,
            'riskScore': risk_score,
            'riskLevel': risk_level,
            'statusColor': status_color,
            'explanationSummary': f"Risk = {risk_score} ({risk_level})",
            'explanationBulletPoints': reasons
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
