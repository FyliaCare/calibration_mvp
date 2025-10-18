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
  Users,
  Building2,
  Mail,
  Phone,
  MapPin,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Briefcase,
} from 'lucide-react';
import { mockClients, filterClients, getClientStats, type Client } from '@/data/mockClients';

const ClientListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAccountType, setSelectedAccountType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filter clients
  const filteredClients = filterClients(mockClients, {
    search: searchTerm,
    status: selectedStatus,
    accountType: selectedAccountType,
  });

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  // Stats
  const stats = getClientStats(mockClients);

  // Get status badge color and icon
  const getStatusBadge = (status: Client['status']) => {
    switch (status) {
      case 'active':
        return { variant: 'success' as const, icon: CheckCircle, text: 'Active' };
      case 'inactive':
        return { variant: 'danger' as const, icon: XCircle, text: 'Inactive' };
      case 'pending':
        return { variant: 'warning' as const, icon: Clock, text: 'Pending' };
      case 'suspended':
        return { variant: 'danger' as const, icon: AlertCircle, text: 'Suspended' };
      default:
        return { variant: 'default' as const, icon: Users, text: status };
    }
  };

  // Get account type badge color
  const getAccountTypeBadge = (accountType: Client['accountType']) => {
    switch (accountType) {
      case 'enterprise':
        return { color: 'bg-purple-100 text-purple-700', text: 'Enterprise' };
      case 'premium':
        return { color: 'bg-blue-100 text-blue-700', text: 'Premium' };
      case 'standard':
        return { color: 'bg-gray-100 text-gray-700', text: 'Standard' };
      default:
        return { color: 'bg-gray-100 text-gray-700', text: accountType };
    }
  };

  // Handle actions
  const handleView = (id: string) => {
    navigate(`/dashboard/clients/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/clients/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      console.log('Delete client:', id);
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
              <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
              <p className="mt-2 text-gray-600">
                Manage client accounts and contact information
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
              <Button onClick={() => navigate('/dashboard/clients/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
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
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      ${(stats.totalRevenue / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </Card>

            <Card className="bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.activeJobs}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-white">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="md:col-span-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-10"
                    />
                  </div>
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
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                {/* Account Type Filter */}
                <div>
                  <select
                    value={selectedAccountType}
                    onChange={(e) => {
                      setSelectedAccountType(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">All Account Types</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Clients Table */}
        <Card className="bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jobs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
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
                {paginatedClients.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <p className="text-gray-500">No clients found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your filters or add new clients
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedClients.map((client) => {
                    const statusBadge = getStatusBadge(client.status);
                    const accountTypeBadge = getAccountTypeBadge(client.accountType);
                    const StatusIcon = statusBadge.icon;

                    return (
                      <tr
                        key={client.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleView(client.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{client.companyName}</div>
                              <div className="text-sm text-gray-500">{client.industry}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {client.contactPerson}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Mail className="h-3 w-3 mr-1" />
                              {client.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Phone className="h-3 w-3 mr-1" />
                              {client.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-900">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <div>
                              <div>{client.city}, {client.state}</div>
                              <div className="text-xs text-gray-500">{client.zipCode}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${accountTypeBadge.color}`}
                          >
                            {accountTypeBadge.text}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="font-medium">{client.totalJobs} total</div>
                            <div className="text-xs text-green-600">{client.activeJobs} active</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            ${client.totalRevenue.toLocaleString()}
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
                                handleView(client.id);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(client.id);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(client.id);
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
                  <span className="font-medium">{Math.min(endIndex, filteredClients.length)}</span> of{' '}
                  <span className="font-medium">{filteredClients.length}</span> results
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

export default ClientListPage;
