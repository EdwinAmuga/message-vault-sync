
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
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center relative">
            {/* Cloud with envelope and arrows */}
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              {/* Cloud shape */}
              <path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
              {/* Envelope inside cloud */}
              <rect x="8" y="9" width="8" height="5" rx="0.5" fill="rgba(255,255,255,0.3)" stroke="white" strokeWidth="0.4"/>
              <path d="M8 9.5l4 2.5 4-2.5" stroke="white" strokeWidth="0.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Up arrow */}
              <path d="M11 7l1-1 1 1" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
              {/* Down arrow */}
              <path d="M11 17l1 1 1-1" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
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
      </div>
    </header>
  );
}
