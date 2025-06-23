
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 17h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2zm0-9h18v7H3V8zm2 3h2v1H5v-1zm3 0h8v1H8v-1z"/>
              <path d="M12 3l-2 2h4l-2-2z"/>
              <path d="M12 19l-2-2h4l2 2z"/>
            </svg>
          </div>
          <span className="font-semibold text-lg text-gray-900">MsgSync</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 flex-1 max-w-md mx-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Upload Messages
        </Button>
        <Button size="sm">
          Add Message
        </Button>
      </div>
    </header>
  );
}
