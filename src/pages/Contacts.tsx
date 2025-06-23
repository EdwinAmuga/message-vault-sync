
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Users, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";

const Contacts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const contacts = [
    {
      id: 1,
      name: "John Doe",
      phone: "+1 (555) 123-4567",
      smsEnabled: true,
      whatsappEnabled: true,
      messageCount: 156,
      lastSync: "2024-01-15 14:30",
    },
    {
      id: 2,
      name: "Sarah Wilson",
      phone: "+1 (555) 234-5678",
      smsEnabled: false,
      whatsappEnabled: true,
      messageCount: 89,
      lastSync: "2024-01-15 13:45",
    },
    {
      id: 3,
      name: "Mike Johnson",
      phone: "+1 (555) 345-6789",
      smsEnabled: true,
      whatsappEnabled: false,
      messageCount: 234,
      lastSync: "2024-01-15 12:20",
    },
    {
      id: 4,
      name: "Emily Davis",
      phone: "+1 (555) 456-7890",
      smsEnabled: true,
      whatsappEnabled: true,
      messageCount: 67,
      lastSync: "2024-01-15 11:15",
    },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const toggleSync = (contactId: number, platform: 'sms' | 'whatsapp') => {
    console.log(`Toggling ${platform} sync for contact ${contactId}`);
    // This would typically update the contact's sync settings
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
        <p className="text-gray-600 mt-2">Manage message sync settings for your contacts</p>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{contact.messageCount} messages</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">Last sync: {contact.lastSync}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">SMS</span>
                      <Switch
                        checked={contact.smsEnabled}
                        onCheckedChange={() => toggleSync(contact.id, 'sms')}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-700">WhatsApp</span>
                      <Switch
                        checked={contact.whatsappEnabled}
                        onCheckedChange={() => toggleSync(contact.id, 'whatsapp')}
                      />
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    View Messages
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Contacts;
