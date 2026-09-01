# 🩺 CareTrack: Patient Follow-Up Risk Predictor & Explainable AI Clinical Platform

> **An AI-Assisted Predictive Healthcare Platform for Outpatient Follow-up Optimization, Risk Ranking, and Transparent Clinical Decision Support.**

---

## 📌 Executive Summary

Over **20%–30% of hospital outpatients miss critical follow-up visits**, leading to delayed medical interventions, disease progression, and increased emergency readmissions. **CareTrack** replaces manual, non-prioritized staff outreach with an intelligent **Machine Learning (ML) Follow-Up Risk Engine**.

The system automatically predicts outpatient no-show probabilities, ranks patients by priority (🔴 High $\rightarrow$ 🟠 Medium $\rightarrow$ 🟢 Low), generates **Explainable AI (XAI)** clinical explanations, and enables direct 1-click pre-appointment interventions via real-time SMS and telephone outreach.

---

## 🎯 Project Objectives

### 🚩 Primary Objectives (Current Implementation)
1. **Predictive Follow-Up Risk Scoring**: Calculate a continuous risk score (0–100%) for every scheduled appointment using a trained **`RandomForestClassifier`** model evaluating 7 key clinical and logistical features.
2. **Priority Patient Ranking Engine**: Automatically sort daily hospital patient caseloads in descending order of risk so doctors and staff immediately focus on high-risk patients.
3. **Explainable AI (XAI) Transparency**: Provide transparent, human-readable bullet-point explanations detailing **why** a patient is predicted at high risk (e.g., missed appointment history, attendance rate %, travel distance, frequency gap).
4. **Pre-Appointment Clinical Interventions**: Enable 1-click staff interventions prior to appointment dates via native phone dialers and real-time SMS dispatch to operational numbers (`+91 7598357132`).
5. **Role-Based Access Control & Privacy Isolation**: Isolate sensitive patient data so individual patients see **ONLY their own private records**, while Doctors, Nurses, and System Administrators access role-scoped operational dashboards.
6. **Age-Aware Accessibility**: Provide high-contrast modes, large typography controls, and intuitive visual cards designed for elderly patients.

### 🔮 Secondary Objectives (Future Roadmap & Planned Developments)
1. **EHR / HL7 FHIR Interoperability**: Seamless integration with hospital Electronic Health Record (EHR) systems (Epic, Cerner, ABDM India Health Stack) via standard HL7/FHIR APIs.
2. **AI Multilingual Voice & WhatsApp Outreach Bots**: Automated multi-channel reminders in regional languages (Tamil, Hindi, Telugu, Malayalam) via WhatsApp Business API and interactive voice response (IVR).
3. **IoT Wearable & Remote Patient Monitoring Sync**: Integrate live vitals (blood pressure, heart rate, blood glucose) from Bluetooth/cellular health monitors to auto-trigger high-priority follow-up appointments.
4. **Deep SHAP & LIME Interpretability**: Incorporate SHAP (SHapley Additive exPlanations) water-fall plots directly into the doctor dashboard for deep algorithmic auditability.
5. **Automated Transport & Shuttle Dispatch**: Partner with local ride-hailing services (Ola/Uber Health) to automatically book transport assistance for elderly patients living $>20\text{ km}$ from the hospital.

---

## 🛠️ Technical Stack & System Architecture

### **Frontend Architecture**
- **Framework**: React 19 (Hooks, Context API, React Router v7)
- **Styling**: Utility-first CSS Custom Properties (`App.css`), Dynamic Dark Mode Theme Tokens, High-Contrast Modes
- **State & Data Store**: Real-time Event-Driven `DataStore` with `localStorage` fallback persistence
- **Icons & Visuals**: SVG Icon Systems, Unsplash Medical Photography CDN
- **Audio Operations**: HTML5 Web Audio Synthesizer Engine for custom alert tones (24h, 2h, 30m, Missed alerts)

### **Backend & Machine Learning Microservice**
- **Language**: Python 3.10+
- **Framework**: Flask REST API (`flask`, `flask-cors`)
- **ML Algorithm**: `scikit-learn` `RandomForestClassifier` (120 Decision Trees, Max Depth 7)
- **Data Analytics**: `pandas`, `numpy`, `joblib` model serialization
- **Communication Protocol**: Asynchronous HTTP JSON REST APIs (`http://127.0.0.1:5000/api/ml/predict`)

### **Deployment & Cloud Infrastructure**
- **Frontend Hosting**: Vercel Single-Page Application (SPA) Engine
- **Build Tooling**: `react-scripts`, Webpack, Babel
- **CI/CD Integration**: Vercel Git Continuous Deployment Pipeline

---

## 🧮 Machine Learning Model & Feature Engineering

The model evaluates **7 core clinical & logistical features**:

| Feature Name | Data Type | Range / Options | ML Importance |
| :--- | :--- | :--- | :--- |
| **Missed Appointments** | Integer | `0 – 15 visits` | ⭐ **Very High** |
| **Attendance Rate %** | Float | `0.0% – 100.0%` | ⭐ **Very High** ($\frac{\text{Total} - \text{Missed}}{\text{Total}} \times 100$) |
| **Distance from Hospital** | Float | `0.5 – 50.0 km` | 🔴 **High** |
| **Appointment Frequency Gap** | Categorical | `7, 14, 30, 60, 90 days` | 🔴 **High** |
| **Total Previous Appointments** | Integer | `1 – 30 visits` | 🟠 **Medium** |
| **Treatment Duration** | Integer | `1 – 60 months` | 🟠 **Medium** |
| **Patient Age** | Integer | `1 – 100 years` | 🟢 **Low–Medium** |

### **Explainability Output Structure**
```
                 FOLLOW-UP RISK: 64 / 100 (HIGH RISK)

Why?
• 3 previous appointments missed
• Attendance rate is only 75%
• Hospital is 13.5 km away (High travel burden)
• Follow-up interval is 30 days
```

---

## 🔑 Workspaces & Login Credentials

Select the appropriate role on the **Login Screen (`/login`)**:

| Role | Username / ID | Password | Access & Workspace Description |
| :--- | :--- | :--- | :--- |
| **Patient (Santhosh)** | `P-1001` or `santhosh` | `123456` | **Santhosh M Portal**: Private view of own Cardiology appointment (`15 Sep 2026`). |
| **Patient (Shriakash)** | `P-1002` or `shriakash` | `123456` | **Shriakash S Portal**: Private view of high-risk Cardiology record. |
| **Attending Doctor** | `doctor` or `sundaramurthy.iyer@caretrack.health` | `123456` | **360° Doctor Portal**: Clinical caseload ranked by ML risk score. |
| **Staff Nurse** | `nurse` or `meenakshi.sundaram@caretrack.health` | `123456` | **Nurse Outreach Desk**: High-risk outreach call & SMS queue. |
| **System Admin** | `admin` or `admin@caretrack.health` | `123456` | **Admin Command Center**: Unrestricted system-wide management. |

---

## ⚡ Getting Started & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/santhosh2007-05/thrive-event.git
cd thrive-event
```

### 2. Launch the React Frontend
```bash
cd Frontend
npm install
npm start
```
*App will run locally on `http://localhost:3000`.*

### 3. Launch the Python Machine Learning Service
```bash
cd Backend/ml_service
pip install flask flask-cors scikit-learn pandas numpy joblib
python app.py
```
*ML Service will run locally on `http://127.0.0.1:5000`.*

---

## 📜 License & Compliance

Developed for educational, research, and healthcare technology demonstration purposes under the **MIT License**. All default patient datasets utilize anonymized South Indian healthcare demographics in accordance with data privacy best practices.
