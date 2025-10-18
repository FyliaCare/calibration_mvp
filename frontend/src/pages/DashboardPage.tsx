import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { KPICard } from '@/components/dashboard/KPICard';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { ActionableNotifications } from '@/components/dashboard/ActionableNotifications';
import { BatchOperationsPanel } from '@/components/dashboard/BatchOperationsPanel';
import {
  Package,
  Calendar,
  Plus,
  Search,
  FileText,
  Users,
  Bell,
  Clock,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Download,
  Upload,
  Settings,
  BarChart3,
  Zap,
  Target,
  Activity,
} from 'lucide-react';

// Mock data - Recent calibrations
const recentCalibrations = [
  {
    id: '1',
    equipmentName: 'Digital Multimeter DMM-2500',
    client: 'ABC Manufacturing',
    calibrationDate: '2025-10-17',
    nextDue: '2026-01-17',
    technician: 'John Smith',
    status: 'completed',
    certificateNumber: 'CERT-2025-001',
  },
  {
    id: '2',
    equipmentName: 'Pressure Gauge PG-1000',
    client: 'XYZ Industries',
    calibrationDate: '2025-10-16',
    nextDue: '2025-11-16',
    technician: 'Sarah Johnson',
    status: 'completed',
    certificateNumber: 'CERT-2025-002',
  },
  {
    id: '3',
    equipmentName: 'Temperature Sensor TS-550',
    client: 'Tech Corp',
    calibrationDate: '2025-10-15',
    nextDue: '2026-04-15',
    technician: 'Mike Davis',
    status: 'completed',
    certificateNumber: 'CERT-2025-003',
  },
];

// Mock data - Pending tasks
const pendingTasks = [
  {
    id: '1',
    type: 'calibration',
    title: 'Pressure Gauge PG-1000 Due',
    client: 'ABC Manufacturing',
    dueDate: '2025-10-20',
    priority: 'high',
    assignedTo: 'John Smith',
  },
  {
    id: '2',
    type: 'certificate',
    title: 'Generate Certificate for Flow Meter',
    client: 'XYZ Industries',
    dueDate: '2025-10-19',
    priority: 'high',
    assignedTo: 'Sarah Johnson',
  },
  {
    id: '3',
    type: 'calibration',
    title: 'Temperature Sensor TS-350 Scheduled',
    client: 'Tech Corp',
    dueDate: '2025-10-21',
    priority: 'medium',
    assignedTo: 'Mike Davis',
  },
  {
    id: '4',
    type: 'review',
    title: 'Review Calibration Data - DMM-1500',
    client: 'Global Systems',
    dueDate: '2025-10-22',
    priority: 'low',
    assignedTo: 'Emily Chen',
  },
];

