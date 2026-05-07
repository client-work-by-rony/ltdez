import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import noorLogo from '@/assets/ltdez-logo.png';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  MessageSquare,
  BarChart3,
  LogOut,
  Home,
  CreditCard,
  Play,
  Image,
  ImageIcon,
  Database,
  Star,
} from 'lucide-react';

const menuItems = [
  { title: 'ড্যাশবোর্ড', url: '/admin', icon: LayoutDashboard },
  { title: 'কোর্স ম্যানেজমেন্ট', url: '/admin/courses', icon: GraduationCap },
  { title: 'ইউজার ম্যানেজমেন্ট', url: '/admin/users', icon: Users },
  { title: 'পেমেন্ট', url: '/admin/payments', icon: CreditCard },
  { title: 'রিভিউ ম্যানেজমেন্ট', url: '/admin/reviews', icon: Star },
  { title: 'এনরোলমেন্ট', url: '/admin/enrollments', icon: GraduationCap },
  { title: 'ভিডিও ট্র্যাকিং', url: '/admin/video-tracking', icon: Play },
  { title: 'হিরো স্লাইড', url: '/admin/hero-slides', icon: Image },
  { title: 'ইমেজ ম্যানেজার', url: '/admin/images', icon: ImageIcon },
  { title: 'সাইট ডেটা', url: '/admin/site-data', icon: Database },
  { title: 'মেসেজ', url: '/admin/messages', icon: MessageSquare },
  { title: 'অ্যানালিটিক্স', url: '/admin/analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <img src={noorLogo} alt="LTDEZ" className="h-8 w-auto" />
          <div>
            <h2 className="text-sm font-bold text-primary leading-tight">LTDEZ</h2>
            <p className="text-[10px] text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>মেনু</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4 space-y-2">
        <p className="text-xs text-muted-foreground truncate">
          {user?.email}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link to="/">
              <Home className="h-4 w-4 mr-1" />
              হোম
            </Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={signOut} className="flex-1">
            <LogOut className="h-4 w-4 mr-1" />
            লগআউট
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
