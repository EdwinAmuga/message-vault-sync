
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Download, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { messageSync, Message } from "@/services/messageSync";
import { useLocation, useSearchParams } from "react-router-dom";

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchParams] = useSearchParams();
  const platformFilter = searchParams.get('filter');
  
  useEffect(() => {
    const unsubscribe = messageSync.subscribe(() => {
      setMessages(messageSync.getMessages());
    });
    // Initial load
    setMessages(messageSync.getMessages());
    return unsubscribe;
  }, []);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPlatform = !platformFilter || message.platform === platformFilter;
    
    return matchesSearch && matchesPlatform;
  });

  // Group messages by contact
  const groupedMessages = filteredMessages.reduce((groups, message) => {
    const key = `${message.contact}-${message.platform}`;
    if (!groups[key]) {
      groups[key] = {
        contact: message.contact,
        platform: message.platform,
        messages: [],
        lastMessage: message,
        count: 0
      };
    }
    groups[key].messages.push(message);
    groups[key].count++;
    if (message.timestamp > groups[key].lastMessage.timestamp) {
      groups[key].lastMessage = message;
    }
    return groups;
  }, {} as Record<string, {
    contact: string;
    platform: 'sms' | 'whatsapp';
    messages: Message[];
    lastMessage: Message;
    count: number;
  }>);

  const conversationGroups = Object.values(groupedMessages).sort(
    (a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()
  );

  const exportMessages = () => {
    const dataStr = JSON.stringify(filteredMessages, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `filtered-messages-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getFilterTitle = () => {
    if (platformFilter === 'sms') return 'SMS Messages';
    if (platformFilter === 'whatsapp') return 'WhatsApp Messages';
    return 'All Messages';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {getFilterTitle()}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage your backed up messages ({filteredMessages.length} 
            {platformFilter ? ` ${platformFilter.toUpperCase()}` : ' total'})
          </p>
          {platformFilter && (
            <Badge className="mt-2" variant="outline">
              Filtered by: {platformFilter.toUpperCase()}
            </Badge>
          )}
        </div>
        <Button onClick={exportMessages} disabled={filteredMessages.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export ({filteredMessages.length})
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {conversationGroups.map((group) => (
          <Card key={`${group.contact}-${group.platform}`} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {group.platform === "sms" ? (
                      <Phone className="w-5 h-5 text-green-600" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    )}
                    <Badge 
                      variant={group.platform === "sms" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {group.platform.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{group.contact}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {group.lastMessage.content}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {group.lastMessage.timestamp.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {group.count} message{group.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {conversationGroups.length === 0 && messages.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No messages synced yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Use the device scanner on the Dashboard to start syncing messages
            </p>
          </CardContent>
        </Card>
      )}

      {conversationGroups.length === 0 && messages.length > 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No messages found</h3>
            <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or filter</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Messages;