// Quick stats for overview
const quickStats = [
  { label: 'Due Today', value: 3, color: 'red', icon: AlertTriangle },
  { label: 'This Week', value: 15, color: 'yellow', icon: Calendar },
  { label: 'Pending Certificates', value: 7, color: 'blue', icon: FileText },
  { label: 'Active Equipment', value: 248, color: 'green', icon: Package },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showBatchOps, setShowBatchOps] = useState(false);

  // Keyboard shortcut for search (Ctrl+K)
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Mock batch items
  const batchItems = recentCalibrations.map(cal => ({
    id: cal.id,
    type: 'calibration' as const,
    name: cal.equipmentName,
    client: cal.client,
    status: cal.status,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Command Palette */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Top Bar with Search */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex-1 max-w-md flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-left"
            >
              <Search className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">Search equipment, clients, certificates...</span>
              <kbd className="ml-auto px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-xs font-semibold text-gray-600 dark:text-gray-300">
                Ctrl+K
              </kbd>
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBatchOps(!showBatchOps)}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Batch Operations
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="relative px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-1 drop-shadow-lg">Welcome back, Admin!</h1>
                <p className="text-blue-100 text-base">
                  Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6 space-y-6 pb-12">
        {/* Real-Time KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in-from-bottom">
          <KPICard
            title="Avg Turnaround Time"
            value="2.3"
            unit="days"
            trend="down"
            trendValue="15% faster"
            icon={<Zap className="h-5 w-5" />}
            colorScheme="blue"
            target="3"
            status="excellent"
          />
          <KPICard
            title="Lab Utilization"
            value="87"
            unit="%"
            trend="up"
            trendValue="5% vs last week"
            icon={<Activity className="h-5 w-5" />}
            colorScheme="green"
            target="80"
            status="excellent"
          />
          <KPICard
            title="Compliance Rate"
            value="94"
            unit="%"
            trend="up"
            trendValue="2% improvement"
            icon={<Target className="h-5 w-5" />}
            colorScheme="purple"
            target="95"
            status="good"
          />
          <KPICard
            title="Active Work"
            value="23"
            unit="calibrations"
            trend="neutral"
            trendValue="Stable"
            icon={<CheckCircle className="h-5 w-5" />}
            colorScheme="orange"
            status="good"
          />
        </div>

        {/* Batch Operations Panel (Collapsible) */}
        {showBatchOps && (
          <div className="animate-slide-in-from-top">
            <BatchOperationsPanel 
              items={batchItems}
              onClose={() => setShowBatchOps(false)}
            />
          </div>
        )}

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <div
              key={stat.label}
              className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border-l-4 ${
                stat.color === 'red' ? 'border-red-500' :
                stat.color === 'yellow' ? 'border-yellow-500' :
                stat.color === 'blue' ? 'border-blue-500' :
                'border-green-500'
              } hover:shadow-xl transition-all duration-300 animate-in slide-in-from-bottom delay-${index + 1}00`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${
                  stat.color === 'red' ? 'bg-red-100 text-red-600' :
                  stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
                <Plus className="h-5 w-5 text-white" />
              </div>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                className="h-auto py-4 flex-col gap-2 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                onClick={() => navigate('/dashboard/calibrations/new')}
              >
                <Plus className="h-6 w-6" />
                <span className="text-sm font-semibold">New Calibration</span>
              </Button>
              <Button 
                className="h-auto py-4 flex-col gap-2 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                onClick={() => navigate('/dashboard/worksheets/new')}
              >
                <FileText className="h-6 w-6" />
                <span className="text-sm font-semibold">Create Worksheet</span>
              </Button>
              <Button className="h-auto py-4 flex-col gap-2 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                <Package className="h-6 w-6" />
                <span className="text-sm font-semibold">Add Equipment</span>
              </Button>
              <Button className="h-auto py-4 flex-col gap-2 bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                <Users className="h-6 w-6" />
                <span className="text-sm font-semibold">New Client</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Pending Tasks (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Urgent Alerts */}
            <Alert variant="danger" className="border-l-4 border-red-500 shadow-lg">
              <AlertTitle className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Urgent: 3 Calibrations Overdue
              </AlertTitle>
              <AlertDescription className="mt-2">
                <Button variant="outline" size="sm" className="mt-2">
                  View Overdue Items →
                </Button>
              </AlertDescription>
            </Alert>

            {/* Pending Tasks */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    Pending Tasks
                  </h2>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-xl border-2 border-border hover:border-primary hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant={
                              task.priority === 'high' ? 'danger' :
                              task.priority === 'medium' ? 'warning' : 'success'
                            }>
                              {task.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {task.type === 'calibration' ? <Wrench className="h-3 w-3 mr-1" /> :
                               task.type === 'certificate' ? <FileText className="h-3 w-3 mr-1" /> :
                               <CheckCircle className="h-3 w-3 mr-1" />}
                              {task.type}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-base mb-1">{task.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Client: <span className="font-semibold text-foreground">{task.client}</span>
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {task.dueDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {task.assignedTo}
                            </span>
                          </div>
                        </div>
                        <Button size="sm" className="ml-4">
                          Start →
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Recent Calibrations */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    Recent Calibrations
                  </h2>
                  <Button variant="outline" size="sm">
                    View History →
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                      <tr>
                        <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider">Equipment</th>
                        <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider">Client</th>
                        <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider">Date</th>
                        <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider">Technician</th>
                        <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider">Certificate</th>
                        <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentCalibrations.map((cal) => (
                        <tr key={cal.id} className="border-b border-border hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors">
                          <td className="py-3 px-4 font-semibold">{cal.equipmentName}</td>
                          <td className="py-3 px-4 text-sm">{cal.client}</td>
                          <td className="py-3 px-4 text-sm">{cal.calibrationDate}</td>
                          <td className="py-3 px-4 text-sm">{cal.technician}</td>
                          <td className="py-3 px-4">
                            <Badge variant="success" className="font-mono text-xs">
                              {cal.certificateNumber}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Sidebar (1/3 width) */}
          <div className="space-y-6">
            {/* Calendar Widget */}
            <div className="animate-slide-in-from-right delay-100">
              <CalendarWidget />
            </div>

            {/* Today's Schedule */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Today's Schedule
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="text-sm font-semibold">09:00 AM</span>
                    </div>
                    <p className="text-sm ml-4">Calibrate Pressure Gauge</p>
                    <p className="text-xs text-muted-foreground ml-4">ABC Manufacturing</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                      <span className="text-sm font-semibold">02:00 PM</span>
                    </div>
                    <p className="text-sm ml-4">Temperature Sensor Check</p>
                    <p className="text-xs text-muted-foreground ml-4">Tech Corp</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-purple-600 rounded-full" />
                      <span className="text-sm font-semibold">04:30 PM</span>
                    </div>
                    <p className="text-sm ml-4">Client Meeting - XYZ</p>
                    <p className="text-xs text-muted-foreground ml-4">Review quarterly plan</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notifications */}
            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-0 shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-orange-600" />
                  Notifications
                </h3>
                <ActionableNotifications />
              </div>
            </Card>

            {/* Quick Links */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-0 shadow-xl">
              <div className="p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Equipment Data
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Reports
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Certificate Templates
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    System Settings
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
