
import { Capacitor } from '@capacitor/core';

export interface MobileDevice {
  id: string;
  name: string;
  type: 'current' | 'bluetooth' | 'wifi';
  platform: 'android' | 'ios' | 'web';
  status: 'connected' | 'scanning' | 'syncing' | 'error';
  messageCount?: number;
  lastSync?: Date;
  permissions: {
    sms: boolean;
    contacts: boolean;
    storage: boolean;
  };
}

export interface TextMessage {
  id: string;
  threadId: string;
  address: string;
  body: string;
  date: number;
  type: 'inbox' | 'sent';
  read: boolean;
}

class MobileDeviceScannerService {
  private devices: MobileDevice[] = [];
  private isScanning = false;
  private listeners: ((devices: MobileDevice[]) => void)[] = [];

  constructor() {
    // Add current device automatically
    this.addCurrentDevice();
  }

  private addCurrentDevice() {
    const platform = Capacitor.getPlatform() as 'android' | 'ios' | 'web';
    const currentDevice: MobileDevice = {
      id: 'current-device',
      name: platform === 'web' ? 'Web Browser' : `My ${platform === 'ios' ? 'iPhone' : 'Android'}`,
      type: 'current',
      platform,
      status: 'connected',
      permissions: {
        sms: false,
        contacts: false,
        storage: false
      }
    };
    this.devices = [currentDevice];
    this.notifyListeners();
  }

  async requestPermissions(deviceId: string): Promise<boolean> {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) return false;

    try {
      if (Capacitor.getPlatform() === 'web') {
        // For web, simulate permission request
        await new Promise(resolve => setTimeout(resolve, 2000));
        device.permissions = { sms: true, contacts: true, storage: true };
        this.notifyListeners();
        return true;
      }

      // For mobile platforms, request actual permissions
      // This would use Capacitor plugins for real permission requests
      device.permissions = { sms: true, contacts: true, storage: true };
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  async scanForDevices(): Promise<void> {
    if (this.isScanning) return;
    
    this.isScanning = true;
    this.notifyListeners();

    try {
      // Simulate scanning for nearby devices
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (Capacitor.getPlatform() !== 'web') {
        const mockDevices: MobileDevice[] = [
          {
            id: 'bluetooth-device-1',
            name: 'Partner\'s Phone',
            type: 'bluetooth',
            platform: 'android',
            status: 'connected',
            messageCount: 1247,
            permissions: { sms: false, contacts: false, storage: false }
          }
        ];
        
        this.devices = [...this.devices.filter(d => d.type === 'current'), ...mockDevices];
      }
      
      this.isScanning = false;
      this.notifyListeners();
    } catch (error) {
      console.error('Device scan failed:', error);
      this.isScanning = false;
      this.notifyListeners();
    }
  }

  async syncMessages(deviceId: string): Promise<TextMessage[]> {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device || !device.permissions.sms) {
      throw new Error('Device not found or SMS permission not granted');
    }

    device.status = 'syncing';
    this.notifyListeners();

    try {
      // For demonstration, create mock messages
      const mockMessages: TextMessage[] = [];
      const contacts = ['Mom', 'Dad', 'Sarah', 'John', 'Work Team', 'Doctor', 'Bank'];
      const messageTemplates = [
        'Hey, how are you?',
        'Running late, be there in 10 mins',
        'Don\'t forget about dinner tonight',
        'Thanks for your help!',
        'Can you call me when you get this?',
        'Meeting moved to 3 PM',
        'Happy birthday! 🎉',
        'See you tomorrow',
        'Traffic is crazy today',
        'Got your message, will respond later'
      ];

      for (let i = 0; i < 50; i++) {
        mockMessages.push({
          id: `msg-${deviceId}-${i}`,
          threadId: `thread-${Math.floor(i / 5)}`,
          address: contacts[Math.floor(Math.random() * contacts.length)],
          body: messageTemplates[Math.floor(Math.random() * messageTemplates.length)],
          date: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
          type: Math.random() > 0.5 ? 'inbox' : 'sent',
          read: Math.random() > 0.3
        });
      }

      // Simulate sync delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      device.status = 'connected';
      device.messageCount = mockMessages.length;
      device.lastSync = new Date();
      this.notifyListeners();

      return mockMessages;
    } catch (error) {
      device.status = 'error';
      this.notifyListeners();
      throw error;
    }
  }

  getDevices(): MobileDevice[] {
    return this.devices;
  }

  isCurrentlyScanning(): boolean {
    return this.isScanning;
  }

  subscribe(callback: (devices: MobileDevice[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.devices));
  }
}

export const mobileDeviceScanner = new MobileDeviceScannerService();
