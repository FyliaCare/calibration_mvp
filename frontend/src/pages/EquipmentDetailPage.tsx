import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Wrench,
  Archive,
  XCircle,
  Download,
  Printer,
  Activity,
} from 'lucide-react';
import { mockEquipment } from '@/data/mockEquipment';

const EquipmentDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Find equipment by ID
  const equipment = mockEquipment.find((eq) => eq.id === id);

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Equipment Not Found</h2>
            <p className="text-gray-600 mb-6">The equipment you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/dashboard/equipment')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Equipment List
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Get status badge
  const getStatusBadge = () => {
    switch (equipment.status) {
      case 'active':
        return { variant: 'success' as const, icon: CheckCircle, text: 'Active' };
      case 'calibration-due':
        return { variant: 'warning' as const, icon: AlertCircle, text: 'Calibration Due' };
      case 'maintenance':
        return { variant: 'info' as const, icon: Wrench, text: 'Maintenance' };
      case 'retired':
        return { variant: 'default' as const, icon: Archive, text: 'Retired' };
      case 'inactive':
        return { variant: 'danger' as const, icon: XCircle, text: 'Inactive' };
      default:
        return { variant: 'default' as const, icon: Package, text: equipment.status };
    }
  };

  const statusBadge = getStatusBadge();
  const StatusIcon = statusBadge.icon;

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      console.log('Delete equipment:', id);
      navigate('/dashboard/equipment');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard/equipment')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Equipment List
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{equipment.name}</h1>
                <Badge variant={statusBadge.variant} className="flex items-center gap-1">
                  <StatusIcon className="h-3 w-3" />
                  {statusBadge.text}
                </Badge>
              </div>
              <p className="text-gray-600">
                {equipment.manufacturer} {equipment.model} • {equipment.serialNumber}
              </p>
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
              <Button onClick={() => navigate(`/dashboard/equipment/${id}/edit`)}>
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
            {/* Basic Information */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-indigo-600" />
                  Basic Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Equipment ID</label>
                    <p className="mt-1 text-gray-900">{equipment.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Asset Number</label>
                    <p className="mt-1 text-gray-900">{equipment.assetNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Manufacturer</label>
                    <p className="mt-1 text-gray-900">{equipment.manufacturer}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Model</label>
                    <p className="mt-1 text-gray-900">{equipment.model}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Serial Number</label>
                    <p className="mt-1 text-gray-900">{equipment.serialNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="mt-1">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 capitalize">
                        {equipment.category}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Type</label>
                    <p className="mt-1 text-gray-900">{equipment.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {equipment.location}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Technical Specifications */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Technical Specifications
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Range</label>
                    <p className="mt-1 text-gray-900">{equipment.range}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Accuracy</label>
                    <p className="mt-1 text-gray-900">{equipment.accuracy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Resolution</label>
                    <p className="mt-1 text-gray-900">{equipment.resolution}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Calibration Interval</label>
                    <p className="mt-1 text-gray-900">{equipment.calibrationInterval} months</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Calibration History */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-indigo-600" />
                  Calibration History
                </h2>
                <div className="space-y-4">
                  {equipment.calibrationHistory.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No calibration history available</p>
                  ) : (
                    equipment.calibrationHistory.map((cal) => (
                      <div
                        key={cal.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-full ${
                              cal.result === 'pass' ? 'bg-green-100' : 'bg-red-100'
                            }`}
                          >
                            {cal.result === 'pass' ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{cal.certificateNumber}</p>
                            <p className="text-sm text-gray-500">By {cal.technician}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{cal.date}</p>
                          <Badge variant={cal.result === 'pass' ? 'success' : 'danger'} className="text-xs">
                            {cal.result.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Card>

            {/* Notes */}
            {equipment.notes && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Notes
                  </h2>
                  <p className="text-gray-700">{equipment.notes}</p>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Quick Info & Actions */}
          <div className="space-y-6">
            {/* Calibration Status */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Calibration Status
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Calibration</label>
                    <p className="mt-1 text-gray-900">{equipment.lastCalibrationDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Next Due Date</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {equipment.nextCalibrationDate}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Days Until Due</label>
                    <p className="mt-1 text-gray-900">
                      {Math.ceil(
                        (new Date(equipment.nextCalibrationDate).getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{' '}
                      days
                    </p>
                  </div>
                </div>
                <Button className="w-full mt-4" onClick={() => navigate('/dashboard/worksheets/new')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Create Worksheet
                </Button>
              </div>
            </Card>

            {/* Purchase Information */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-indigo-600" />
                  Purchase Info
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Purchase Date</label>
                    <p className="mt-1 text-gray-900">{equipment.purchaseDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cost</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      ${equipment.cost.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Supplier</label>
                    <p className="mt-1 text-gray-900">{equipment.supplier}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Warranty Expiry</label>
                    <p className="mt-1 text-gray-900">{equipment.warrantyExpiry}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Client Assignment */}
            {equipment.clientName && (
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Client Assignment</h3>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Assigned To</label>
                    <p className="mt-1 text-gray-900">{equipment.clientName}</p>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View Client Details
                  </Button>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Calibration
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Wrench className="w-4 h-4 mr-2" />
                    Request Maintenance
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    View Documentation
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

export default EquipmentDetailPage;
