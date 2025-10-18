import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Printer,
  Activity,
  Package,
  UserPlus,
  Briefcase,
  Plus,
  Eye,
} from 'lucide-react';
import { mockClients } from '@/data/mockClients';

const ClientDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Find client by ID
  const client = mockClients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Client Not Found</h2>
            <p className="text-gray-600 mb-6">The client you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/dashboard/clients')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Client List
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Get status badge
  const getStatusBadge = () => {
    switch (client.status) {
      case 'active':
        return { variant: 'success' as const, icon: CheckCircle, text: 'Active' };
      case 'inactive':
        return { variant: 'danger' as const, icon: XCircle, text: 'Inactive' };
      case 'pending':
        return { variant: 'warning' as const, icon: Clock, text: 'Pending' };
      case 'suspended':
        return { variant: 'danger' as const, icon: AlertCircle, text: 'Suspended' };
      default:
        return { variant: 'default' as const, icon: Users, text: client.status };
    }
  };

  // Get account type badge
  const getAccountTypeBadge = () => {
    switch (client.accountType) {
      case 'enterprise':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'premium':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'standard':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this client?')) {
      console.log('Delete client:', id);
      navigate('/dashboard/clients');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard/clients')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Client List
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{client.companyName}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={statusBadge.variant} className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {statusBadge.text}
                    </Badge>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full border-2 capitalize ${getAccountTypeBadge()}`}
                    >
                      {client.accountType}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={() => console.log('Export')}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={() => navigate(`/dashboard/clients/${id}/edit`)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Primary Contact</label>
                    <p className="mt-1 text-gray-900 font-medium">{client.contactPerson}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Client ID</label>
                    <p className="mt-1 text-gray-900">{client.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {client.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {client.phone}
                    </p>
                  </div>
                  {client.alternatePhone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Alternate Phone</label>
                      <p className="mt-1 text-gray-900 flex items-center gap-1">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {client.alternatePhone}
                      </p>
                    </div>
                  )}
                  {client.billingEmail && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Billing Email</label>
                      <p className="mt-1 text-gray-900 flex items-center gap-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {client.billingEmail}
                      </p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="mt-1 text-gray-900 flex items-start gap-1">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span>
                        {client.address}, {client.city}, {client.state} {client.zipCode}, {client.country}
                      </span>
                    </p>
                  </div>
                  {client.website && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">Website</label>
                      <p className="mt-1 text-gray-900 flex items-center gap-1">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          {client.website}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Additional Contacts */}
            {client.contacts.length > 0 && (
              <Card>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <UserPlus className="h-5 w-5 text-indigo-600" />
                      Additional Contacts
                    </h2>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Contact
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {client.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-4 rounded-lg ${
                          contact.isPrimary ? 'bg-indigo-50 border-2 border-indigo-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{contact.name}</p>
                              {contact.isPrimary && (
                                <Badge variant="info" className="text-xs">Primary</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{contact.role}</p>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {contact.email}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {contact.phone}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Equipment Assignments */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Package className="h-5 w-5 text-indigo-600" />
                    Equipment Assignments ({client.equipment.length})
                  </h2>
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/equipment')}>
                    View All Equipment
                  </Button>
                </div>
                {client.equipment.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p>No equipment assigned</p>
                    <p className="text-sm mt-1">Assign equipment to this client</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {client.equipment.map((eq) => (
                      <div
                        key={eq.id}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => navigate(`/dashboard/equipment/${eq.id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{eq.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-sm text-gray-600">S/N: {eq.serialNumber}</p>
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {eq.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Next Cal: {eq.nextCalibrationDate}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {client.recentActivity.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recent activity</p>
                  ) : (
                    client.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div
                          className={`p-2 rounded-full ${
                            activity.type === 'calibration'
                              ? 'bg-green-100'
                              : activity.type === 'job'
                              ? 'bg-blue-100'
                              : activity.type === 'invoice'
                              ? 'bg-yellow-100'
                              : 'bg-gray-100'
                          }`}
                        >
                          {activity.type === 'calibration' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : activity.type === 'job' ? (
                            <Briefcase className="h-5 w-5 text-blue-600" />
                          ) : activity.type === 'invoice' ? (
                            <DollarSign className="h-5 w-5 text-yellow-600" />
                          ) : (
                            <Users className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>

            {/* Notes */}
            {client.notes && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Notes
                  </h2>
                  <p className="text-gray-700">{client.notes}</p>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Stats & Quick Info */}
          <div className="space-y-6">
            {/* Account Overview */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Account Overview</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Industry</label>
                    <p className="mt-1 text-gray-900">{client.industry}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Registration Date</label>
                    <p className="mt-1 text-gray-900">{client.registrationDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Service</label>
                    <p className="mt-1 text-gray-900">{client.lastServiceDate}</p>
                  </div>
                  {client.taxId && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Tax ID</label>
                      <p className="mt-1 text-gray-900">{client.taxId}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Payment Terms</label>
                    <p className="mt-1 text-gray-900">{client.paymentTerms}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Business Stats */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                  Business Statistics
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Jobs</label>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{client.totalJobs}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Active Jobs</label>
                    <p className="mt-1 text-2xl font-bold text-green-600">{client.activeJobs}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Revenue</label>
                    <p className="mt-1 text-2xl font-bold text-green-600">
                      ${client.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Equipment Count</label>
                    <p className="mt-1 text-2xl font-bold text-blue-600">{client.equipment.length}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/jobs/new')}>
                    <Briefcase className="w-4 h-4 mr-2" />
                    Create New Job
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/dashboard/worksheets/new')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Create Worksheet
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Generate Invoice
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export Client Data
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
