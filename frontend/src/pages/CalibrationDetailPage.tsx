import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  FileText,
  Package,
  Building2,
  User,
  Calendar,
  MapPin,
  Thermometer,
  Droplets,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Download,
  Printer,
  Edit,
  Trash2,
  ClipboardCheck,
  FileSignature,
  Award,
  BarChart3,
  Paperclip,
  Plus,
} from 'lucide-react';
import { mockCalibrations } from '@/data/mockCalibrations';

const CalibrationDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Find calibration by ID
  const calibration = mockCalibrations.find((c) => c.id === id);

  if (!calibration) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Calibration Record Not Found</h2>
            <p className="text-gray-600 mb-6">The calibration record you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/dashboard/calibrations')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Calibration List
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Get status badge
  const getStatusBadge = () => {
    switch (calibration.status) {
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
        return { variant: 'default' as const, icon: Clock, text: calibration.status };
    }
  };

  // Get result badge
  const getResultBadge = () => {
    switch (calibration.result) {
      case 'pass':
        return { variant: 'success' as const, icon: CheckCircle, text: 'Pass', color: 'text-green-600' };
      case 'fail':
        return { variant: 'danger' as const, icon: XCircle, text: 'Fail', color: 'text-red-600' };
      case 'conditional':
        return { variant: 'warning' as const, icon: AlertTriangle, text: 'Conditional', color: 'text-yellow-600' };
      case 'pending':
        return { variant: 'default' as const, icon: Clock, text: 'Pending', color: 'text-gray-600' };
      default:
        return { variant: 'default' as const, icon: Clock, text: calibration.result, color: 'text-gray-600' };
    }
  };

  // Get as-found badge
  const getAsFoundBadge = () => {
    switch (calibration.asFound) {
      case 'pass':
        return { variant: 'success' as const, icon: CheckCircle, text: 'Pass' };
      case 'fail':
        return { variant: 'danger' as const, icon: XCircle, text: 'Fail' };
      case 'out-of-tolerance':
        return { variant: 'warning' as const, icon: AlertTriangle, text: 'Out of Tolerance' };
      default:
        return { variant: 'default' as const, icon: Clock, text: calibration.asFound };
    }
  };

  // Get as-left badge
  const getAsLeftBadge = () => {
    switch (calibration.asLeft) {
      case 'pass':
        return { variant: 'success' as const, icon: CheckCircle, text: 'Pass' };
      case 'fail':
        return { variant: 'danger' as const, icon: XCircle, text: 'Fail' };
      case 'adjusted':
        return { variant: 'info' as const, icon: ClipboardCheck, text: 'Adjusted' };
      default:
        return { variant: 'default' as const, icon: Clock, text: calibration.asLeft };
    }
  };

  const statusBadge = getStatusBadge();
  const resultBadge = getResultBadge();
  const asFoundBadge = getAsFoundBadge();
  const asLeftBadge = getAsLeftBadge();
  const StatusIcon = statusBadge.icon;
  const ResultIcon = resultBadge.icon;

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this calibration record?')) {
      console.log('Delete calibration:', id);
      navigate('/dashboard/calibrations');
    }
  };

  const handleDownloadCertificate = () => {
    console.log('Download certificate:', calibration.certificateNumber);
    alert(`Downloading certificate ${calibration.certificateNumber}.pdf`);
  };

  const handlePrintCertificate = () => {
    console.log('Print certificate:', calibration.certificateNumber);
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/dashboard/calibrations')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Calibration List
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-shrink-0 h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FileText className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{calibration.certificateNumber}</h1>
                  <p className="text-gray-600 mt-1">{calibration.equipmentName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={statusBadge.variant} className="flex items-center gap-1">
                      <StatusIcon className="h-3 w-3" />
                      {statusBadge.text}
                    </Badge>
                    <Badge variant={resultBadge.variant} className="flex items-center gap-1">
                      <ResultIcon className="h-3 w-3" />
                      {resultBadge.text}
                    </Badge>
                    {calibration.certificateIssued && (
                      <Badge variant="success" className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Certificate Issued
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {calibration.certificateIssued && (
                <>
                  <Button variant="outline" onClick={handlePrintCertificate}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" onClick={handleDownloadCertificate}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </>
              )}
              <Button onClick={() => navigate(`/dashboard/calibrations/${id}/edit`)}>
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
            {/* Equipment Information */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5 text-indigo-600" />
                  Equipment Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Equipment Name</label>
                    <p className="mt-1 text-gray-900 font-medium">{calibration.equipmentName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Serial Number</label>
                    <p className="mt-1 text-gray-900">{calibration.equipmentSerialNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Equipment ID</label>
                    <p className="mt-1 text-gray-900">{calibration.equipmentId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <span className="inline-block mt-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
                      {calibration.equipmentCategory}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/dashboard/equipment/${calibration.equipmentId}`)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      View Equipment Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Client Information */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  Client Information
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Client Name</label>
                    <p className="mt-1 text-gray-900 font-medium">{calibration.clientName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Client ID</label>
                    <p className="mt-1 text-gray-900">{calibration.clientId}</p>
                  </div>
                  <div className="col-span-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/dashboard/clients/${calibration.clientId}`)}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      View Client Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Calibration Details */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-indigo-600" />
                  Calibration Details
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Calibration Date</label>
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {calibration.calibrationDate}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Next Due Date</label>
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {calibration.nextDueDate}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Technician</label>
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <User className="h-4 w-4 text-gray-400" />
                      {calibration.technician}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Location</label>
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="capitalize">{calibration.location.replace('-', ' ')}</span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Temperature</label>
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <Thermometer className="h-4 w-4 text-gray-400" />
                      {calibration.temperature}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Humidity</label>
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-gray-400" />
                      {calibration.humidity}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data Points</label>
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <BarChart3 className="h-4 w-4 text-gray-400" />
                      {calibration.dataPoints} points collected
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Procedure</label>
                    <p className="mt-1 text-gray-900">{calibration.procedure}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Standard Equipment Used */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  Standard Equipment Used
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Standard Name</label>
                    <p className="mt-1 text-gray-900 font-medium">{calibration.standard}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Serial Number</label>
                    <p className="mt-1 text-gray-900">{calibration.standardSerialNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Certificate Number</label>
                    <p className="mt-1 text-gray-900">{calibration.standardCertificate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Certificate Expiry</label>
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {calibration.standardExpiry}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Calibration Results */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileSignature className="h-5 w-5 text-indigo-600" />
                  Calibration Results
                </h2>
                <div className="space-y-4">
                  {/* As Found */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-gray-500 block mb-2">As-Found Condition</label>
                    <Badge variant={asFoundBadge.variant} className="flex items-center gap-1 w-fit">
                      <asFoundBadge.icon className="h-4 w-4" />
                      {asFoundBadge.text}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      Initial condition of equipment before calibration
                    </p>
                  </div>

                  {/* As Left */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <label className="text-sm font-medium text-gray-500 block mb-2">As-Left Condition</label>
                    <Badge variant={asLeftBadge.variant} className="flex items-center gap-1 w-fit">
                      <asLeftBadge.icon className="h-4 w-4" />
                      {asLeftBadge.text}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      Final condition of equipment after calibration/adjustment
                    </p>
                  </div>

                  {/* Overall Result */}
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <label className="text-sm font-medium text-gray-500 block mb-2">Overall Result</label>
                    <div className="flex items-center gap-3">
                      <ResultIcon className={`h-8 w-8 ${resultBadge.color}`} />
                      <div>
                        <p className={`text-2xl font-bold ${resultBadge.color}`}>{resultBadge.text.toUpperCase()}</p>
                        <p className="text-sm text-gray-600 mt-1">Calibration {resultBadge.text.toLowerCase()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Notes */}
            {calibration.notes && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Technician Notes
                  </h2>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{calibration.notes}</p>
                </div>
              </Card>
            )}

            {/* Attachments */}
            {calibration.attachments && calibration.attachments.length > 0 && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Paperclip className="h-5 w-5 text-indigo-600" />
                    Attachments
                  </h2>
                  <div className="space-y-2">
                    {calibration.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => console.log('Download:', attachment)}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">{attachment}</span>
                        </div>
                        <Download className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Certificate & Actions */}
          <div className="space-y-6">
            {/* Certificate Status */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  Certificate Status
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Certificate Number</label>
                    <p className="mt-1 text-gray-900 font-mono font-bold">
                      {calibration.certificateNumber}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Issued</label>
                    <p className="mt-1">
                      {calibration.certificateIssued ? (
                        <Badge variant="success" className="flex items-center gap-1 w-fit">
                          <CheckCircle className="h-3 w-3" />
                          Yes
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="flex items-center gap-1 w-fit">
                          <Clock className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </p>
                  </div>
                  {calibration.certificateIssuedDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Issue Date</label>
                      <p className="mt-1 text-gray-900">{calibration.certificateIssuedDate}</p>
                    </div>
                  )}
                  {calibration.approvedBy && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Approved By</label>
                        <p className="mt-1 text-gray-900">{calibration.approvedBy}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Approval Date</label>
                        <p className="mt-1 text-gray-900">{calibration.approvedDate}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(`/dashboard/equipment/${calibration.equipmentId}`)}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    View Equipment
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(`/dashboard/clients/${calibration.clientId}`)}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    View Client
                  </Button>
                  {calibration.certificateIssued && (
                    <>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleDownloadCertificate}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Certificate
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handlePrintCertificate}
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Print Certificate
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/dashboard/calibrations/new')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Calibration
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

export default CalibrationDetailPage;
