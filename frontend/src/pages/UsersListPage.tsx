/**
 * Users List Page
 * 
 * Comprehensive user management interface with:
 * - User statistics dashboard (total, active, by role)
 * - Advanced search and filtering (role, department, status)
 * - User table with pagination
 * - Role badges and status indicators
 * - Quick actions (view, edit, lock/unlock)
 * - Create new user button
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users as UsersIcon,
  Search,
  Filter,
  UserPlus,
  Eye,
  Edit,
  Lock,
  Unlock,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Briefcase,
  Wrench,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockUsers, filterUsers, getUserStats, type UserProfile } from '@/data/mockUsers';

export default function UsersListPage() {
  const navigate = useNavigate();

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive' | 'locked' | 'unverified'>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get statistics
  const stats = useMemo(() => getUserStats(mockUsers), []);

  // Get unique departments
  const departments = useMemo(() => {
    const depts = new Set(mockUsers.map(u => u.department).filter(Boolean));
    return Array.from(depts).sort();
  }, []);

  // Filter users
  const filteredUsers = useMemo(() => {
    return filterUsers(mockUsers, {
      search: searchQuery,
      role: selectedRole,
      department: selectedDepartment,
      status: selectedStatus,
    });
  }, [searchQuery, selectedRole, selectedDepartment, selectedStatus]);

  // Paginate
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRole, selectedDepartment, selectedStatus]);

  // Get role badge variant
  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: { icon: Shield, color: 'bg-purple-100 text-purple-800 border-purple-200' },
      MANAGER: { icon: Briefcase, color: 'bg-blue-100 text-blue-800 border-blue-200' },
      TECHNICIAN: { icon: Wrench, color: 'bg-green-100 text-green-800 border-green-200' },
      USER: { icon: User, color: 'bg-gray-100 text-gray-800 border-gray-200' },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {role}
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = (user: UserProfile) => {
    const now = new Date();
    const isLocked = user.lockedUntil && new Date(user.lockedUntil) > now;

    if (isLocked) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          <Lock className="h-3 w-3 mr-1" />
          Locked
        </Badge>
      );
    }

    if (!user.emailVerified) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Unverified
        </Badge>
      );
    }

    if (!user.isActive) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
          <XCircle className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Handle actions
  const handleViewUser = (userId: string) => {
    navigate(`/dashboard/users/${userId}`);
  };

  const handleEditUser = (userId: string) => {
    navigate(`/dashboard/users/${userId}/edit`);
  };

  const handleToggleLock = (user: UserProfile) => {
    const now = new Date();
    const isLocked = user.lockedUntil && new Date(user.lockedUntil) > now;
    alert(`${isLocked ? 'Unlock' : 'Lock'} user: ${user.name}\n\nThis action will be implemented with backend API.`);
  };

  const handleCreateUser = () => {
    navigate('/dashboard/users/new');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
        </div>
        <Button onClick={handleCreateUser}>
          <UserPlus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-purple-600">{stats.byRole.admin}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Technicians</p>
              <p className="text-2xl font-bold text-blue-600">{stats.byRole.technician}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent Logins</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentLogins}</p>
              <p className="text-xs text-gray-500">Last 24h</p>
            </div>
            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Name, email, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline h-4 w-4 mr-1" />
              Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="technician">Technician</option>
              <option value="user">User</option>
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline h-4 w-4 mr-1" />
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Departments</option>
              {departments.filter(Boolean).map(dept => (
                <option key={dept!} value={dept!}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="inline h-4 w-4 mr-1" />
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="locked">Locked</option>
              <option value="unverified">Unverified</option>
            </select>
          </div>
        </div>

        {/* Active Filters Summary */}
        {(searchQuery || selectedRole !== 'all' || selectedDepartment !== 'all' || selectedStatus !== 'all') && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="text-gray-600">Active filters:</span>
            {searchQuery && (
              <Badge variant="info">Search: {searchQuery}</Badge>
            )}
            {selectedRole !== 'all' && (
              <Badge variant="info">Role: {selectedRole}</Badge>
            )}
            {selectedDepartment !== 'all' && (
              <Badge variant="info">Dept: {selectedDepartment}</Badge>
            )}
            {selectedStatus !== 'all' && (
              <Badge variant="info">Status: {selectedStatus}</Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedRole('all');
                setSelectedDepartment('all');
                setSelectedStatus('all');
              }}
            >
              Clear all
            </Button>
          </div>
        )}
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No users found matching your filters</p>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const now = new Date();
                  const isLocked = user.lockedUntil && new Date(user.lockedUntil) > now;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewUser(user.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold text-sm">
                              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.department || '-'}</div>
                        <div className="text-sm text-gray-500">{user.position || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.lastLogin)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewUser(user.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUser(user.id);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLock(user);
                            }}
                          >
                            {isLocked ? (
                              <Unlock className="h-4 w-4 text-green-600" />
                            ) : (
                              <Lock className="h-4 w-4 text-red-600" />
                            )}
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
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
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
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
  );
}
