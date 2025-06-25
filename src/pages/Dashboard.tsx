
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Upload, Download, Users, Activity, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { messageSync, SyncStats } from "@/services/messageSync";
import DeviceScanner from "@/components/DeviceScanner";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [syncStats, setSyncStats] = useState<SyncStats>({
    totalMessages: 0,
    smsMessages: 0,
    whatsappMessages: 0,
    lastSync: null,
    syncInProgress: false
  });
  
  const { logout } = useAuth();

  useEffect(() => {
    const unsubscribe = messageSync.subscribe(setSyncStats);
    // Initial load
    setSyncStats(messageSync.getStats());
    return unsubscribe;
  }, []);

  const stats = [
    {
      title: "Total Messages",
      value: syncStats.totalMessages.toLocaleString(),
      description: "Across all platforms",
      icon: MessageSquare,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "SMS Messages",
      value: syncStats.smsMessages.toLocaleString(),
      description: "Text messages backed up",
      icon: MessageSquare,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "WhatsApp Messages",
      value: syncStats.whatsappMessages.toLocaleString(),
      description: "Chat messages synced",
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Sync Status",
      value: syncStats.syncInProgress ? "Active" : "Idle",
      description: syncStats.lastSync ? `Last: ${syncStats.lastSync.toLocaleString()}` : "Never synced",
      icon: Activity,
      color: syncStats.syncInProgress ? "text-orange-600" : "text-gray-600",
      bgColor: syncStats.syncInProgress ? "bg-orange-50 dark:bg-orange-950" : "bg-gray-50 dark:bg-gray-800",
    },
  ];

  const exportMessages = () => {
    const messages = messageSync.getMessages();
    const dataStr = JSON.stringify(messages, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `messages-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto flex flex-col min-h-full">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Overview of your message backup and sync activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <DeviceScanner />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-green-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Export and manage your backed up messages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={exportMessages}
              className="w-full justify-start" 
              variant="outline"
              disabled={syncStats.totalMessages === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Messages ({syncStats.totalMessages})
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import Messages
            </Button>
            <div className="pt-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {syncStats.syncInProgress ? (
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-pulse" />
                    Sync in progress...
                  </span>
                ) : (
                  `Ready to sync. ${syncStats.totalMessages > 0 ? 'Messages are up to date.' : 'No messages synced yet.'}`
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logout button at the bottom */}
      <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
        <Button 
          variant="outline" 
          onClick={logout}
          className="w-full justify-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
