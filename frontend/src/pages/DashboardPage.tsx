import { Alert, AlertTitle, AlertDescription } from '@/components/ui/Alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { StatCard } from '@/components/dashboard/StatCard';
import { CalibrationChart } from '@/components/dashboard/CalibrationChart';
import { EquipmentStatusTable } from '@/components/dashboard/EquipmentStatusTable';
import { UpcomingCalibrations } from '@/components/dashboard/UpcomingCalibrations';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import {
  Package,
  Calendar,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

// Mock data for demonstration
const mockCalibrationTrend = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 48 },
  { name: 'Apr', value: 61 },
  { name: 'May', value: 55 },
  { name: 'Jun', value: 67 },
];

const mockEquipmentByStatus = [
  { name: 'Operational', value: 185 },
  { name: 'Due Soon', value: 42 },
  { name: 'Overdue', value: 8 },
  { name: 'Maintenance', value: 13 },
];

const mockMonthlyCalibrations = [
  { name: 'Week 1', value: 18 },
  { name: 'Week 2', value: 22 },
  { name: 'Week 3', value: 15 },
  { name: 'Week 4', value: 12 },
];

const mockComplianceData = [
  { name: 'Jan', value: 94 },
  { name: 'Feb', value: 95 },
  { name: 'Mar', value: 96 },
  { name: 'Apr', value: 97 },
  { name: 'May', value: 98 },
  { name: 'Jun', value: 98.5 },
];

const mockEquipment = [
  {
    id: '1',
    name: 'Digital Multimeter DMM-2500',
    serialNumber: 'DMM-2500-001',
    status: 'operational' as const,
    nextCalibration: 'Jul 15, 2025',
    daysUntilDue: 45,
    compliance: 100,
  },
  {
    id: '2',
    name: 'Pressure Gauge PG-1000',
    serialNumber: 'PG-1000-042',
    status: 'due' as const,
    nextCalibration: 'Jun 08, 2025',
    daysUntilDue: 6,
    compliance: 95,
  },
  {
    id: '3',
    name: 'Temperature Sensor TS-550',
    serialNumber: 'TS-550-128',
    status: 'overdue' as const,
    nextCalibration: 'May 28, 2025',
    daysUntilDue: -5,
    compliance: 78,
  },
  {
    id: '4',
    name: 'Flow Meter FM-800',
    serialNumber: 'FM-800-035',
    status: 'maintenance' as const,
    nextCalibration: 'Jun 20, 2025',
    daysUntilDue: 18,
    compliance: 88,
  },
  {
    id: '5',
    name: 'Oscilloscope OSC-3000',
    serialNumber: 'OSC-3000-007',
    status: 'operational' as const,
    nextCalibration: 'Aug 05, 2025',
    daysUntilDue: 63,
    compliance: 100,
  },
];

const mockUpcomingCalibrations = [
  {
    id: '1',
    equipmentName: 'Pressure Gauge PG-1000',
    date: 'Jun 08, 2025',
    time: '09:00 AM',
    location: 'Lab A - Bay 3',
    technician: 'John Smith',
    priority: 'high' as const,
  },
  {
    id: '2',
    equipmentName: 'Digital Multimeter DMM-1500',
    date: 'Jun 09, 2025',
    time: '02:00 PM',
    location: 'Lab B - Bay 1',
    technician: 'Sarah Johnson',
    priority: 'medium' as const,
  },
  {
    id: '3',
    equipmentName: 'Temperature Sensor TS-350',
    date: 'Jun 10, 2025',
    time: '11:00 AM',
    location: 'Lab A - Bay 2',
    technician: 'Mike Davis',
    priority: 'low' as const,
  },
];

const mockActivities = [
  {
    id: '1',
    type: 'calibration' as const,
    title: 'Calibration Completed',
    description: 'Digital Multimeter DMM-2500 successfully calibrated',
    timestamp: '2 hours ago',
    user: 'John Smith',
  },
  {
    id: '2',
    type: 'alert' as const,
    title: 'Calibration Overdue',
    description: 'Temperature Sensor TS-550 is 5 days overdue',
    timestamp: '4 hours ago',
    user: 'System',
  },
  {
    id: '3',
    type: 'maintenance' as const,
    title: 'Maintenance Scheduled',
    description: 'Flow Meter FM-800 scheduled for maintenance',
    timestamp: '6 hours ago',
    user: 'Sarah Johnson',
  },
  {
    id: '4',
    type: 'report' as const,
    title: 'Monthly Report Generated',
    description: 'Calibration compliance report for May 2025',
    timestamp: '1 day ago',
    user: 'System',
  },
  {
    id: '5',
    type: 'user' as const,
    title: 'New User Added',
    description: 'Emily Chen added as Technician',
    timestamp: '2 days ago',
    user: 'Admin',
  },
];

export function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your calibration overview for today.
        </p>
      </div>

      {/* Alert Banner */}
      <Alert variant="warning" dismissible>
        <AlertTitle>3 Calibrations Overdue</AlertTitle>
        <AlertDescription>
          You have equipment that requires immediate attention. Click here to view details.
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Equipment"
          value="248"
          icon={Package}
          trend={{ value: 12, isPositive: true }}
          description="Active instruments"
          variant="default"
        />
        <StatCard
          title="Due This Week"
          value="15"
          icon={Calendar}
          trend={{ value: 8, isPositive: false }}
          description="3 critical items"
          variant="warning"
        />
        <StatCard
          title="Completed Today"
          value="7"
          icon={CheckCircle}
          description="On schedule"
          variant="success"
        />
        <StatCard
          title="Compliance Rate"
          value="98.5%"
          icon={TrendingUp}
          trend={{ value: 2.1, isPositive: true }}
          description="Above target"
          variant="info"
        />
      </div>

      {/* Charts Section with Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            <CalibrationChart
              type="bar"
              data={mockMonthlyCalibrations}
              title="Calibrations This Month"
              description="Weekly breakdown of completed calibrations"
              dataKey="value"
              xAxisKey="name"
            />
            <CalibrationChart
              type="pie"
              data={mockEquipmentByStatus}
              title="Equipment Status Distribution"
              description="Current status of all registered equipment"
              dataKey="value"
              xAxisKey="name"
            />
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 gap-6 mt-4">
            <CalibrationChart
              type="area"
              data={mockCalibrationTrend}
              title="Calibration Trend (6 Months)"
              description="Monthly calibration activity over the past 6 months"
              dataKey="value"
              xAxisKey="name"
            />
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="grid grid-cols-1 gap-6 mt-4">
            <CalibrationChart
              type="line"
              data={mockComplianceData}
              title="Compliance Rate History"
              description="Monthly compliance percentage tracking"
              dataKey="value"
              xAxisKey="name"
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Equipment Status Table */}
      <EquipmentStatusTable equipment={mockEquipment} />

      {/* Bottom Section - Upcoming & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingCalibrations calibrations={mockUpcomingCalibrations} />
        <ActivityFeed activities={mockActivities} />
      </div>
    </div>
  );
}
