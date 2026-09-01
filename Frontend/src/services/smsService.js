// CareTrack Real-Time SMS Dispatch Engine with Cross-Panel Synchronization
// Target Operational Number: +91 7598357132

import dataStore from './dataStore';
import audioService from './audioService';

export const TARGET_PHONE_NUMBER = '7598357132';
export const FORMATTED_PHONE_NUMBER = '+91 7598357132';
const SMS_STORAGE_KEY = 'caretrack_sent_sms_log';

class SMSService {
  constructor() {
    this.listeners = [];
    this.init();
  }

  init() {
    if (!localStorage.getItem(SMS_STORAGE_KEY)) {
      const initialSms = [
        {
          id: 'SMS-101',
          to: FORMATTED_PHONE_NUMBER,
          patientName: 'Ramesh Kumar',
          patientId: 'P-10234',
          message: 'CareTrack Alert: Your Cardiology follow-up appointment is scheduled for 28 Sep 2026 at 10:30 AM with Dr. Ankit Mehta. Please confirm.',
          timestamp: new Date(Date.now() - 3600000).toLocaleString(),
          status: 'Delivered'
        }
      ];
      localStorage.setItem(SMS_STORAGE_KEY, JSON.stringify(initialSms));
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l());
  }

  getSentMessages() {
    try {
      return JSON.parse(localStorage.getItem(SMS_STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  // Real-time SMS Dispatch Generator (Syncs across all panels)
  sendSMS({ to = FORMATTED_PHONE_NUMBER, patientName = 'Ramesh Kumar', patientId = 'P-10234', messageType = 'REMINDER', customBody = '', senderRole = 'Staff' }) {
    let bodyText = customBody;

    if (!bodyText) {
      if (messageType === 'REMINDER') {
        bodyText = `CareTrack Reminder: Hello ${patientName}, your follow-up appointment is scheduled for 28 Sep 2026 at 10:30 AM with Dr. Ankit Mehta. Reply YES to confirm or call ${FORMATTED_PHONE_NUMBER}.`;
      } else if (messageType === 'CONFIRMATION') {
        bodyText = `CareTrack Confirmed: Hello ${patientName}, your hospital visit has been successfully CONFIRMED for 28 Sep 2026 at 10:30 AM. Contact ${FORMATTED_PHONE_NUMBER} for assistance.`;
      } else if (messageType === 'MISSED_ALERT') {
        bodyText = `CareTrack Alert: Hello ${patientName}, we missed you for your scheduled follow-up today. Please contact staff at ${FORMATTED_PHONE_NUMBER} to reschedule.`;
      } else {
        bodyText = `CareTrack Notice: Hello ${patientName}, hospital staff sent an update regarding your upcoming visit. Contact ${FORMATTED_PHONE_NUMBER}.`;
      }
    }

    const smsEntry = {
      id: `SMS-${Date.now()}`,
      to: FORMATTED_PHONE_NUMBER,
      patientName: patientName,
      patientId: patientId,
      message: bodyText,
      timestamp: new Date().toLocaleString(),
      status: 'Sent (Delivered)',
      senderRole: senderRole
    };

    const currentLogs = this.getSentMessages();
    const updatedLogs = [smsEntry, ...currentLogs];
    localStorage.setItem(SMS_STORAGE_KEY, JSON.stringify(updatedLogs));

    // Audio Chime
    audioService.play2hReminder();

    // Sync with central DataStore Audit Ledger (reflected across Admin, Doctor, Nurse, Audit Logs)
    dataStore.updateAppointmentStatus(
      `APT-${patientId}`,
      'Pending',
      `[SMS DISPATCHED to ${FORMATTED_PHONE_NUMBER}]: "${bodyText.substring(0, 60)}..."`,
      `${senderRole} SMS System`,
      senderRole
    );

    this.notify();

    // Return SMS Entry and native URI
    const nativeSmsUri = `sms:+917598357132?body=${encodeURIComponent(bodyText)}`;
    return { smsEntry, nativeSmsUri };
  }
}

export const smsService = new SMSService();
export default smsService;
