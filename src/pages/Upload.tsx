
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload as UploadIcon, Smartphone, CheckCircle, AlertCircle, RefreshCw, MessageSquare, Settings, Wifi, Bluetooth } from "lucide-react";
import { mobileDeviceScanner, MobileDevice, TextMessage } from "@/services/mobileDeviceScanner";
import { messageSync } from "@/services/messageSync";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const [devices, setDevices] = useState<MobileDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  const [syncProgress, setSyncProgress] = useState<Record<string, number>>({});
  const [syncedMessages, setSyncedMessages] = useState<Record<string, TextMessage[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = mobileDeviceScanner.subscribe((devices) => {
      setDevices(devices);
      setScanning(mobileDeviceScanner.isCurrentlyScanning());
    });

    // Load initial devices
    setDevices(mobileDeviceScanner.getDevices());
    
    return unsubscribe;
  }, []);

  const requestPermissions = async (device: MobileDevice) => {
    try {
      const granted = await mobileDeviceScanner.requestPermissions(device.id);
      if (granted) {
        toast({
          title: "Permissions Granted",
          description: `${device.name} can now access your messages.`,
        });
      } else {
        toast({
          title: "Permission Denied",
          description: "Message access was denied. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Permission Error",
        description: "Failed to request permissions. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startDeviceScan = async () => {
    try {
      await mobileDeviceScanner.scanForDevices();
      toast({
        title: "Scan Complete",
        description: `Found ${devices.length} devices available for syncing.`,
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Could not scan for devices. Please try again.",
        variant: "destructive",
      });
    }
  };

  const syncDevice = async (device: MobileDevice) => {
    if (!device.permissions.sms) {
      toast({
        title: "Permission Required",
        description: "Please grant SMS permissions first.",
        variant: "destructive",
      });
      return;
    }

    setSyncProgress(prev => ({ ...prev, [device.id]: 0 }));
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setSyncProgress(prev => {
        const current = prev[device.id] || 0;
        if (current >= 100) {
          clearInterval(progressInterval);
          return prev;
        }
        return { ...prev, [device.id]: Math.min(current + 20, 100) };
      });
    }, 600);

    try {
      const messages = await mobileDeviceScanner.syncMessages(device.id);
      setSyncedMessages(prev => ({ ...prev, [device.id]: messages }));
      
      // Also sync to the main message service
      const platformMessages = messages.map(msg => ({
        id: msg.id,
        contact: msg.address,
        content: msg.body,
        timestamp: new Date(msg.date),
        platform: 'sms' as const,
        deviceId: device.id
      }));
      
      await messageSync.syncMessages(device.id, ['sms']);
      
      toast({
        title: "Sync Complete",
        description: `Successfully synced ${messages.length} messages from ${device.name}`,
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSyncProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[device.id];
        return newProgress;
      });
    }
  };

  const getDeviceIcon = (device: MobileDevice) => {
    switch (device.type) {
      case 'current':
        return <Smartphone className="w-5 h-5 text-blue-600" />;
      case 'bluetooth':
        return <Bluetooth className="w-5 h-5 text-purple-600" />;
      case 'wifi':
        return <Wifi className="w-5 h-5 text-green-600" />;
      default:
        return <Smartphone className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPermissionStatusColor = (permissions: MobileDevice['permissions']) => {
    if (permissions.sms && permissions.contacts && permissions.storage) return 'text-green-600';
    if (permissions.sms) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPermissionIcon = (permissions: MobileDevice['permissions']) => {
    if (permissions.sms && permissions.contacts && permissions.storage) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    if (permissions.sms) {
      return <AlertCircle className="w-5 h-5 text-orange-600" />;
    }
    return <Settings className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Message Backup & Sync</h1>
        <p className="text-muted-foreground mt-2">
          Securely backup and sync your SMS and WhatsApp messages across all your devices
        </p>
      </div>

      {/* Message Backup & Sync */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-primary" />
            Message Backup & Sync
          </CardTitle>
          <CardDescription>
            Connect your devices to backup and sync your messages securely
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={startDeviceScan}
            disabled={scanning}
            className="w-full"
          >
            {scanning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Scanning for devices...
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 mr-2" />
                Scan for Devices
              </>
            )}
          </Button>

          {devices.length > 0 && (
            <div className="space-y-3 mt-6">
              <h4 className="text-sm font-medium">
                Available Devices ({devices.length})
              </h4>
              {devices.map((device) => (
                <div key={device.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getDeviceIcon(device)}
                      <div>
                        <h5 className="font-medium flex items-center gap-2">
                          {device.name}
                          <Badge variant={device.type === 'current' ? 'default' : 'secondary'}>
                            {device.type}
                          </Badge>
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {device.platform} • 
                          {device.messageCount ? ` ${device.messageCount} messages` : ' Unknown count'}
                          {device.lastSync && ` • Last sync: ${device.lastSync.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                    <Badge variant={device.status === 'connected' ? 'default' : 'secondary'}>
                      {device.status}
                    </Badge>
                  </div>

                   {/* Permission Status */}
                   <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getPermissionIcon(device.permissions)}
                      <span className={`text-sm ${getPermissionStatusColor(device.permissions)}`}>
                        {device.permissions.sms && device.permissions.contacts && device.permissions.storage
                          ? 'All permissions granted'
                          : device.permissions.sms
                          ? 'Basic permissions granted'
                          : 'Permissions required'
                        }
                      </span>
                    </div>
                    {!device.permissions.sms && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => requestPermissions(device)}
                      >
                        Grant Access
                      </Button>
                    )}
                  </div>

                  {/* Sync Progress */}
                  {syncProgress[device.id] !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Syncing messages...</span>
                        <span>{syncProgress[device.id]}%</span>
                      </div>
                      <Progress value={syncProgress[device.id]} className="w-full" />
                    </div>
                  )}

                  {/* Sync Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => syncDevice(device)}
                      disabled={!device.permissions.sms || device.status === 'syncing' || syncProgress[device.id] !== undefined}
                      className="flex-1"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {syncProgress[device.id] !== undefined ? 'Syncing...' : 'Sync Messages'}
                    </Button>
                  </div>

                   {/* Synced Messages Summary */}
                   {syncedMessages[device.id] && (
                     <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                       <p className="text-sm text-green-600 dark:text-green-400">
                         ✓ Successfully synced {syncedMessages[device.id].length} messages
                       </p>
                     </div>
                   )}
                </div>
              ))}
            </div>
          )}

          {!scanning && devices.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No devices found. Click "Scan for Devices" to look for available devices.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
