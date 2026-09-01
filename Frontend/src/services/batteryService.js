// CareTrack Patient Low Battery Emergency Outreach Monitor
// Auto-dispatches appointment reminders to patient phone (+91 7598357132) at 15%, 10%, 5%, 2% battery levels!

import smsService, { FORMATTED_PHONE_NUMBER } from './smsService';
import audioService from './audioService';

class BatteryMonitorService {
  constructor() {
    this.listeners = [];
    this.alertedThresholds = new Set();
    this.currentBatteryLevel = 85; // Default percentage
    this.isCharging = false;
    this.init();
  }

  async init() {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        this.updateBatteryStatus(battery);

        battery.addEventListener('levelchange', () => this.updateBatteryStatus(battery));
        battery.addEventListener('chargingchange', () => this.updateBatteryStatus(battery));
      } catch (err) {
        console.log('Web Battery API unavailable, using simulated monitor:', err.message);
      }
    }
  }

  updateBatteryStatus(battery) {
    this.currentBatteryLevel = Math.round(battery.level * 100);
    this.isCharging = battery.charging;
    this.checkThresholds(this.currentBatteryLevel, this.isCharging);
    this.notify();
  }

  checkThresholds(level, isCharging) {
    if (isCharging) {
      this.alertedThresholds.clear();
      return;
    }

    const thresholds = [15, 10, 5, 2];
    for (const t of thresholds) {
      if (level <= t && !this.alertedThresholds.has(t)) {
        this.alertedThresholds.add(t);
        this.triggerLowBatteryOutreach(t);
        break;
      }
    }
  }

  triggerLowBatteryOutreach(threshold) {
    audioService.play30mReminder();

    const messageBody = `CareTrack Battery Alert (${threshold}% Power Remaining): Hello Santhosh, your phone battery is low (${threshold}%). Your upcoming Cardiology visit with Dr. Sundaramurthy Iyer is confirmed for 15 Sep 2026 at 10:30 AM. Call ${FORMATTED_PHONE_NUMBER} if needed.`;

    smsService.sendSMS({
      to: FORMATTED_PHONE_NUMBER,
      patientName: 'Santhosh M',
      patientId: 'P-1001',
      messageType: 'BATTERY_ALERT',
      customBody: messageBody,
      senderRole: 'Battery Monitor System'
    });

    const alertObj = {
      id: `BATT-${Date.now()}`,
      level: threshold,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: `Low Battery Emergency Alert (${threshold}%): Auto-dispatched appointment details SMS to ${FORMATTED_PHONE_NUMBER}`
    };

    this.notifyAlert(alertObj);
  }

  // Simulator helper for testing 15%, 10%, 5%, 2% in presentation
  simulateBatteryDrop(level) {
    this.currentBatteryLevel = level;
    this.isCharging = false;
    this.checkThresholds(level, false);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(l => l({ level: this.currentBatteryLevel, isCharging: this.isCharging }));
  }

  notifyAlert(alertObj) {
    this.listeners.forEach(l => l({ alert: alertObj, level: this.currentBatteryLevel, isCharging: this.isCharging }));
  }
}

export const batteryService = new BatteryMonitorService();
export default batteryService;
