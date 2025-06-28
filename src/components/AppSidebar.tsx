
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  MessageSquare,
  Users,
  Upload,
  Trash2,
  Settings,
  Plus,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Contacts", url: "/contacts", icon: Users },
  { title: "Add Message", url: "/compose", icon: Plus },
  { title: "Upload Messages", url: "/upload", icon: Upload },
  { title: "Trash", url: "/trash", icon: Trash2 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-700" 
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  const isCollapsed = state === "collapsed";

  const getFirstName = () => {
    if (user?.name) {
      return user.name.split(' ')[0];
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getInitials = () => {
    const firstName = getFirstName();
    return firstName.charAt(0).toUpperCase();
  };

  return (
    <Sidebar className={isCollapsed ? "w-12" : "w-32 sm:w-36 md:w-40"}>
      <SidebarContent className="bg-white/80 backdrop-blur-sm border-r border-gray-200/50">
        <SidebarHeader className="p-2 border-b border-gray-200/50">
          <div className="flex flex-col items-center gap-1">
            <Avatar className="w-8 h-8">
              <AvatarImage src="" alt={getFirstName()} />
              <AvatarFallback className="bg-blue-500 text-white text-xs font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <span className="text-xs font-semibold text-gray-900 text-center truncate w-full drop-shadow-sm">{getFirstName()}</span>
            )}
          </div>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-gray-600 uppercase tracking-wide px-1 drop-shadow-sm">
            {!isCollapsed && "Nav"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"} 
                      className={({ isActive }) => 
                        isActive 
                          ? "bg-blue-100/90 text-blue-800 font-semibold border-r-2 border-blue-700 drop-shadow-sm" 
                          : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900 font-medium drop-shadow-sm"
                      }
                    >
                      <item.icon className="w-4 h-4 min-w-4" />
                      <span className="text-xs truncate font-semibold">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
