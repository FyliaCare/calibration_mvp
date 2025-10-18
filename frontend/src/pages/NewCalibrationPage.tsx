import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Package,
  Users,
  ClipboardCheck,
  Eye,
  Save,
  Wrench,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface CalibrationData {
  // Step 1: Equipment
  equipmentId?: string;
  equipmentName: string;
  manufacturer: string;
  modelNumber: string;
  serialNumber: string;
  equipmentType: string;
  
  // Step 2: Client
  clientId?: string;
  clientName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  
  // Step 3: Calibration
  calibrationDate: string;
  nextDueDate: string;
  technician: string;
  calibrationStandard: string;
  environmentTemp: string;
  environmentHumidity: string;
  asFound: string;
  asLeft: string;
  passFail: 'pass' | 'fail' | '';
  notes: string;
  
  // Step 4: Review
  certificateNumber?: string;
}

const STEPS = [
  { number: 1, title: 'Equipment', icon: Package, description: 'Select or enter equipment details' },
  { number: 2, title: 'Client', icon: Users, description: 'Enter client information' },
  { number: 3, title: 'Calibration', icon: ClipboardCheck, description: 'Record calibration data' },
  { number: 4, title: 'Review', icon: Eye, description: 'Review and submit' },
];

export function NewCalibrationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CalibrationData>({
    equipmentName: '',
    manufacturer: '',
    modelNumber: '',
    serialNumber: '',
    equipmentType: '',
    clientName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    calibrationDate: new Date().toISOString().split('T')[0],
    nextDueDate: '',
    technician: '',
    calibrationStandard: '',
    environmentTemp: '',
    environmentHumidity: '',
    asFound: '',
    asLeft: '',
    passFail: '',
    notes: '',
  });

  const updateFormData = (field: keyof CalibrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    // TODO: Connect to API
    console.log('Submitting calibration:', formData);
    // Generate certificate and navigate
    alert('Calibration record created successfully! Certificate will be generated.');
    navigate('/dashboard');
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    alert('Draft saved successfully!');
  };

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.equipmentName && formData.serialNumber && formData.equipmentType);
      case 2:
        return !!(formData.clientName && formData.contactPerson && formData.email);
      case 3:
        return !!(formData.calibrationDate && formData.technician && formData.passFail);
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                    <Wrench className="h-7 w-7 text-white" />
                  </div>
                  New Calibration Record
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Complete the form below to create a new calibration record and certificate
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between max-w-4xl mx-auto mt-8">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 ${
                      currentStep === step.number
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg scale-110'
                        : currentStep > step.number
                        ? 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="h-7 w-7 text-white" />
                    ) : (
                      <step.icon
                        className={`h-7 w-7 ${
                          currentStep === step.number
                            ? 'text-white'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      />
                    )}
                    {currentStep === step.number && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold">
                        {step.number}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <p
                      className={`font-semibold ${
                        currentStep === step.number
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 rounded transition-all duration-300 ${
                      currentStep > step.number
                        ? 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    style={{ marginTop: '-40px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Card className="shadow-xl border-2 border-gray-200 dark:border-gray-700">
          <div className="p-8">
            {/* Step 1: Equipment */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-slide-in-from-right">
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-100">Equipment Information</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Enter the equipment details or select from existing equipment
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Equipment Name *
                    </label>
                    <Input
                      value={formData.equipmentName}
                      onChange={(e) => updateFormData('equipmentName', e.target.value)}
                      placeholder="e.g., Digital Multimeter"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Equipment Type *
                    </label>
                    <select
                      value={formData.equipmentType}
                      onChange={(e) => updateFormData('equipmentType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      required
                    >
                      <option value="">Select type...</option>
                      <option value="multimeter">Multimeter</option>
                      <option value="pressure-gauge">Pressure Gauge</option>
                      <option value="temperature-sensor">Temperature Sensor</option>
                      <option value="torque-wrench">Torque Wrench</option>
                      <option value="scale">Scale/Balance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Manufacturer
                    </label>
                    <Input
                      value={formData.manufacturer}
                      onChange={(e) => updateFormData('manufacturer', e.target.value)}
                      placeholder="e.g., Fluke"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Model Number
                    </label>
                    <Input
                      value={formData.modelNumber}
                      onChange={(e) => updateFormData('modelNumber', e.target.value)}
                      placeholder="e.g., DMM-2500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Serial Number *
                    </label>
                    <Input
                      value={formData.serialNumber}
                      onChange={(e) => updateFormData('serialNumber', e.target.value)}
                      placeholder="e.g., SN123456789"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Client */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-slide-in-from-right">
                <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded">
                  <AlertCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-purple-900 dark:text-purple-100">Client Information</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                      Enter client details or select from existing clients
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Client/Company Name *
                    </label>
                    <Input
                      value={formData.clientName}
                      onChange={(e) => updateFormData('clientName', e.target.value)}
                      placeholder="e.g., ABC Manufacturing"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Contact Person *
                    </label>
                    <Input
                      value={formData.contactPerson}
                      onChange={(e) => updateFormData('contactPerson', e.target.value)}
                      placeholder="e.g., John Smith"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="e.g., john@abcmanufacturing.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="e.g., (555) 123-4567"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Address
                    </label>
                    <Input
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                      placeholder="e.g., 123 Main St, City, State 12345"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Calibration Data */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-slide-in-from-right">
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
                  <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">Calibration Details</p>
                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                      Record calibration measurements and environmental conditions
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Calibration Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.calibrationDate}
                      onChange={(e) => updateFormData('calibrationDate', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Next Due Date
                    </label>
                    <Input
                      type="date"
                      value={formData.nextDueDate}
                      onChange={(e) => updateFormData('nextDueDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Technician *
                    </label>
                    <select
                      value={formData.technician}
                      onChange={(e) => updateFormData('technician', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      required
                    >
                      <option value="">Select technician...</option>
                      <option value="John Smith">John Smith</option>
                      <option value="Sarah Johnson">Sarah Johnson</option>
                      <option value="Mike Davis">Mike Davis</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Calibration Standard
                    </label>
                    <Input
                      value={formData.calibrationStandard}
                      onChange={(e) => updateFormData('calibrationStandard', e.target.value)}
                      placeholder="e.g., ISO/IEC 17025"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Temperature (°C)
                    </label>
                    <Input
                      value={formData.environmentTemp}
                      onChange={(e) => updateFormData('environmentTemp', e.target.value)}
                      placeholder="e.g., 23.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Humidity (%)
                    </label>
                    <Input
                      value={formData.environmentHumidity}
                      onChange={(e) => updateFormData('environmentHumidity', e.target.value)}
                      placeholder="e.g., 45"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      As Found Condition
                    </label>
                    <Input
                      value={formData.asFound}
                      onChange={(e) => updateFormData('asFound', e.target.value)}
                      placeholder="Describe initial condition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      As Left Condition
                    </label>
                    <Input
                      value={formData.asLeft}
                      onChange={(e) => updateFormData('asLeft', e.target.value)}
                      placeholder="Describe final condition"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Pass/Fail Status *
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => updateFormData('passFail', 'pass')}
                        className={`flex-1 py-3 px-6 rounded-lg border-2 font-semibold transition-all ${
                          formData.passFail === 'pass'
                            ? 'bg-green-500 border-green-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-400'
                        }`}
                      >
                        <Check className="h-5 w-5 inline mr-2" />
                        Pass
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFormData('passFail', 'fail')}
                        className={`flex-1 py-3 px-6 rounded-lg border-2 font-semibold transition-all ${
                          formData.passFail === 'fail'
                            ? 'bg-red-500 border-red-600 text-white shadow-lg'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-400'
                        }`}
                      >
                        <AlertCircle className="h-5 w-5 inline mr-2" />
                        Fail
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Notes / Comments
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => updateFormData('notes', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Add any additional notes or observations..."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-slide-in-from-right">
                <div className="flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 rounded">
                  <AlertCircle className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-indigo-900 dark:text-indigo-100">Review & Submit</p>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                      Please review all information before submitting
                    </p>
                  </div>
                </div>

                {/* Equipment Summary */}
                <Card className="bg-gray-50 dark:bg-gray-800 border-2">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-600" />
                      Equipment Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Equipment Name</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.equipmentName || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.equipmentType || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Manufacturer</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.manufacturer || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Serial Number</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.serialNumber || '-'}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Client Summary */}
                <Card className="bg-gray-50 dark:bg-gray-800 border-2">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      Client Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Client Name</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.clientName || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Contact Person</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.contactPerson || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.email || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.phone || '-'}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Calibration Summary */}
                <Card className="bg-gray-50 dark:bg-gray-800 border-2">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-green-600" />
                      Calibration Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Calibration Date</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.calibrationDate || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Technician</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.technician || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.environmentTemp ? `${formData.environmentTemp}°C` : '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Humidity</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.environmentHumidity ? `${formData.environmentHumidity}%` : '-'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Result</p>
                        {formData.passFail && (
                          <Badge 
                            variant={formData.passFail === 'pass' ? 'success' : 'danger'}
                            className="mt-1 text-sm font-semibold"
                          >
                            {formData.passFail === 'pass' ? '✓ PASS' : '✗ FAIL'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                Step {currentStep} of {STEPS.length}
              </div>

              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={!isStepComplete(currentStep)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Submit & Generate Certificate
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
