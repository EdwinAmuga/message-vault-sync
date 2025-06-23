
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Messages = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const messages = [
    {
      id: 1,
      contact: "John Doe",
      platform: "SMS",
      preview: "Hey, are we still meeting for lunch today?",
      timestamp: "2024-01-15 14:30",
      count: 15,
    },
    {
      id: 2,
      contact: "Sarah Wilson",
      platform: "WhatsApp",
      preview: "Thanks for the presentation slides!",
      timestamp: "2024-01-15 13:45",
      count: 8,
    },
    {
      id: 3,
      contact: "Mike Johnson",
      platform: "SMS",
      preview: "Don't forget to pick up the documents...",
      timestamp: "2024-01-15 12:20",
      count: 3,
    },
    {
      id: 4,
      contact: "Team Group",
      platform: "WhatsApp",
      preview: "Meeting rescheduled to 3 PM",
      timestamp: "2024-01-15 11:15",
      count: 42,
    },
  ];

  const filteredMessages = messages.filter(message =>
    message.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">View and manage your backed up messages</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {message.platform === "SMS" ? (
                      <Phone className="w-5 h-5 text-green-600" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                    )}
                    <Badge 
                      variant={message.platform === "SMS" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {message.platform}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{message.contact}</h3>
                    <p className="text-sm text-gray-600 truncate max-w-md">
                      {message.preview}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{message.timestamp}</p>
                    <p className="text-xs text-gray-400">{message.count} messages</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Messages;
