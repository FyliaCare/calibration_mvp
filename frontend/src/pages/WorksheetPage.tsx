import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Gauge,
  Thermometer,
  Wrench,
  Ruler,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  FileDown,
  Printer,
  FileText,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

// Worksheet Types
const WORKSHEET_TYPES = [
  {
    id: 'electrical',
    name: 'Electrical',
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    description: 'Multimeters, Clamp Meters, Resistance Standards',
  },
  {
    id: 'pressure',
    name: 'Pressure',
    icon: Gauge,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    description: 'Pressure Gauges, Transmitters, Dead Weight Testers',
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: Thermometer,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    description: 'Temperature Blocks, Thermocouples, RTDs',
  },
  {
    id: 'mechanical',
    name: 'Mechanical',
    icon: Wrench,
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    description: 'Torque Wrenches, Force Gauges, Balances',
  },
  {
    id: 'dimensional',
    name: 'Dimensional',
    icon: Ruler,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    description: 'Calipers, Micrometers, Gauge Blocks, Decade Boxes',
  },
];

// Common interfaces
interface DataPoint {
  id: string;
  setPoint: string;
  uutInternal?: string;
  uutExternal?: string;
  uutRising?: string;
  uutFalling?: string;
  actual: string;
  deviation: string;
  hysteresis?: string;
  reference?: string;
  mean?: string;
}

interface WorksheetData {
  // Certificate Info
  certificateNo: string;
  traceable: string;
  accredited: string;

  // Equipment Under Test (UUT)
  uutDescription: string;
  uutManufacturer: string;
  uutTypeModel: string;
  uutRange: string;
  uutResolution: string;
  uutAccuracy: string;
  uutSerialNo: string;
  uutAssetNo: string;
  jobNo: string;
  dateReceived: string;
  dateCalibrated: string;

  // Standard Equipment
  standardDescription: string;
  standardManufacturer: string;
  standardTypeModel: string;
  standardSerialNo: string;
  standardAssetId: string;

  // Environmental Conditions
  temperatureReceived: string;
  temperatureActual: string;
  humidityReceived: string;
  humidityActual: string;
  atmosphericPressure: string;

  // Customer Information
  customerName: string;
  customerAddress: string;
  customerCity: string;
  customerContact: string;
  customerEmail: string;

  // Remarks
  remarks: string;

  // Calibration Data Points
  dataPoints: DataPoint[];

  // Calibration Results
  passFail: 'pass' | 'fail' | '';
  calibratedBy: string;
  verifiedBy: string;
}

// Mock calibration jobs
const mockJobs = [
  { id: 'JOB-001', title: 'Monthly Pressure Gauge Calibration', client: 'ABC Manufacturing', equipment: 'Pressure Gauge PG-1000', scheduledDate: '2025-10-20' },
  { id: 'JOB-002', title: 'Temperature Sensor Verification', client: 'XYZ Industries', equipment: 'Temperature Sensor TS-550', scheduledDate: '2025-10-19' },
  { id: 'JOB-003', title: 'Multimeter Calibration Service', client: 'Tech Corp', equipment: 'Digital Multimeter DMM-2500', scheduledDate: '2025-10-21' },
];

