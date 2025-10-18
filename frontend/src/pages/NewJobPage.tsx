import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  Save,
  Send,
  Calendar,
  Package,
  Users,
  FileText,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';

interface CalibrationJob {
  // Job Information
  jobNumber: string;
  jobTitle: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  status: 'scheduled' | 'in-progress' | 'pending' | 'on-hold';
  
  // Client Information
  clientId?: string;
  clientName: string;
  contactPerson: string;
  email: string;
  phone: string;
  purchaseOrder: string;
  
  // Scheduling
  scheduledDate: string;
  dueDate: string;
  estimatedDuration: string;
  assignedTechnician: string;
  
  // Equipment List
  equipment: {
    id: string;
    name: string;
    manufacturer: string;
    model: string;
    serialNumber: string;
    quantity: number;
  }[];
  
  // Job Details
  serviceType: 'calibration' | 'repair' | 'inspection' | 'verification';
  location: 'in-house' | 'on-site';
  specialInstructions: string;
  attachments: string[];
}

const NewJobPage = () => {
  const navigate = useNavigate();
  const [jobData, setJobData] = useState<CalibrationJob>({
    jobNumber: `JOB-${Date.now().toString().slice(-6)}`,
    jobTitle: '',
    priority: 'normal',
    status: 'scheduled',
    clientName: '',
    contactPerson: '',
    email: '',
    phone: '',
    purchaseOrder: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    estimatedDuration: '',
    assignedTechnician: '',
    equipment: [],
    serviceType: 'calibration',
    location: 'in-house',
    specialInstructions: '',
    attachments: [],
  });

  const [newEquipment, setNewEquipment] = useState({
    id: '',
    name: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    quantity: 1,
  });

  const handleInputChange = (field: keyof CalibrationJob, value: any) => {
    setJobData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddEquipment = () => {
    if (newEquipment.name && newEquipment.serialNumber) {
      setJobData(prev => ({
        ...prev,
        equipment: [...prev.equipment, { ...newEquipment, id: Date.now().toString() }],
      }));
      setNewEquipment({
        id: '',
        name: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
        quantity: 1,
      });
    }
  };

  const handleRemoveEquipment = (id: string) => {
    setJobData(prev => ({
      ...prev,
      equipment: prev.equipment.filter(eq => eq.id !== id),
    }));
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', jobData);
    alert('Job saved as draft!');
  };

  const handleScheduleJob = () => {
    console.log('Scheduling job:', jobData);
    alert('Job scheduled successfully!');
    navigate('/dashboard');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'normal': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-green-100 text-green-700 border-green-300';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'on-hold': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Calibration Job
              </h1>
              <p className="mt-2 text-gray-600">
                Schedule a new calibration job and assign equipment
              </p>
            </div>
            <Badge variant="info" className="text-lg px-4 py-2">
              {jobData.jobNumber}
            </Badge>
          </div>
        </div>

        {/* Job Information */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <FileText className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Job Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <Input
                  value={jobData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder="e.g., Monthly Pressure Gauge Calibration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['urgent', 'high', 'normal', 'low'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => handleInputChange('priority', priority)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium capitalize transition-all ${
                        jobData.priority === priority
                          ? getPriorityColor(priority)
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['scheduled', 'in-progress', 'pending', 'on-hold'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleInputChange('status', status)}
                      className={`px-3 py-2 rounded-lg border-2 font-medium capitalize text-sm transition-all ${
                        jobData.status === status
                          ? getStatusColor(status)
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {status.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  value={jobData.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="calibration">Calibration</option>
                  <option value="repair">Repair</option>
                  <option value="inspection">Inspection</option>
                  <option value="verification">Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleInputChange('location', 'in-house')}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                      jobData.location === 'in-house'
                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    In-House
                  </button>
                  <button
                    onClick={() => handleInputChange('location', 'on-site')}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                      jobData.location === 'on-site'
                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    On-Site
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Client Information */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Users className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Client Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <Input
                  value={jobData.clientName}
                  onChange={(e) => handleInputChange('clientName', e.target.value)}
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <Input
                  value={jobData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={jobData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <Input
                  type="tel"
                  value={jobData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Order
                </label>
                <Input
                  value={jobData.purchaseOrder}
                  onChange={(e) => handleInputChange('purchaseOrder', e.target.value)}
                  placeholder="PO number (optional)"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Scheduling */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Scheduling</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Date *
                </label>
                <Input
                  type="date"
                  value={jobData.scheduledDate}
                  onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <Input
                  type="date"
                  value={jobData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration
                </label>
                <select
                  value={jobData.estimatedDuration}
                  onChange={(e) => handleInputChange('estimatedDuration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select duration</option>
                  <option value="1-hour">1 hour</option>
                  <option value="2-hours">2 hours</option>
                  <option value="4-hours">4 hours</option>
                  <option value="1-day">1 day</option>
                  <option value="2-days">2 days</option>
                  <option value="1-week">1 week</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Technician *
                </label>
                <select
                  value={jobData.assignedTechnician}
                  onChange={(e) => handleInputChange('assignedTechnician', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select technician</option>
                  <option value="F. Alika">F. Alika</option>
                  <option value="E. Mensah">E. Mensah</option>
                  <option value="G. Boachway">G. Boachway</option>
                  <option value="T. Johnson">T. Johnson</option>
                  <option value="M. Smith">M. Smith</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Equipment List */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Equipment to Calibrate</h2>
              </div>
              <Badge variant="info">
                {jobData.equipment.length} item{jobData.equipment.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {/* Add Equipment Form */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3">
                <div className="md:col-span-2">
                  <Input
                    placeholder="Equipment name *"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Manufacturer"
                    value={newEquipment.manufacturer}
                    onChange={(e) => setNewEquipment(prev => ({ ...prev, manufacturer: e.target.value }))}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Model"
                    value={newEquipment.model}
                    onChange={(e) => setNewEquipment(prev => ({ ...prev, model: e.target.value }))}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Serial No. *"
                    value={newEquipment.serialNumber}
                    onChange={(e) => setNewEquipment(prev => ({ ...prev, serialNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newEquipment.quantity}
                    onChange={(e) => setNewEquipment(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    min="1"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddEquipment}
                variant="outline"
                className="w-full"
                disabled={!newEquipment.name || !newEquipment.serialNumber}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Equipment
              </Button>
            </div>

            {/* Equipment List */}
            {jobData.equipment.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No equipment added yet</p>
                <p className="text-sm mt-1">Add equipment using the form above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobData.equipment.map((eq) => (
                  <div
                    key={eq.id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex-1 grid grid-cols-5 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{eq.name}</p>
                        <p className="text-xs text-gray-500">Equipment</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{eq.manufacturer || '-'}</p>
                        <p className="text-xs text-gray-500">Manufacturer</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{eq.model || '-'}</p>
                        <p className="text-xs text-gray-500">Model</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{eq.serialNumber}</p>
                        <p className="text-xs text-gray-500">Serial No.</p>
                      </div>
                      <div>
                        <Badge variant="info">Qty: {eq.quantity}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => handleRemoveEquipment(eq.id)}
                      className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Special Instructions */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Special Instructions</h2>
            </div>

            <textarea
              value={jobData.specialInstructions}
              onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Any special requirements, procedures, or notes for this job..."
            />
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pb-8">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>

          <Button
            onClick={handleScheduleJob}
            disabled={
              !jobData.jobTitle ||
              !jobData.clientName ||
              !jobData.scheduledDate ||
              !jobData.dueDate ||
              !jobData.assignedTechnician ||
              jobData.equipment.length === 0
            }
          >
            <Send className="w-4 h-4 mr-2" />
            Schedule Job
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewJobPage;
