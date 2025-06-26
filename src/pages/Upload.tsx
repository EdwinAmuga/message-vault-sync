
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Smartphone, CheckCircle, AlertCircle, RefreshCw, MessageSquare, Settings } from "lucide-react";
import { deviceScanner, Device } from "@/services/deviceScanner";
import { messageSync } from "@/services/messageSync";
import { useToast } from "@/hooks/use-toast";

const Upload = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'pending' | null>(null);
  const [syncProgress, setSyncProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = deviceScanner.subscribe((result) => {
      setDevices(result.devices);
      setScanning(result.scanning);
    });
    return unsubscribe;
  }, []);

  const requestPermissions = async () => {
    setPermissionStatus('pending');
    
    // Simulate permission request
    setTimeout(() => {
      setPermissionStatus('granted');
      toast({
        title: "Permissions Granted",
        description: "Device access granted. You can now scan for messages.",
      });
    }, 2000);
  };

  const startDeviceScan = async () => {
    if (permissionStatus !== 'granted') {
      toast({
        title: "Permission Required",
        description: "Please grant device access permissions first.",
        variant: "destructive",
      });
      return;
    }
    
    await deviceScanner.startScan();
    toast({
      title: "Scanning Started",
      description: "Looking for nearby devices...",
    });
  };

  const syncDevice = async (device: Device, platforms: ('sms' | 'whatsapp')[]) => {
    setSyncProgress(prev => ({ ...prev, [device.id]: 0 }));
    
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setSyncProgress(prev => {
        const current = prev[device.id] || 0;
        if (current >= 100) {
          clearInterval(progressInterval);
          return prev;
        }
        return { ...prev, [device.id]: current + 10 };
      });
    }, 500);

    try {
      await deviceScanner.syncDevice(device.id);
      await messageSync.syncMessages(device.id, platforms);
      
      toast({
        title: "Sync Complete",
        description: `Successfully synced messages from ${device.name}`,
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

  const getPermissionStatusColor = () => {
    switch (permissionStatus) {
      case 'granted': return 'text-green-600';
      case 'denied': return 'text-red-600';
      case 'pending': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getPermissionIcon = () => {
    switch (permissionStatus) {
      case 'granted': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'denied': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'pending': return <RefreshCw className="w-5 h-5 text-orange-600 animate-spin" />;
      default: return <Settings className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Upload Messages</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Scan and upload messages from your devices with real-time synchronization
        </p>
      </div>

      {/* Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getPermissionIcon()}
            Device Permissions
          </CardTitle>
          <CardDescription>
            Grant access to scan and sync messages from your devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={permissionStatus === 'granted' ? 'default' : 'secondary'}>
                {permissionStatus === 'granted' ? 'Granted' : 
                 permissionStatus === 'denied' ? 'Denied' :
                 permissionStatus === 'pending' ? 'Requesting...' : 'Not Requested'}
              </Badge>
              <span className={`text-sm ${getPermissionStatusColor()}`}>
                {permissionStatus === 'granted' ? 'Device access is enabled' :
                 permissionStatus === 'denied' ? 'Permission was denied' :
                 permissionStatus === 'pending' ? 'Waiting for permission...' :
                 'Click to request device access'}
              </span>
            </div>
            {permissionStatus !== 'granted' && (
              <Button 
                onClick={requestPermissions}
                disabled={permissionStatus === 'pending'}
              >
                {permissionStatus === 'pending' ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  'Request Permission'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Device Scanner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-blue-600" />
            Device Scanner
          </CardTitle>
          <CardDescription>
            Scan for nearby devices to sync messages from
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={startDeviceScan}
            disabled={scanning || permissionStatus !== 'granted'}
            className="w-full"
          >
            {scanning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Scanning for devices...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Start Device Scan
              </>
            )}
          </Button>

          {devices.length > 0 && (
            <div className="space-y-3 mt-6">
              <h4 className="text-sm font-medium text-gray-700">
                Found Devices ({devices.length})
              </h4>
              {devices.map((device) => (
                <div key={device.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <div>
                        <h5 className="font-medium">{device.name}</h5>
                        <p className="text-sm text-gray-500">
                          {device.type === 'ios' ? 'iPhone' : 'Android'} • 
                          {device.messageCount ? ` ${device.messageCount} messages` : ' Unknown count'}
                        </p>
                      </div>
                    </div>
                    <Badge variant={device.status === 'connected' ? 'default' : 'secondary'}>
                      {device.status}
                    </Badge>
                  </div>

                  {/* Sync Progress */}
                  {syncProgress[device.id] !== undefined && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${syncProgress[device.id]}%` }}
                      ></div>
                    </div>
                  )}

                  {/* Sync Options */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => syncDevice(device, ['sms'])}
                      disabled={device.status === 'syncing' || syncProgress[device.id] !== undefined}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Sync SMS
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => syncDevice(device, ['whatsapp'])}
                      disabled={device.status === 'syncing' || syncProgress[device.id] !== undefined}
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Sync WhatsApp
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => syncDevice(device, ['sms', 'whatsapp'])}
                      disabled={device.status === 'syncing' || syncProgress[device.id] !== undefined}
                    >
                      Sync All
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!scanning && devices.length === 0 && permissionStatus === 'granted' && (
            <div className="text-center py-8 text-gray-500">
              <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No devices found. Make sure your devices are nearby and have Bluetooth enabled.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Upload;
