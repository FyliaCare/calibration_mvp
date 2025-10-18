import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Building2,
  Users,
  Award,
  AlertTriangle,
  Filter,
  Printer,
  Mail,
  Settings,
  PieChart,
  Activity,
  DollarSign,
  Target,
} from 'lucide-react';
import { getCalibrationStats } from '@/data/mockCalibrations';
import { mockEquipment, getEquipmentStats } from '@/data/mockEquipment';
import { mockClients, getClientStats } from '@/data/mockClients';

const ReportsPage = () => {
  const [reportType, setReportType] = useState<'overview' | 'calibration' | 'equipment' | 'client' | 'financial'>('overview');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');

  // Get statistics
  const calStats = getCalibrationStats();
  const equipStats = getEquipmentStats(mockEquipment);
  const clientStats = getClientStats(mockClients);

  // Calculate additional metrics
  const passRate = calStats.total > 0 ? ((calStats.passed / calStats.total) * 100).toFixed(1) : '0';
  const completionRate = calStats.total > 0 ? ((calStats.completed / calStats.total) * 100).toFixed(1) : '0';
  const avgCalibrationTime = '2.3'; // Mock - would come from backend
  const totalRevenue = clientStats.totalRevenue || 627500;
  const avgRevenuePerClient = clientStats.total > 0 ? Math.round(totalRevenue / clientStats.total) : 0;

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting ${reportType} report as ${format}`);
    alert(`Exporting ${reportType} report as ${format.toUpperCase()}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    alert('Email report functionality coming soon');
  };

  const handleSchedule = () => {
    alert('Schedule automated reports functionality coming soon');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-indigo-600" />
                Reports & Analytics
              </h1>
              <p className="mt-2 text-gray-600">
                Comprehensive reports and insights for calibration operations
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={handleEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button onClick={() => handleExport('pdf')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Report Type Selector & Filters */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            {/* Report Type Tabs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={reportType === 'overview' ? 'default' : 'outline'}
                  onClick={() => setReportType('overview')}
                  className="flex-1 min-w-[120px]"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Overview
                </Button>
                <Button
                  variant={reportType === 'calibration' ? 'default' : 'outline'}
                  onClick={() => setReportType('calibration')}
                  className="flex-1 min-w-[120px]"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Calibration
                </Button>
                <Button
                  variant={reportType === 'equipment' ? 'default' : 'outline'}
                  onClick={() => setReportType('equipment')}
                  className="flex-1 min-w-[120px]"
                >
                  <Package className="w-4 h-4 mr-2" />
                  Equipment
                </Button>
                <Button
                  variant={reportType === 'client' ? 'default' : 'outline'}
                  onClick={() => setReportType('client')}
                  className="flex-1 min-w-[120px]"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  Client
                </Button>
                <Button
                  variant={reportType === 'financial' ? 'default' : 'outline'}
                  onClick={() => setReportType('financial')}
                  className="flex-1 min-w-[120px]"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Financial
                </Button>
              </div>
            </div>

            {/* Date Range & Category Filters */}
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Filter className="inline h-4 w-4 mr-1" />
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="electrical">Electrical</option>
                  <option value="pressure">Pressure</option>
                  <option value="temperature">Temperature</option>
                  <option value="mechanical">Mechanical</option>
                  <option value="dimensional">Dimensional</option>
                  <option value="flow">Flow</option>
                  <option value="torque">Torque</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={handleSchedule}>
                  <Settings className="w-4 h-4 mr-2" />
                  Schedule Report
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Overview Report */}
        {reportType === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Calibrations</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{calStats.total}</p>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+12% vs last month</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pass Rate</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{passRate}%</p>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+3% vs last month</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Equipment</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{equipStats.active}</p>
                    <div className="flex items-center mt-2 text-sm text-blue-600">
                      <Target className="h-4 w-4 mr-1" />
                      <span>{equipStats.calibrationDue} due soon</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Clients</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{clientStats.active}</p>
                    <div className="flex items-center mt-2 text-sm text-purple-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{clientStats.total} total</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calibration Status Distribution */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-indigo-600" />
                  Calibration Status Distribution
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm text-gray-700">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{calStats.completed}</span>
                      <span className="text-xs text-gray-500">({completionRate}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${completionRate}%` }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm text-gray-700">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{calStats.inProgress}</span>
                      <span className="text-xs text-gray-500">({((calStats.inProgress / calStats.total) * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(calStats.inProgress / calStats.total) * 100}%` }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                      <span className="text-sm text-gray-700">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{calStats.pending}</span>
                      <span className="text-xs text-gray-500">({((calStats.pending / calStats.total) * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(calStats.pending / calStats.total) * 100}%` }}></div>
                  </div>
                </div>
              </Card>

              {/* Equipment by Category */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  Equipment by Category
                </h3>
                <div className="space-y-3">
                  {Object.entries(equipStats.byCategory).map(([category, count]) => (
                    <div key={category} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 capitalize">{category}</span>
                        <span className="font-semibold text-gray-900">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{ width: `${(count / equipStats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Average Calibration Time</p>
                  <p className="text-3xl font-bold text-indigo-600">{avgCalibrationTime} hrs</p>
                  <p className="text-xs text-gray-500 mt-1">Per equipment unit</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">On-Time Completion</p>
                  <p className="text-3xl font-bold text-green-600">94%</p>
                  <p className="text-xs text-gray-500 mt-1">Within scheduled date</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Customer Satisfaction</p>
                  <p className="text-3xl font-bold text-purple-600">4.8/5</p>
                  <p className="text-xs text-gray-500 mt-1">Based on feedback</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Calibration Report */}
        {reportType === 'calibration' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Calibrations</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{calStats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-indigo-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Passed</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{calStats.passed}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Failed</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">{calStats.failed}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conditional</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{calStats.conditional}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              </Card>
            </div>

            {/* Calibration by Category */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Calibrations by Equipment Category</h3>
              <div className="space-y-3">
                {Object.entries(calStats.byCategory).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                        <span className="text-sm font-semibold text-gray-900">{count} calibrations</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-indigo-600 h-3 rounded-full"
                          style={{ width: `${(count / calStats.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Location Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Calibration Location</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">In-Lab</span>
                      <span className="text-sm font-semibold text-gray-900">{calStats.byLocation['in-lab']}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full"
                        style={{ width: `${(calStats.byLocation['in-lab'] / calStats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">On-Site</span>
                      <span className="text-sm font-semibold text-gray-900">{calStats.byLocation['on-site']}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{ width: `${(calStats.byLocation['on-site'] / calStats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Certificate Status</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Certificates Issued</span>
                      <span className="text-sm font-semibold text-green-900">{calStats.certificatesIssued}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{ width: `${(calStats.certificatesIssued / calStats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Pending Certificates</span>
                      <span className="text-sm font-semibold text-yellow-900">{calStats.total - calStats.certificatesIssued}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-yellow-600 h-3 rounded-full"
                        style={{ width: `${((calStats.total - calStats.certificatesIssued) / calStats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Equipment Report */}
        {reportType === 'equipment' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Equipment</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{equipStats.total}</p>
                  </div>
                  <Package className="h-8 w-8 text-indigo-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{equipStats.active}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Calibration Due</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">{equipStats.calibrationDue}</p>
                  </div>
                  <Clock className="h-8 w-8 text-red-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Maintenance</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{equipStats.maintenance}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-600" />
                </div>
              </Card>
            </div>

            {/* Equipment by Category */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Equipment Distribution by Category</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(equipStats.byCategory).map(([category, count]) => (
                  <div key={category} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                      <Badge variant="default">{count}</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(count / equipStats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Equipment Status Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Equipment Status Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-900">{equipStats.active}</p>
                      <p className="text-sm text-green-700">Active Equipment</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-2 border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-10 w-10 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold text-red-900">{equipStats.calibrationDue}</p>
                      <p className="text-sm text-red-700">Calibration Due</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-2 border-gray-200 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <XCircle className="h-10 w-10 text-gray-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{equipStats.retired}</p>
                      <p className="text-sm text-gray-700">Retired Equipment</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Client Report */}
        {reportType === 'client' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{clientStats.total}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-indigo-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Clients</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">{clientStats.active}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">{clientStats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Inactive</p>
                    <p className="text-2xl font-bold text-gray-600 mt-1">{clientStats.inactive}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-gray-600" />
                </div>
              </Card>
            </div>

            {/* Client by Account Type */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Clients by Account Type</h3>
              <div className="space-y-4">
                {Object.entries(clientStats.byAccountType).map(([type, count]) => (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                      <span className="text-sm font-semibold text-gray-900">{count} clients</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          type === 'enterprise' ? 'bg-purple-600' :
                          type === 'premium' ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                        style={{ width: `${(count / clientStats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Client Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Total Jobs</h3>
                <div className="text-center py-6">
                  <p className="text-5xl font-bold text-indigo-600">{clientStats.totalJobs}</p>
                  <p className="text-sm text-gray-600 mt-2">Across all clients</p>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Active Jobs</h3>
                <div className="text-center py-6">
                  <p className="text-5xl font-bold text-green-600">{clientStats.activeJobs}</p>
                  <p className="text-sm text-gray-600 mt-2">Currently in progress</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Financial Report */}
        {reportType === 'financial' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      ${totalRevenue.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>+15% vs last month</span>
                    </div>
                  </div>
                  <DollarSign className="h-10 w-10 text-green-600" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Revenue/Client</p>
                    <p className="text-2xl font-bold text-indigo-600 mt-1">
                      ${avgRevenuePerClient.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Per active client</p>
                  </div>
                  <Building2 className="h-10 w-10 text-indigo-600" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                    <p className="text-2xl font-bold text-purple-600 mt-1">+15%</p>
                    <div className="flex items-center mt-2 text-sm text-purple-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>Consistent growth</span>
                    </div>
                  </div>
                  <TrendingUp className="h-10 w-10 text-purple-600" />
                </div>
              </Card>
            </div>

            {/* Revenue Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Revenue by Account Type</h3>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-purple-900">Enterprise</span>
                    <span className="font-bold text-purple-900">$340,000</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-3">
                    <div className="bg-purple-600 h-3 rounded-full" style={{ width: '54%' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">Premium</span>
                    <span className="font-bold text-blue-900">$220,000</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Standard</span>
                    <span className="font-bold text-gray-900">$67,500</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-gray-600 h-3 rounded-full" style={{ width: '11%' }}></div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Financial Summary */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Financial Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Calibration Services</span>
                    <span className="font-semibold">$500,000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Equipment Rental</span>
                    <span className="font-semibold">$75,000</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Consulting Services</span>
                    <span className="font-semibold">$52,500</span>
                  </div>
                  <div className="flex justify-between py-3 border-t-2 font-bold">
                    <span>Total Revenue</span>
                    <span className="text-green-600">${totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <Award className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-green-900">{clientStats.total}</p>
                    <p className="text-sm text-green-700 mt-1">Paying Clients</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Export Options */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Export Options</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => handleExport('pdf')}>
              <FileText className="w-4 h-4 mr-2" />
              Export as PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <Download className="w-4 h-4 mr-2" />
              Export as Excel
            </Button>
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <Download className="w-4 h-4 mr-2" />
              Export as CSV
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
            <Button variant="outline" onClick={handleEmail}>
              <Mail className="w-4 h-4 mr-2" />
              Email Report
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
