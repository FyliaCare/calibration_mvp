import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Calendar,
  User,
  Package,
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { filterCalibrations, getCalibrationStats, type CalibrationRecord } from '@/data/mockCalibrations';

const CalibrationListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<CalibrationRecord['status'] | 'all'>('all');
  const [selectedResult, setSelectedResult] = useState<CalibrationRecord['result'] | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<CalibrationRecord['equipmentCategory'] | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<'all' | 'in-lab' | 'on-site'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get statistics
  const stats = getCalibrationStats();

  // Filter calibrations
  const filteredCals = filterCalibrations(
    searchTerm,
    selectedStatus === 'all' ? undefined : selectedStatus,
    selectedResult === 'all' ? undefined : selectedResult,
    selectedCategory === 'all' ? undefined : selectedCategory
  ).filter((cal) => {
    if (selectedLocation === 'all') return true;
    return cal.location === selectedLocation;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCals = filteredCals.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  const handleFilterChange = (filterFn: () => void) => {
    filterFn();
    setCurrentPage(1);
  };

  // Get status badge
  const getStatusBadge = (status: CalibrationRecord['status']) => {
    switch (status) {
      case 'completed':
        return { variant: 'success' as const, icon: CheckCircle, text: 'Completed' };
      case 'in-progress':
        return { variant: 'info' as const, icon: Clock, text: 'In Progress' };
      case 'pending':
        return { variant: 'warning' as const, icon: AlertTriangle, text: 'Pending' };
      case 'failed':
        return { variant: 'danger' as const, icon: XCircle, text: 'Failed' };
      case 'cancelled':
        return { variant: 'default' as const, icon: XCircle, text: 'Cancelled' };
      default:
        return { variant: 'default' as const, icon: Clock, text: status };
    }
  };

  // Get result badge
  const getResultBadge = (result: CalibrationRecord['result']) => {
    switch (result) {
      case 'pass':
        return { variant: 'success' as const, icon: CheckCircle, text: 'Pass' };
      case 'fail':
        return { variant: 'danger' as const, icon: XCircle, text: 'Fail' };
      case 'conditional':
        return { variant: 'warning' as const, icon: AlertTriangle, text: 'Conditional' };
      case 'pending':
        return { variant: 'default' as const, icon: Clock, text: 'Pending' };
      default:
        return { variant: 'default' as const, icon: Clock, text: result };
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      electrical: 'bg-blue-100 text-blue-700',
      pressure: 'bg-purple-100 text-purple-700',
      temperature: 'bg-red-100 text-red-700',
      mechanical: 'bg-gray-100 text-gray-700',
      dimensional: 'bg-green-100 text-green-700',
      flow: 'bg-cyan-100 text-cyan-700',
      torque: 'bg-orange-100 text-orange-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="h-8 w-8 text-indigo-600" />
                Calibration Records
              </h1>
              <p className="mt-2 text-gray-600">
                View and manage all calibration records, certificates, and results
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => console.log('Export')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => navigate('/dashboard/calibrations/new')}>
                <Plus className="w-4 h-4 mr-2" />
                New Calibration
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{stats.thisMonth}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{stats.certificatesIssued}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by certificate number, equipment, client, or technician..."
                value={searchTerm}
                onChange={(e) => handleFilterChange(() => setSearchTerm(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Filter className="inline h-4 w-4 mr-1" />
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    handleFilterChange(() => setSelectedStatus(e.target.value as CalibrationRecord['status'] | 'all'))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Result Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                <select
                  value={selectedResult}
                  onChange={(e) =>
                    handleFilterChange(() => setSelectedResult(e.target.value as CalibrationRecord['result'] | 'all'))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Results</option>
                  <option value="pass">Pass</option>
                  <option value="fail">Fail</option>
                  <option value="conditional">Conditional</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    handleFilterChange(() => setSelectedCategory(e.target.value as CalibrationRecord['equipmentCategory'] | 'all'))
                  }
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
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) =>
                    handleFilterChange(() => setSelectedLocation(e.target.value as 'all' | 'in-lab' | 'on-site'))
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Locations</option>
                  <option value="in-lab">In-Lab</option>
                  <option value="on-site">On-Site</option>
                </select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(searchTerm || selectedStatus !== 'all' || selectedResult !== 'all' || selectedCategory !== 'all' || selectedLocation !== 'all') && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Active filters:</span>
                {searchTerm && <Badge variant="default">Search: {searchTerm}</Badge>}
                {selectedStatus !== 'all' && <Badge variant="default">Status: {selectedStatus}</Badge>}
                {selectedResult !== 'all' && <Badge variant="default">Result: {selectedResult}</Badge>}
                {selectedCategory !== 'all' && <Badge variant="default">Category: {selectedCategory}</Badge>}
                {selectedLocation !== 'all' && <Badge variant="default">Location: {selectedLocation}</Badge>}
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStatus('all');
                    setSelectedResult('all');
                    setSelectedCategory('all');
                    setSelectedLocation('all');
                    setCurrentPage(1);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </Card>

        {/* Calibration Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Technician
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCals.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-500 font-medium">No calibration records found</p>
                      <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  paginatedCals.map((cal) => {
                    const statusBadge = getStatusBadge(cal.status);
                    const resultBadge = getResultBadge(cal.result);
                    const StatusIcon = statusBadge.icon;
                    const ResultIcon = resultBadge.icon;

                    return (
                      <tr
                        key={cal.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => navigate(`/dashboard/calibrations/${cal.id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{cal.certificateNumber}</div>
                              <div className="text-xs text-gray-500">{cal.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <Package className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{cal.equipmentName}</div>
                              <div className="text-xs text-gray-500">S/N: {cal.equipmentSerialNumber}</div>
                              <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${getCategoryColor(cal.equipmentCategory)}`}>
                                {cal.equipmentCategory}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">{cal.clientName}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">{cal.calibrationDate}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900">{cal.technician}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <div className="text-sm text-gray-900 capitalize">{cal.location.replace('-', ' ')}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={statusBadge.variant} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="h-3 w-3" />
                            {statusBadge.text}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={resultBadge.variant} className="flex items-center gap-1 w-fit">
                            <ResultIcon className="h-3 w-3" />
                            {resultBadge.text}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/calibrations/${cal.id}`);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredCals.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCals.length)} of{' '}
                  {filteredCals.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CalibrationListPage;