export default function WorksheetPage() {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [worksheetData, setWorksheetData] = useState<WorksheetData>({
    certificateNo: '',
    traceable: '',
    accredited: '',
    uutDescription: '',
    uutManufacturer: '',
    uutTypeModel: '',
    uutRange: '',
    uutResolution: '',
    uutAccuracy: '',
    uutSerialNo: '',
    uutAssetNo: '',
    jobNo: '',
    dateReceived: '',
    dateCalibrated: '',
    standardDescription: '',
    standardManufacturer: '',
    standardTypeModel: '',
    standardSerialNo: '',
    standardAssetId: '',
    temperatureReceived: '',
    temperatureActual: '',
    humidityReceived: '',
    humidityActual: '',
    atmosphericPressure: '',
    customerName: '',
    customerAddress: '',
    customerCity: '',
    customerContact: '',
    customerEmail: '',
    remarks: '',
    dataPoints: [],
    passFail: '',
    calibratedBy: '',
    verifiedBy: '',
  });

  // Initialize data points based on worksheet type
  const initializeDataPoints = (type: string) => {
    let defaultPoints: DataPoint[] = [];

    switch (type) {
      case 'pressure':
        // Pressure typically has 10-11 points with rising/falling
        defaultPoints = Array.from({ length: 10 }, (_, i) => ({
          id: `point-${i + 1}`,
          setPoint: '',
          uutRising: '',
          uutFalling: '',
          actual: '',
          deviation: '',
          hysteresis: '',
          mean: '',
        }));
        break;

      case 'temperature':
        // Temperature typically has 10 points with internal/external sensors
        defaultPoints = Array.from({ length: 10 }, (_, i) => ({
          id: `point-${i + 1}`,
          setPoint: '',
          uutInternal: '',
          uutExternal: '',
          reference: '',
          actual: '',
          deviation: '',
        }));
        break;

      case 'electrical':
      case 'dimensional':
        // Electrical/Dimensional typically have multiple ranges with 11 points each
        defaultPoints = Array.from({ length: 11 }, (_, i) => ({
          id: `point-${i + 1}`,
          setPoint: '',
          actual: '',
          deviation: '',
        }));
        break;

      case 'mechanical':
        // Mechanical varies, default to 5 points
        defaultPoints = Array.from({ length: 5 }, (_, i) => ({
          id: `point-${i + 1}`,
          setPoint: '',
          actual: '',
          deviation: '',
        }));
        break;

      default:
        defaultPoints = Array.from({ length: 10 }, (_, i) => ({
          id: `point-${i + 1}`,
          setPoint: '',
          actual: '',
          deviation: '',
        }));
    }

    setWorksheetData((prev) => ({ ...prev, dataPoints: defaultPoints }));
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    initializeDataPoints(typeId);
  };

  const handleInputChange = (field: keyof WorksheetData, value: string) => {
    setWorksheetData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDataPointChange = (
    index: number,
    field: keyof DataPoint,
    value: string
  ) => {
    setWorksheetData((prev) => ({
      ...prev,
      dataPoints: prev.dataPoints.map((point, i) =>
        i === index ? { ...point, [field]: value } : point
      ),
    }));
  };

  const addDataPoint = () => {
    const newPoint: DataPoint = {
      id: `point-${worksheetData.dataPoints.length + 1}`,
      setPoint: '',
      actual: '',
      deviation: '',
    };
    setWorksheetData((prev) => ({
      ...prev,
      dataPoints: [...prev.dataPoints, newPoint],
    }));
  };

  const removeDataPoint = (index: number) => {
    setWorksheetData((prev) => ({
      ...prev,
      dataPoints: prev.dataPoints.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    console.log('Saving worksheet:', worksheetData);
    // TODO: Save to backend
    alert('Worksheet saved successfully!');
  };

  const handleExport = () => {
    console.log('Exporting worksheet:', worksheetData);
    // TODO: Generate PDF/Excel export
    alert('Exporting worksheet...');
  };

  const handlePrint = () => {
    window.print();
  };

  // Step 1: Job Selection View
  if (!selectedJob) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Calibration Worksheet
          </h1>
          <p className="text-gray-600 mt-2">
            Select an existing calibration job or create a new one
          </p>
        </div>

        {/* Option: Select Existing Job */}
        <Card className="mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Select Existing Calibration Job
            </h2>
            
            <div className="space-y-3 mb-4">
              {mockJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job.id);
                    setWorksheetData(prev => ({
                      ...prev,
                      jobNo: job.id,
                      customerName: job.client,
                      uutDescription: job.equipment,
                    }));
                  }}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="info">{job.id}</Badge>
                        <span className="font-semibold text-gray-900">{job.title}</span>
                      </div>
                      <p className="text-sm text-gray-600">Client: {job.client}</p>
                      <p className="text-sm text-gray-600">Equipment: {job.equipment}</p>
                      <p className="text-sm text-gray-500">Scheduled: {job.scheduledDate}</p>
                    </div>
                    <ArrowLeft className="h-5 w-5 text-gray-400 transform rotate-180" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Option: Quick Entry (Skip Job Selection) */}
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Quick Entry (No Job Reference)
            </h2>
            <p className="text-gray-600 mb-4">
              Create a worksheet without linking to a calibration job
            </p>
            <Button
              onClick={() => setSelectedJob('quick-entry')}
              variant="outline"
              className="w-full"
            >
              Continue with Quick Entry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Step 2: Type Selection View
  if (!selectedType) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setSelectedJob(null)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job Selection
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Select Equipment Type
          </h1>
          <p className="text-gray-600 mt-2">
            Choose the type of equipment to create a detailed calibration worksheet
          </p>
          {selectedJob !== 'quick-entry' && (
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="info" className="text-sm">
                Job: {worksheetData.jobNo}
              </Badge>
              <span className="text-sm text-gray-600">→ {worksheetData.customerName}</span>
            </div>
          )}
        </div>

        {/* Worksheet Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORKSHEET_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
                onClick={() => handleTypeSelect(type.id)}
              >
                <div className={`w-16 h-16 ${type.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-8 h-8 ${type.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {type.name}
                </h3>
                <p className="text-gray-600 text-sm">{type.description}</p>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Get selected type details
  const selectedTypeData = WORKSHEET_TYPES.find((t) => t.id === selectedType)!;
  const Icon = selectedTypeData.icon;

  // Worksheet Form View
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header with Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setSelectedType(null)}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Change Type
          </button>
          <div className="flex items-center">
            <div className={`w-10 h-10 ${selectedTypeData.bgColor} rounded-lg flex items-center justify-center mr-3`}>
              <Icon className={`w-6 h-6 ${selectedTypeData.color}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedTypeData.name} Calibration Worksheet
              </h1>
              <p className="text-sm text-gray-600">{selectedTypeData.description}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <FileDown className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Worksheet
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Certificate Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            Certificate Information
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificate No.
              </label>
              <Input
                value={worksheetData.certificateNo}
                onChange={(e) => handleInputChange('certificateNo', e.target.value)}
                placeholder="P-..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Traceable (Standard)
              </label>
              <Input
                value={worksheetData.traceable}
                onChange={(e) => handleInputChange('traceable', e.target.value)}
                placeholder="[ Y ]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accredited
              </label>
              <Input
                value={worksheetData.accredited}
                onChange={(e) => handleInputChange('accredited', e.target.value)}
                placeholder="[ ]"
              />
            </div>
          </div>
        </Card>

        {/* Equipment Under Test (UUT) */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Unit Under Test (UUT)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Description
              </label>
              <Input
                value={worksheetData.uutDescription}
                onChange={(e) => handleInputChange('uutDescription', e.target.value)}
                placeholder={
                  selectedType === 'pressure'
                    ? 'Pressure Gauge'
                    : selectedType === 'temperature'
                    ? 'Temp Block Calibrator'
                    : selectedType === 'dimensional'
                    ? 'Resistance / Decade Box'
                    : 'Equipment Description'
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer
              </label>
              <Input
                value={worksheetData.uutManufacturer}
                onChange={(e) => handleInputChange('uutManufacturer', e.target.value)}
                placeholder="Manufacturer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type/Model
              </label>
              <Input
                value={worksheetData.uutTypeModel}
                onChange={(e) => handleInputChange('uutTypeModel', e.target.value)}
                placeholder="Model Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Range
              </label>
              <Input
                value={worksheetData.uutRange}
                onChange={(e) => handleInputChange('uutRange', e.target.value)}
                placeholder={
                  selectedType === 'temperature'
                    ? '°C to °C'
                    : selectedType === 'pressure'
                    ? 'Bar'
                    : 'Range'
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resolution
              </label>
              <Input
                value={worksheetData.uutResolution}
                onChange={(e) => handleInputChange('uutResolution', e.target.value)}
                placeholder={selectedType === 'temperature' ? '°C' : 'Resolution'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accuracy
              </label>
              <Input
                value={worksheetData.uutAccuracy}
                onChange={(e) => handleInputChange('uutAccuracy', e.target.value)}
                placeholder="Accuracy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial No.
              </label>
              <Input
                value={worksheetData.uutSerialNo}
                onChange={(e) => handleInputChange('uutSerialNo', e.target.value)}
                placeholder="Serial Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset No.
              </label>
              <Input
                value={worksheetData.uutAssetNo}
                onChange={(e) => handleInputChange('uutAssetNo', e.target.value)}
                placeholder="Asset/ID No."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job No.
              </label>
              <Input
                value={worksheetData.jobNo}
                onChange={(e) => handleInputChange('jobNo', e.target.value)}
                placeholder="Job Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Received
              </label>
              <Input
                type="date"
                value={worksheetData.dateReceived}
                onChange={(e) => handleInputChange('dateReceived', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Calibrated
              </label>
              <Input
                type="date"
                value={worksheetData.dateCalibrated}
                onChange={(e) => handleInputChange('dateCalibrated', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Standard Equipment */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Standard Equipment
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Equipment Description
              </label>
              <Input
                value={worksheetData.standardDescription}
                onChange={(e) =>
                  handleInputChange('standardDescription', e.target.value)
                }
                placeholder={
                  selectedType === 'pressure'
                    ? 'Dead Weight Pressure Standard/Manometer'
                    : selectedType === 'temperature'
                    ? 'Platinum Resistance Thermometer'
                    : 'Standard Equipment'
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer
              </label>
              <Input
                value={worksheetData.standardManufacturer}
                onChange={(e) =>
                  handleInputChange('standardManufacturer', e.target.value)
                }
                placeholder="Manufacturer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type/Model
              </label>
              <Input
                value={worksheetData.standardTypeModel}
                onChange={(e) =>
                  handleInputChange('standardTypeModel', e.target.value)
                }
                placeholder="Model"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial No.
              </label>
              <Input
                value={worksheetData.standardSerialNo}
                onChange={(e) =>
                  handleInputChange('standardSerialNo', e.target.value)
                }
                placeholder="Serial Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Asset/ID No.
              </label>
              <Input
                value={worksheetData.standardAssetId}
                onChange={(e) =>
                  handleInputChange('standardAssetId', e.target.value)
                }
                placeholder="Asset ID"
              />
            </div>
          </div>
        </Card>

        {/* Environmental Conditions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Environmental Condition
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature (Received) °C
              </label>
              <Input
                value={worksheetData.temperatureReceived}
                onChange={(e) =>
                  handleInputChange('temperatureReceived', e.target.value)
                }
                placeholder="(20±3)°C"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature (Actual) °C
              </label>
              <Input
                value={worksheetData.temperatureActual}
                onChange={(e) =>
                  handleInputChange('temperatureActual', e.target.value)
                }
                placeholder="/ Actual:"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Humidity (Received) %
              </label>
              <Input
                value={worksheetData.humidityReceived}
                onChange={(e) =>
                  handleInputChange('humidityReceived', e.target.value)
                }
                placeholder="(55±20)%"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Humidity (Actual) %
              </label>
              <Input
                value={worksheetData.humidityActual}
                onChange={(e) =>
                  handleInputChange('humidityActual', e.target.value)
                }
                placeholder="/ Actual:"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Atmospheric Pressure
              </label>
              <Input
                value={worksheetData.atmosphericPressure}
                onChange={(e) =>
                  handleInputChange('atmosphericPressure', e.target.value)
                }
                placeholder="N/A or Value"
              />
            </div>
          </div>
        </Card>

        {/* Customer Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Customer Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <Input
                value={worksheetData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                placeholder="Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person
              </label>
              <Input
                value={worksheetData.customerContact}
                onChange={(e) =>
                  handleInputChange('customerContact', e.target.value)
                }
                placeholder="Contact Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                value={worksheetData.customerAddress}
                onChange={(e) =>
                  handleInputChange('customerAddress', e.target.value)
                }
                placeholder="Street Address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <Input
                value={worksheetData.customerCity}
                onChange={(e) => handleInputChange('customerCity', e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tel / Email
              </label>
              <Input
                value={worksheetData.customerEmail}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                placeholder="contact@company.com"
              />
            </div>
          </div>
        </Card>

        {/* Calibration Data Points Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Calibration Data Points
            </h2>
            <Button variant="outline" onClick={addDataPoint}>
              <Plus className="w-4 h-4 mr-2" />
              Add Point
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                    No.
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                    Set Point
                  </th>
                  {selectedType === 'pressure' && (
                    <>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        UUT Pressure Rising / M1
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        UUT Pressure Falling / M2
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        Mean / M (M1+M2)/2
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        Deviation Δp (M - p_ref)
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        Hysteresis (M2-M1)
                      </th>
                    </>
                  )}
                  {selectedType === 'temperature' && (
                    <>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        UUT Internal Sensor
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        UUT External Sensor
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        Reference
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        Deviation
                      </th>
                    </>
                  )}
                  {(selectedType === 'electrical' ||
                    selectedType === 'dimensional' ||
                    selectedType === 'mechanical') && (
                    <>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        UUT Set Point
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        Actual
                      </th>
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                        Deviation
                      </th>
                    </>
                  )}
                  <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {worksheetData.dataPoints.map((point, index) => (
                  <tr key={point.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <Input
                        value={point.setPoint}
                        onChange={(e) =>
                          handleDataPointChange(index, 'setPoint', e.target.value)
                        }
                        className="w-full"
                      />
                    </td>
                    {selectedType === 'pressure' && (
                      <>
                        <td className="border border-gray-300 px-3 py-2">
                          <Input
                            value={point.uutRising || ''}
                            onChange={(e) =>
                              handleDataPointChange(index, 'uutRising', e.target.value)
                            }
                            className="w-full"
                           
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <Input
                            value={point.uutFalling || ''}
                            onChange={(e) =>
                              handleDataPointChange(index, 'uutFalling', e.target.value)
                            }
                            className="w-full"
                           
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <Input
                            value={point.mean || ''}
                            onChange={(e) =>
                              handleDataPointChange(index, 'mean', e.target.value)
                            }
                            className="w-full"
                           
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <Input
                            value={point.deviation}
                            onChange={(e) =>
                              handleDataPointChange(index, 'deviation', e.target.value)
                            }
                            className="w-full"
                           
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <Input
                            value={point.hysteresis || ''}
                            onChange={(e) =>
                              handleDataPointChange(index, 'hysteresis', e.target.value)
                            }
                            className="w-full"
                           
                          />
                        </td>
                      </>
                    )}
                    {selectedType === 'temperature' && (
                      <>
                        <td className="border border-gray-300 px-3 py-2">
                          <Input
                            value={point.uutInternal || ''}
                            onChange={(e) =>
                              handleDataPointChange(index, 'uutInternal', e.target.value)
                            }
                            className="w-full"
                           
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <Input
                            value={point.uutExternal || ''}
                            onChange={(e) =>
                              handleDataPointChange(index, 'uutExternal', e.target.value)
                            }
                            className="w-full"
                           
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <Input
                            value={point.reference || ''}
                            onChange={(e) =>
                              handleDataPointChange(index, 'reference', e.target.value)
                            }
                            className="w-full"
                           
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <Input
                            value={point.deviation}
                            onChange={(e) =>
                              handleDataPointChange(index, 'deviation', e.target.value)
                            }
                            className="w-full"
                           
                          />
                        </td>
                      </>
                    )}
                    {(selectedType === 'electrical' ||
                      selectedType === 'dimensional' ||
                      selectedType === 'mechanical') && (
                      <>
                        <td className="border border-gray-300 px-3 py-2">
                          <Input
                            value={point.actual}
                            onChange={(e) =>
                              handleDataPointChange(index, 'actual', e.target.value)
                            }
                            className="w-full"
                           
                          />
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          <Input
                            value={point.deviation}
                            onChange={(e) =>
                              handleDataPointChange(index, 'deviation', e.target.value)
                            }
                            className="w-full"
                           
                          />
                        </td>
                      </>
                    )}
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <button
                        onClick={() => removeDataPoint(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Loading Error (if applicable) */}
        {(selectedType === 'mechanical' || selectedType === 'electrical') && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Loading Error
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Well
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Well 1
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Well 2
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Well 3
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Well 4
                    </th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                      Well 5
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                      Unloaded
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <Input />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <Input />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <Input />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <Input />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <Input />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-3 py-2 text-sm text-gray-900">
                      Loaded
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <Input />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <Input />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <Input />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <Input />
                    </td>
                    <td className="border border-gray-300 px-3 py-2">
                      <Input />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Remarks & Results */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Remarks & Results
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks
              </label>
              <textarea
                value={worksheetData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any observations, limitations, or notes about the calibration..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pass/Fail Result
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleInputChange('passFail', 'pass')}
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                      worksheetData.passFail === 'pass'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    PASS
                  </button>
                  <button
                    onClick={() => handleInputChange('passFail', 'fail')}
                    className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                      worksheetData.passFail === 'fail'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    FAIL
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calibrated By: F. Atika [ ]
                </label>
                <Input
                  value={worksheetData.calibratedBy}
                  onChange={(e) => handleInputChange('calibratedBy', e.target.value)}
                  placeholder="Technician Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verified By: E. Mensah [ ]
                </label>
                <Input
                  value={worksheetData.verifiedBy}
                  onChange={(e) => handleInputChange('verifiedBy', e.target.value)}
                  placeholder="Verifier Name"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
