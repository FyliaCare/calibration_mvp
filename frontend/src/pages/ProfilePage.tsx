/**
 * User Profile Page
 * 
 * Displays and allows editing of:
 * - Personal information
 * - Contact details
 * - Role and permissions
 * - Notification preferences
 * - Security settings (password change)
 * - Activity log
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Phone,
  Briefcase,
  Shield,
  Bell,
  Lock,
  Activity,
  Save,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { mockUsers, getUserActivities, type UserProfile } from '@/data/mockUsers';
import { useAuthStore } from '@/stores/authStore';

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const currentUser = useAuthStore(state => state.user);

  // Determine if viewing own profile or another user's profile
  const isOwnProfile = !userId || userId === currentUser?.id;
  const profileUser = isOwnProfile 
    ? mockUsers.find(u => u.id === currentUser?.id)
    : mockUsers.find(u => u.id === userId);

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<UserProfile>>(profileUser || {});

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Get user activities
  const activities = profileUser ? getUserActivities(profileUser.id, 10) : [];

  if (!profileUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <UserIcon className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
        <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/dashboard/users')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Button>
      </div>
    );
  }

  const now = new Date();
  const isLocked = profileUser.lockedUntil && new Date(profileUser.lockedUntil) > now;

  // Get role badge
  const getRoleBadge = (role: string) => {
    const roleConfig = {
      ADMIN: { icon: Shield, color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Administrator' },
      MANAGER: { icon: Briefcase, color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Manager' },
      TECHNICIAN: { icon: Wrench, color: 'bg-green-100 text-green-800 border-green-200', label: 'Technician' },
      USER: { icon: UserIcon, color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'User' },
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.USER;
    const Icon = config.icon;

    return (
      <Badge variant="outline" className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = () => {
    if (isLocked) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          <Lock className="h-3 w-3 mr-1" />
          Account Locked
        </Badge>
      );
    }

    if (!profileUser.emailVerified) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Email Unverified
        </Badge>
      );
    }

    if (!profileUser.isActive) {
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
    return new Date(dateString).toLocaleString();
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Handle form changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (type: 'email' | 'push' | 'sms', value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences!,
        [type]: value,
      },
    }));
  };

  // Handle save
  const handleSave = () => {
    console.log('Saving profile:', formData);
    alert('Profile updated successfully!\n\nThis will be implemented with backend API.');
    setIsEditing(false);
  };

  // Handle password change
  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }

    console.log('Changing password...');
    alert('Password changed successfully!\n\nThis will be implemented with backend API.');
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Get activity icon and color
  const getActivityIcon = (action: string) => {
    const config: Record<string, { icon: any; color: string }> = {
      LOGIN: { icon: UserIcon, color: 'text-blue-600 bg-blue-100' },
      LOGOUT: { icon: UserIcon, color: 'text-gray-600 bg-gray-100' },
      CALIBRATION_COMPLETED: { icon: CheckCircle, color: 'text-green-600 bg-green-100' },
      EQUIPMENT_UPDATED: { icon: Edit, color: 'text-yellow-600 bg-yellow-100' },
      USER_CREATED: { icon: UserIcon, color: 'text-purple-600 bg-purple-100' },
      CLIENT_CREATED: { icon: Briefcase, color: 'text-indigo-600 bg-indigo-100' },
      REPORT_GENERATED: { icon: Activity, color: 'text-cyan-600 bg-cyan-100' },
      WORKSHEET_CREATED: { icon: Edit, color: 'text-orange-600 bg-orange-100' },
    };

    return config[action] || { icon: Activity, color: 'text-gray-600 bg-gray-100' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(isOwnProfile ? '/dashboard' : '/dashboard/users')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isOwnProfile ? 'My Profile' : profileUser.name}
            </h1>
            <p className="text-gray-600 mt-1">{profileUser.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setFormData(profileUser);
              }}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-600 font-bold text-3xl">
                  {profileUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{profileUser.name}</h2>
                  {getRoleBadge(profileUser.role)}
                  {getStatusBadge()}
                </div>
                <p className="text-gray-600 mb-4">{profileUser.bio || 'No bio provided'}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {profileUser.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {profileUser.phone || 'No phone'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-4 w-4 mr-2" />
                    {profileUser.position || 'No position'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Member since {new Date(profileUser.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileUser.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileUser.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileUser.phone || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileUser.department || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.position || ''}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileUser.position || '-'}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileUser.bio || '-'}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notificationPreferences?.email ?? profileUser.notificationPreferences.email}
                    onChange={(e) => handleNotificationChange('email', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notificationPreferences?.push ?? profileUser.notificationPreferences.push}
                    onChange={(e) => handleNotificationChange('push', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Receive text message alerts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.notificationPreferences?.sms ?? profileUser.notificationPreferences.sms}
                    onChange={(e) => handleNotificationChange('sms', e.target.checked)}
                    disabled={!isEditing}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          {isOwnProfile && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Security Settings
              </h3>

              {!showPasswordForm ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-600">
                        Last changed: {formatDate(profileUser.lastPasswordChange)}
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setShowPasswordForm(true)}>
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleChangePassword}>
                      Update Password
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                {getStatusBadge()}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role</span>
                {getRoleBadge(profileUser.role)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Verified</span>
                {profileUser.emailVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Login</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatRelativeTime(profileUser.lastLogin || profileUser.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(profileUser.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Permissions */}
          {currentUser?.role === 'ADMIN' && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Permissions
              </h3>
              <div className="space-y-2">
                {profileUser.permissions.length === 0 ? (
                  <p className="text-sm text-gray-600">No permissions assigned</p>
                ) : profileUser.permissions.includes('all') ? (
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                    All Permissions (Admin)
                  </Badge>
                ) : (
                  profileUser.permissions.map(permission => (
                    <Badge key={permission} variant="info" className="mr-2 mb-2">
                      {permission.replace(/_/g, ' ')}
                    </Badge>
                  ))
                )}
              </div>
            </Card>
          )}

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-sm text-gray-600">No recent activity</p>
              ) : (
                activities.map((activity) => {
                  const { icon: Icon, color } = getActivityIcon(activity.action);
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
