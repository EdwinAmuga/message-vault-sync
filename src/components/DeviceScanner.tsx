
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Smartphone, Wifi, RefreshCw, Sync, CheckCircle } from "lucide-react";
import { deviceScanner, Device, ScanResult } from "@/services/deviceScanner";
import { messageSync } from "@/services/messageSync";
import { useToast } from "@/hooks/use-toast";

const DeviceScanner = () => {
  const [scanResult, setScanResult] = useState<ScanResult>({ devices: [], scanning: false });
  const [syncSettings, setSyncSettings] = useState<Record<string, { sms: boolean; whatsapp: boolean }>>({});
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = deviceScanner.subscribe(setScanResult);
    return unsubscribe;
  }, []);

  const handleStartScan = async () => {
    toast({
      title: "Scanning for devices",
      description: "Looking for nearby mobile devices..."
    });
    await deviceScanner.startScan();
  };

  const handleSync = async (device: Device) => {
    const settings = syncSettings[device.id] || { sms: true, whatsapp: true };
    const platforms: ('sms' | 'whatsapp')[] = [];
    
    if (settings.sms) platforms.push('sms');
    if (settings.whatsapp) platforms.push('whatsapp');

    if (platforms.length === 0) {
      toast({
        title: "No platforms selected",
        description: "Please enable at least one platform to sync",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Sync started",
      description: `Syncing messages from ${device.name}...`
    });

    await Promise.all([
      deviceScanner.syncDevice(device.id),
      messageSync.syncMessages(device.id, platforms)
    ]);

    toast({
      title: "Sync completed",
      description: `Successfully synced messages from ${device.name}`
    });
  };

  const updateSyncSettings = (deviceId: string, platform: 'sms' | 'whatsapp', enabled: boolean) => {
    setSyncSettings(prev => ({
      ...prev,
      [deviceId]: {
        ...prev[deviceId],
        [platform]: enabled
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="w-5 h-5 text-blue-600" />
          Device Scanner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleStartScan} 
          disabled={scanResult.scanning}
          className="w-full"
        >
          {scanResult.scanning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 mr-2" />
              Scan for Devices
            </>
          )}
        </Button>

        {scanResult.devices.map((device) => (
          <Card key={device.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium">{device.name}</h4>
                    <p className="text-sm text-gray-500">
                      {device.type === 'ios' ? 'iPhone' : 'Android'} • {device.messageCount || 0} messages
                    </p>
                  </div>
                </div>
                <Badge 
                  variant={device.status === 'connected' ? 'default' : 
                           device.status === 'syncing' ? 'secondary' : 'outline'}
                >
                  {device.status === 'syncing' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                  {device.status === 'connected' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {device.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`sms-${device.id}`}
                    checked={syncSettings[device.id]?.sms ?? true}
                    onCheckedChange={(checked) => updateSyncSettings(device.id, 'sms', checked)}
                  />
                  <Label htmlFor={`sms-${device.id}`} className="text-sm">SMS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`whatsapp-${device.id}`}
                    checked={syncSettings[device.id]?.whatsapp ?? true}
                    onCheckedChange={(checked) => updateSyncSettings(device.id, 'whatsapp', checked)}
                  />
                  <Label htmlFor={`whatsapp-${device.id}`} className="text-sm">WhatsApp</Label>
                </div>
              </div>

              <Button
                onClick={() => handleSync(device)}
                disabled={device.status === 'syncing'}
                size="sm"
                className="w-full"
              >
                {device.status === 'syncing' ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <Sync className="w-4 h-4 mr-2" />
                    Sync Messages
                  </>
                )}
              </Button>

              {device.lastSync && (
                <p className="text-xs text-gray-500 mt-2">
                  Last sync: {device.lastSync.toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}

        {scanResult.devices.length === 0 && !scanResult.scanning && (
          <div className="text-center py-8 text-gray-500">
            <Smartphone className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No devices found. Click "Scan for Devices" to start.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceScanner;
