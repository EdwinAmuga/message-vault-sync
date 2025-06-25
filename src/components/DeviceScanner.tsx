
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { deviceScanner, Device, ScanResult } from "@/services/deviceScanner";

const DeviceScanner = () => {
  const [scanResult, setScanResult] = useState<ScanResult>({
    devices: [],
    scanning: false
  });

  useEffect(() => {
    const unsubscribe = deviceScanner.subscribe(setScanResult);
    return unsubscribe;
  }, []);

  const handleStartScan = () => {
    deviceScanner.startScan();
  };

  const handleSyncDevice = (deviceId: string) => {
    deviceScanner.syncDevice(deviceId);
  };

  const getStatusIcon = (device: Device) => {
    if (device.status === 'syncing') {
      return <RefreshCw className="w-4 h-4 animate-spin text-orange-500" />;
    }
    return device.status === 'connected' ? 
      <Wifi className="w-4 h-4 text-green-500" /> : 
      <WifiOff className="w-4 h-4 text-gray-400" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-blue-600" />
          Device Scanner
        </CardTitle>
        <CardDescription>
          Scan for devices to backup messages from
        </CardDescription>
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
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Device Scan
            </>
          )}
        </Button>

        {scanResult.devices.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Found Devices ({scanResult.devices.length})
            </h4>
            {scanResult.devices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(device)}
                  <div>
                    <div className="font-medium text-sm">{device.name}</div>
                    <div className="text-xs text-gray-500">
                      {device.type === 'ios' ? 'iPhone' : 'Android'} • 
                      {device.messageCount ? ` ${device.messageCount} messages` : ' Unknown messages'}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSyncDevice(device.id)}
                  disabled={device.status === 'syncing'}
                >
                  {device.status === 'syncing' ? 'Syncing...' : 'Sync'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceScanner;
