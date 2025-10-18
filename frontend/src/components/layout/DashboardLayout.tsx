import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { LogOut, User, Settings, LayoutDashboard, Wrench, Users, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function DashboardLayout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">CalPro</h1>
            <span className="text-sm text-muted-foreground">Calibration Management System</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div className="text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-1">
            <NavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" />
            <NavLink to="/dashboard/equipment" icon={<Wrench className="h-5 w-5" />} label="Equipment" />
            <NavLink to="/dashboard/clients" icon={<Users className="h-5 w-5" />} label="Clients" />
            <NavLink to="/dashboard/calibrations" icon={<Calendar className="h-5 w-5" />} label="Calibrations" />
            <NavLink to="/dashboard/reports" icon={<FileText className="h-5 w-5" />} label="Reports" />
            
            {user.role === 'ADMIN' && (
              <>
                <div className="pt-4 pb-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase px-3">Admin</p>
                </div>
                <NavLink to="/dashboard/users" icon={<User className="h-5 w-5" />} label="Users" />
                <NavLink to="/dashboard/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  const navigate = useNavigate();
  const isActive = window.location.pathname === to;

  return (
    <button
      onClick={() => navigate(to)}
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
