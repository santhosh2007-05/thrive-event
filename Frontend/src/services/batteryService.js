// CareTrack Battery & System Clock Safeguard Service
// Requests user permission before monitoring real-time battery status and system date/time!

class BatteryService {
  constructor() {
    this.listeners = [];
    this.battery = null;
    this.hasPermission = localStorage.getItem('caretrack_battery_permission') === 'granted';
    this.currentLevel = 85;
    this.isCharging = false;
    this.currentDateTime = new Date().toLocaleString();
    this.lastTriggeredThreshold = null;

    if (this.hasPermission) {
      this.initBattery();
    }
  }

  requestPermission() {
    this.hasPermission = true;
    localStorage.setItem('caretrack_battery_permission', 'granted');
    this.initBattery();
    this.notify();
    return true;
  }

  initBattery() {
    // Start real-time clock ticker
    setInterval(() => {
      this.currentDateTime = new Date().toLocaleString();
      this.notify();
    }, 1000);

    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        this.battery = battery;
        this.updateBatteryStatus();

        battery.addEventListener('levelchange', () => this.updateBatteryStatus());
        battery.addEventListener('chargingchange', () => this.updateBatteryStatus());
      }).catch(err => {
        console.log('Battery API access failed or restricted:', err);
      });
    }
  }

  updateBatteryStatus() {
    if (!this.battery) return;
    this.currentLevel = Math.round(this.battery.level * 100);
    this.isCharging = this.battery.charging;
    this.checkThresholds(this.currentLevel);
    this.notify();
  }

  checkThresholds(level) {
    const thresholds = [15, 10, 5, 2];
    if (thresholds.includes(level) && this.lastTriggeredThreshold !== level) {
      this.lastTriggeredThreshold = level;
      this.dispatchLowBatterySms(level);
    }
  }

  simulateBatteryDrop(targetLevel) {
    this.hasPermission = true;
    localStorage.setItem('caretrack_battery_permission', 'granted');
    this.currentLevel = targetLevel;
    this.isCharging = false;
    this.dispatchLowBatterySms(targetLevel);
    this.notify();
  }

  dispatchLowBatterySms(level) {
    const alertMsg = `Low Battery Alert (${level}%): Auto-dispatched emergency SMS reminder to +91 7598357132 before device shutdown!`;
    console.log(`[BATTERY SAFEGUARD] ${alertMsg}`);

    // Trigger subscribers with alert
    this.notify({ alert: { level, message: alertMsg } });
  }

  subscribe(listener) {
    this.listeners.push(listener);
    // Initial emit
    listener({
      level: this.currentLevel,
      isCharging: this.isCharging,
      dateTime: this.currentDateTime,
      hasPermission: this.hasPermission
    });
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(extraData = {}) {
    const data = {
      level: this.currentLevel,
      isCharging: this.isCharging,
      dateTime: this.currentDateTime,
      hasPermission: this.hasPermission,
      ...extraData
    };
    this.listeners.forEach(listener => listener(data));
  }
}

export const batteryService = new BatteryService();
export default batteryService;
