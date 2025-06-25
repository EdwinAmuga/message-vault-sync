
export interface Message {
  id: string;
  contact: string;
  content: string;
  timestamp: Date;
  platform: 'sms' | 'whatsapp';
  deviceId: string;
}

export interface SyncStats {
  totalMessages: number;
  smsMessages: number;
  whatsappMessages: number;
  lastSync: Date | null;
  syncInProgress: boolean;
}

class MessageSyncService {
  private messages: Message[] = [];
  private syncInProgress = false;
  private listeners: ((stats: SyncStats) => void)[] = [];

  async syncMessages(deviceId: string, platforms: ('sms' | 'whatsapp')[]): Promise<void> {
    this.syncInProgress = true;
    this.notifyListeners();

    // Simulate message sync
    const mockMessages: Message[] = [];
    const contacts = ['John Doe', 'Sarah Wilson', 'Mike Johnson', 'Emily Davis', 'Team Group'];
    const messageTemplates = [
      'Hey, how are you doing?',
      'Meeting at 3 PM today',
      'Don\'t forget the documents',
      'Thanks for the help!',
      'See you tomorrow',
      'Call me when you get this',
      'Project update is ready'
    ];

    platforms.forEach(platform => {
      for (let i = 0; i < 50; i++) {
        mockMessages.push({
          id: `${deviceId}-${platform}-${i}`,
          contact: contacts[Math.floor(Math.random() * contacts.length)],
          content: messageTemplates[Math.floor(Math.random() * messageTemplates.length)],
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          platform,
          deviceId
        });
      }
    });

    // Simulate sync delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    this.messages = [...this.messages, ...mockMessages];
    this.syncInProgress = false;
    this.notifyListeners();
  }

  getMessages(): Message[] {
    return this.messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getStats(): SyncStats {
    const smsMessages = this.messages.filter(m => m.platform === 'sms').length;
    const whatsappMessages = this.messages.filter(m => m.platform === 'whatsapp').length;
    const lastSync = this.messages.length > 0 ? 
      new Date(Math.max(...this.messages.map(m => m.timestamp.getTime()))) : null;

    return {
      totalMessages: this.messages.length,
      smsMessages,
      whatsappMessages,
      lastSync,
      syncInProgress: this.syncInProgress
    };
  }

  subscribe(callback: (stats: SyncStats) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(): void {
    const stats = this.getStats();
    this.listeners.forEach(listener => listener(stats));
  }
}

export const messageSync = new MessageSyncService();
