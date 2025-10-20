import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Plus,
  Search,
  Download,
  Users,
  Building2,
  MapPin,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Briefcase,
  Filter,
  SortAsc,
  SortDesc,
  ArrowUpDown,
  X,
  RefreshCw,
  Zap,
  TrendingUp,
  Shield,
  Sparkles,
  Rocket,
} from 'lucide-react';
import { mockClients, filterClients, getClientStats, type Client } from '@/data/mockClients';

type SortField = 'companyName' | 'totalRevenue' | 'totalJobs';
type SortDirection = 'asc' | 'desc';

const ClientListPage = () => {
  const navigate = useNavigate();
  
  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAccountType, setSelectedAccountType] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>('companyName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);

  // Get unique industries
  const industries = useMemo(() => {
    const uniqueIndustries = Array.from(new Set(mockClients.map(c => c.industry)));
    return uniqueIndustries.sort();
  }, []);

  // Filter & Sort
  const filteredAndSortedClients = useMemo(() => {
    let result = filterClients(mockClients, {
      search: searchTerm,
      status: selectedStatus,
      accountType: selectedAccountType,
    });

    if (selectedIndustry !== 'all') {
      result = result.filter(c => c.industry === selectedIndustry);
    }

    // Sorting
    result.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'companyName':
          aValue = a.companyName.toLowerCase();
          bValue = b.companyName.toLowerCase();
          break;
        case 'totalRevenue':
          aValue = a.totalRevenue;
          bValue = b.totalRevenue;
          break;
        case 'totalJobs':
          aValue = a.totalJobs;
          bValue = b.totalJobs;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [searchTerm, selectedStatus, selectedAccountType, selectedIndustry, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedClients = filteredAndSortedClients.slice(startIndex, endIndex);

  // Stats
  const stats = getClientStats(mockClients);

  // Get status badge
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

  // Handlers
  const handleView = (id: string) => {
    navigate(`/dashboard/clients/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/dashboard/clients/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      console.log('Delete client:', id);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedAccountType('all');
    setSelectedIndustry('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || selectedStatus !== 'all' || 
    selectedAccountType !== 'all' || selectedIndustry !== 'all';

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    return sortDirection === 'asc' ? 
      <SortAsc className="h-4 w-4 text-indigo-600" /> : 
      <SortDesc className="h-4 w-4 text-indigo-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Client Management
              </h1>
              <p className="mt-2 text-gray-600 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Manage client accounts, contacts, and relationships
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => console.log('Refresh')}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={() => console.log('Import')}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" onClick={() => console.log('Export')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                onClick={() => navigate('/dashboard/clients/new')} 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Clients</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                    <p className="text-xs text-blue-600 mt-1">All accounts</p>
                  </div>
                  <div className="bg-blue-200 p-3 rounded-lg">
                    <Users className="h-8 w-8 text-blue-700" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Active</p>
                    <p className="text-3xl font-bold text-green-900">{stats.active}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {((stats.active / stats.total) * 100).toFixed(0)}% of total
                    </p>
                  </div>
                  <div className="bg-green-200 p-3 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-700" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">Pending</p>
                    <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
                    <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
                  </div>
                  <div className="bg-yellow-200 p-3 rounded-lg">
                    <Clock className="h-8 w-8 text-yellow-700" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold text-emerald-900">
                      ${(stats.totalRevenue / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-emerald-600 mt-1">Lifetime value</p>
                  </div>
                  <div className="bg-emerald-200 p-3 rounded-lg">
                    <DollarSign className="h-8 w-8 text-emerald-700" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-200">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Active Jobs</p>
                    <p className="text-3xl font-bold text-purple-900">{stats.activeJobs}</p>
                    <p className="text-xs text-purple-600 mt-1">In progress</p>
                  </div>
                  <div className="bg-purple-200 p-3 rounded-lg">
                    <Briefcase className="h-8 w-8 text-purple-700" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Toolbar */}
          <Card className="bg-white shadow-md border-gray-200">
            <div className="p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Search */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-10 pr-4 py-2 border-gray-300 focus:ring-2 focus:ring-indigo-500"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </button>
                    )}
                  </div>
                  
                  <Button
                    variant={showFilters ? 'default' : 'outline'}
                    onClick={() => setShowFilters(!showFilters)}
                    className="relative"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                        {[selectedStatus !== 'all', selectedAccountType !== 'all', 
                          selectedIndustry !== 'all'].filter(Boolean).length}
                      </span>
                    )}
                  </Button>

                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Items per page */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value={10}>10 per page</option>
                  <option value={15}>15 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => {
                          setSelectedStatus(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                      <select
                        value={selectedAccountType}
                        onChange={(e) => {
                          setSelectedAccountType(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="all">All Types</option>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>

                    {/* Industry Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <select
                        value={selectedIndustry}
                        onChange={(e) => {
                          setSelectedIndustry(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="all">All Industries</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Results Info */}
        {filteredAndSortedClients.length > 0 && (
          <div className="mb-4 px-2 py-3 flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing <span className="font-bold text-gray-900">{startIndex + 1}</span> to{' '}
              <span className="font-bold text-gray-900">
                {Math.min(endIndex, filteredAndSortedClients.length)}
              </span>{' '}
              of <span className="font-bold text-indigo-600">{filteredAndSortedClients.length}</span> clients
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                  Filtered
                </span>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <Card className="bg-white shadow-lg border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('companyName')}
                      className="flex items-center gap-2 text-sm font-bold text-gray-700 uppercase tracking-wider hover:text-indigo-600 transition-colors"
                    >
                      <Building2 className="h-4 w-4" />
                      Company Name
                      {getSortIcon('companyName')}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Industry
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Status
                    </span>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Quick Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                          <Users className="h-12 w-12 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-1">No clients found</p>
                        <p className="text-sm text-gray-500 mb-4">
                          {hasActiveFilters
                            ? 'Try adjusting your filters or search terms'
                            : 'Get started by adding your first client'}
                        </p>
                        {!hasActiveFilters && (
                          <Button onClick={() => navigate('/dashboard/clients/new')}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Client
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedClients.map((client) => {
                    const statusBadge = getStatusBadge(client.status);
                    const StatusIcon = statusBadge.icon;

                    return (
                      <tr
                        key={client.id}
                        className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 cursor-pointer border-b border-gray-50 group"
                        onClick={() => handleView(client.id)}
                      >
                        {/* Company Name */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="flex-shrink-0 h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Building2 className="h-7 w-7 text-white" />
                            </div>
                            <div>
                              <div className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {client.companyName}
                              </div>
                              <div className="text-sm text-gray-500 mt-0.5">
                                Click to view full profile →
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Industry */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-700">
                              {client.industry}
                            </span>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {client.city}, {client.state}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <Badge 
                            variant={statusBadge.variant} 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold"
                          >
                            <StatusIcon className="h-4 w-4" />
                            {statusBadge.text}
                          </Badge>
                        </td>

                        {/* Quick Actions */}
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleView(client.id);
                              }}
                              className="hover:bg-indigo-100 hover:text-indigo-700"
                              title="View Details"
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
                              className="hover:bg-blue-100 hover:text-blue-700"
                              title="Edit"
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
                              className="hover:bg-red-100 hover:text-red-700"
                              title="Delete"
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
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Page <span className="font-semibold">{currentPage}</span> of{' '}
                  <span className="font-semibold">{totalPages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="text-xs"
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-sm rounded-lg transition-all ${
                            currentPage === page
                              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md font-semibold'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="text-xs"
                  >
                    Last
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
