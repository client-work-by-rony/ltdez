import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Loader2, BookOpen, Download, Users, Home, FileText, User } from 'lucide-react';
import Header from '@/components/Header';

export function UserDashboardLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'ড্যাশবোর্ড' },
    { path: '/dashboard/courses', icon: BookOpen, label: 'কোর্স মডিউল' },
    { path: '/dashboard/assignments', icon: FileText, label: 'অ্যাসাইনমেন্ট' },
    { path: '/dashboard/resources', icon: Download, label: 'রিসোর্স' },
    { path: '/dashboard/community', icon: Users, label: 'কমিউনিটি' },
    { path: '/dashboard/profile', icon: User, label: 'প্রোফাইল' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-6 pt-24">
        {/* Navigation - scrollable horizontally */}
        <nav className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide touch-pan-x" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? 'default' : 'outline'}
                size="sm"
                className="whitespace-nowrap"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
