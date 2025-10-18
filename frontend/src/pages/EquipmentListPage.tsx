import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Plus,
  Search,
  Download,
  Upload,
  Package,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Wrench,
  XCircle,
  Archive,
} from 'lucide-react';
import { mockEquipment, filterEquipment, getEquipmentStats, type Equipment } from '@/data/mockEquipment';

const EquipmentListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter equipment
  const filteredEquipment = filterEquipment(mockEquipment, {
    search: searchTerm,
    category: selectedCategory,
    status: selectedStatus,
  });

  // Pagination
  const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEquipment = filteredEquipment.slice(startIndex, endIndex);

  // Stats
  const stats = getEquipmentStats(mockEquipment);

  // Get status badge color and icon
  const getStatusBadge = (status: Equipment['status']) => {
    switch (status) {
      case 'active':
        return { variant: 'success' as const, icon: CheckCircle, text: 'Active' };
      case 'calibration-due':
        return { variant: 'warning' as const, icon: AlertCircle, text: 'Cal Due' };
      case 'maintenance':
        return { variant: 'info' as const, icon: Wrench, text: 'Maintenance' };
      case 'retired':
        return { variant: 'default' as const, icon: Archive, text: 'Retired' };
      case 'inactive':
        return { variant: 'danger' as const, icon: XCircle, text: 'Inactive' };
      default:
        return { variant: 'default' as const, icon: Package, text: status };
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      electrical: 'bg-yellow-100 text-yellow-700',
      pressure: 'bg-blue-100 text-blue-700',
      temperature: 'bg-red-100 text-red-700',
      mechanical: 'bg-gray-100 text-gray-700',
      dimensional: 'bg-purple-100 text-purple-700',
      flow: 'bg-cyan-100 text-cyan-700',
      torque: 'bg-orange-100 text-orange-700',
      other: 'bg-green-100 text-green-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // Handle actions
  const handleView = (id: string) => {
    navigate(`/dashboard/equipment/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/equipment/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      console.log('Delete equipment:', id);
      // TODO: Implement delete functionality
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Equipment Management</h1>
              <p className="mt-2 text-gray-600">
                Manage and track all calibration equipment
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => console.log('Import')}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" onClick={() => console.log('Export')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => navigate('/dashboard/equipment/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Equipment</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Cal Due</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.calibrationDue}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Maintenance</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.maintenance}</p>
                  </div>
                  <Wrench className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Retired</p>
                    <p className="text-2xl font-bold text-gray-600">{stats.retired}</p>
                  </div>
                  <Archive className="h-8 w-8 text-gray-500" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-white">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search equipment..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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

                {/* Status Filter */}
                <div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="calibration-due">Calibration Due</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="inactive">Inactive</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Equipment Table */}
        <Card className="bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Calibration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEquipment.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-500">No equipment found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your filters or add new equipment
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedEquipment.map((equipment) => {
                    const statusBadge = getStatusBadge(equipment.status);
                    const StatusIcon = statusBadge.icon;

                    return (
                      <tr
                        key={equipment.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleView(equipment.id)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{equipment.name}</div>
                            <div className="text-sm text-gray-500">
                              {equipment.manufacturer} {equipment.model}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                              equipment.category
                            )}`}
                          >
                            {equipment.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{equipment.serialNumber}</div>
                          <div className="text-xs text-gray-500">{equipment.assetNumber}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            {equipment.location}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            {equipment.nextCalibrationDate}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={statusBadge.variant} className="flex items-center gap-1 w-fit">
                            <StatusIcon className="h-3 w-3" />
                            {statusBadge.text}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(equipment.id);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(equipment.id);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(equipment.id);
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredEquipment.length)}</span> of{' '}
                  <span className="font-medium">{filteredEquipment.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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

export default EquipmentListPage;
