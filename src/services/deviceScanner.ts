
export interface Device {
  id: string;
  name: string;
  type: 'android' | 'ios';
  status: 'connected' | 'disconnected' | 'syncing';
  lastSync?: Date;
  messageCount?: number;
}

export interface ScanResult {
  devices: Device[];
  scanning: boolean;
}

class DeviceScannerService {
  private devices: Device[] = [];
  private isScanning = false;
  private listeners: ((result: ScanResult) => void)[] = [];

  async startScan(): Promise<void> {
    this.isScanning = true;
    this.notifyListeners();

    // Simulate device discovery
    setTimeout(() => {
      const mockDevices: Device[] = [
        {
          id: '1',
          name: 'John\'s iPhone',
          type: 'ios',
          status: 'connected',
          lastSync: new Date(Date.now() - 1000 * 60 * 30),
          messageCount: 1247
        },
        {
          id: '2',
          name: 'Samsung Galaxy S23',
          type: 'android',
          status: 'connected',
          lastSync: new Date(Date.now() - 1000 * 60 * 15),
          messageCount: 892
        }
      ];
      
      this.devices = mockDevices;
      this.isScanning = false;
      this.notifyListeners();
    }, 3000);
  }

  async syncDevice(deviceId: string): Promise<void> {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) return;

    device.status = 'syncing';
    this.notifyListeners();

    // Simulate sync process
    setTimeout(() => {
      device.status = 'connected';
      device.lastSync = new Date();
      device.messageCount = (device.messageCount || 0) + Math.floor(Math.random() * 50);
      this.notifyListeners();
    }, 5000);
  }

  getDevices(): Device[] {
    return this.devices;
  }

  subscribe(callback: (result: ScanResult) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(): void {
    const result: ScanResult = {
      devices: this.devices,
      scanning: this.isScanning
    };
    this.listeners.forEach(listener => listener(result));
  }
}

export const deviceScanner = new DeviceScannerService();
