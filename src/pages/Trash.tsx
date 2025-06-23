
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, Phone, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";

const Trash = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const trashedMessages = [
    {
      id: 1,
      contact: "Unknown Number",
      platform: "SMS",
      preview: "Spam message about special offers...",
      deletedAt: "2024-01-14 16:20",
      count: 1,
    },
    {
      id: 2,
      contact: "Old Group Chat",
      platform: "WhatsApp",
      preview: "This group is no longer active",
      deletedAt: "2024-01-13 09:15",
      count: 127,
    },
    {
      id: 3,
      contact: "Marketing Bot",
      platform: "SMS",
      preview: "Click here to claim your prize!",
      deletedAt: "2024-01-12 14:30",
      count: 5,
    },
  ];

  const filteredMessages = trashedMessages.filter(message =>
    message.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRestore = (messageId: number) => {
    console.log(`Restoring message ${messageId}`);
    // This would typically restore the message from trash
  };

  const handlePermanentDelete = (messageId: number) => {
    console.log(`Permanently deleting message ${messageId}`);
    // This would typically permanently delete the message
  };

  const handleEmptyTrash = () => {
    console.log("Emptying trash");
    // This would typically delete all messages in trash
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trash</h1>
          <p className="text-gray-600 mt-2">
            Messages in trash will be permanently deleted after 30 days
          </p>
        </div>
        <Button variant="destructive" onClick={handleEmptyTrash}>
          <Trash2 className="w-4 h-4 mr-2" />
          Empty Trash
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search deleted messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="hover:shadow-md transition-shadow opacity-75">
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
                    <p className="text-sm text-gray-500">Deleted: {message.deletedAt}</p>
                    <p className="text-xs text-gray-400">{message.count} messages</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRestore(message.id)}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handlePermanentDelete(message.id)}
                    >
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
            <Trash2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Trash is empty</h3>
            <p className="text-gray-600">No deleted messages found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Trash;
