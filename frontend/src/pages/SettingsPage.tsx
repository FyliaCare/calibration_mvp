import { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Shield, 
  Bell, 
  Monitor, 
  Database, 
  Plug, 
  Save,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Check,
  AlertTriangle,
  Key,
  Smartphone,
  Wifi,
  Server
} from 'lucide-react';

type SettingsSection = 'general' | 'security' | 'notifications' | 'system' | 'data' | 'integrations';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [showPassword, setShowPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // General Settings State
  const [organizationName, setOrganizationName] = useState('Precision Calibration Labs');
  const [organizationEmail, setOrganizationEmail] = useState('info@precisioncal.com');
  const [organizationPhone, setOrganizationPhone] = useState('+1 (555) 123-4567');
  const [organizationAddress, setOrganizationAddress] = useState('123 Industrial Blvd, Suite 200');
  const [organizationCity, setOrganizationCity] = useState('San Francisco');
  const [organizationState, setOrganizationState] = useState('CA');
  const [organizationZip, setOrganizationZip] = useState('94103');
  const [organizationWebsite, setOrganizationWebsite] = useState('www.precisioncal.com');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [currency, setCurrency] = useState('USD');

  // Calibration Settings State
  const [defaultCalibrationInterval, setDefaultCalibrationInterval] = useState('12');
  const [autoGenerateCertificates, setAutoGenerateCertificates] = useState(true);
  const [requireApproval, setRequireApproval] = useState(true);
  const [defaultLocation, setDefaultLocation] = useState('in-lab');
  const [defaultTemperature, setDefaultTemperature] = useState('22');
  const [defaultHumidity, setDefaultHumidity] = useState('45');

  // Security Settings State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordExpiry, setPasswordExpiry] = useState('90');
  const [minPasswordLength, setMinPasswordLength] = useState('8');
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState('5');

  // Notification Settings State
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notifyCalibrationDue, setNotifyCalibrationDue] = useState(true);
  const [notifyCalibrationComplete, setNotifyCalibrationComplete] = useState(true);
  const [notifyEquipmentIssues, setNotifyEquipmentIssues] = useState(true);
  const [notifyNewClient, setNotifyNewClient] = useState(false);
  const [notifyJobAssigned, setNotifyJobAssigned] = useState(true);
  const [dueDateReminder, setDueDateReminder] = useState('7');

  // System Settings State
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [pageSize, setPageSize] = useState('10');

  // Data & Privacy Settings State
  const [dataRetention, setDataRetention] = useState('7');
  const [anonymizeData, setAnonymizeData] = useState(false);
  const [allowDataExport, setAllowDataExport] = useState(true);

  // Integration Settings State
  const [apiEnabled, setApiEnabled] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [apiKey, setApiKey] = useState('pk_live_xxxxxxxxxxxxxxxxxxxxxxxx');

  const handleSave = () => {
    console.log('Saving settings...');
    // TODO: Implement settings save
    setHasChanges(false);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      console.log('Resetting settings...');
      // TODO: Implement settings reset
      setHasChanges(false);
    }
  };

  const handleExportBackup = () => {
    console.log('Exporting backup...');
    // TODO: Implement backup export
    alert('Backup export started. You will receive an email when ready.');
  };

  const handleImportBackup = () => {
    console.log('Importing backup...');
    // TODO: Implement backup import
    alert('Please select a backup file to import.');
  };

  const handleGenerateApiKey = () => {
    const newKey = 'pk_live_' + Math.random().toString(36).substr(2, 24);
    setApiKey(newKey);
    setHasChanges(true);
  };

  const sections = [
    { id: 'general' as SettingsSection, name: 'General', icon: Building2 },
    { id: 'security' as SettingsSection, name: 'Security', icon: Shield },
    { id: 'notifications' as SettingsSection, name: 'Notifications', icon: Bell },
    { id: 'system' as SettingsSection, name: 'System', icon: Monitor },
    { id: 'data' as SettingsSection, name: 'Data & Privacy', icon: Database },
    { id: 'integrations' as SettingsSection, name: 'Integrations', icon: Plug },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Settings className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your application preferences and configuration</p>
          </div>
        </div>
      </div>

      {/* Save Banner */}
      {hasChanges && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span className="text-sm text-yellow-800">You have unsaved changes</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setHasChanges(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{section.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            
            {/* General Settings */}
            {activeSection === 'general' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>
                
                {/* Organization Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-indigo-600" />
                    Organization Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        value={organizationName}
                        onChange={(e) => { setOrganizationName(e.target.value); setHasChanges(true); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={organizationEmail}
                          onChange={(e) => { setOrganizationEmail(e.target.value); setHasChanges(true); }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={organizationPhone}
                          onChange={(e) => { setOrganizationPhone(e.target.value); setHasChanges(true); }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Address
                      </label>
                      <input
                        type="text"
                        value={organizationAddress}
                        onChange={(e) => { setOrganizationAddress(e.target.value); setHasChanges(true); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={organizationCity}
                          onChange={(e) => { setOrganizationCity(e.target.value); setHasChanges(true); }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          value={organizationState}
                          onChange={(e) => { setOrganizationState(e.target.value); setHasChanges(true); }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          value={organizationZip}
                          onChange={(e) => { setOrganizationZip(e.target.value); setHasChanges(true); }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        Website
                      </label>
                      <input
                        type="url"
                        value={organizationWebsite}
                        onChange={(e) => { setOrganizationWebsite(e.target.value); setHasChanges(true); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Regional Settings */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-indigo-600" />
                    Regional Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Timezone
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => { setTimezone(e.target.value); setHasChanges(true); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => { setCurrency(e.target.value); setHasChanges(true); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD ($)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Date Format
                      </label>
                      <select
                        value={dateFormat}
                        onChange={(e) => { setDateFormat(e.target.value); setHasChanges(true); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Time Format
                      </label>
                      <select
                        value={timeFormat}
                        onChange={(e) => { setTimeFormat(e.target.value); setHasChanges(true); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="12h">12-hour (AM/PM)</option>
                        <option value="24h">24-hour</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Calibration Defaults */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Calibration Defaults</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Calibration Interval (months)
                      </label>
                      <input
                        type="number"
                        value={defaultCalibrationInterval}
                        onChange={(e) => { setDefaultCalibrationInterval(e.target.value); setHasChanges(true); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Location</label>
                      <select
                        value={defaultLocation}
                        onChange={(e) => { setDefaultLocation(e.target.value); setHasChanges(true); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="in-lab">In-Lab</option>
                        <option value="on-site">On-Site</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Temperature (°C)
                      </label>
                      <input
                        type="number"
                        value={defaultTemperature}
                        onChange={(e) => { setDefaultTemperature(e.target.value); setHasChanges(true); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Humidity (%)
                      </label>
                      <input
                        type="number"
                        value={defaultHumidity}
                        onChange={(e) => { setDefaultHumidity(e.target.value); setHasChanges(true); }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={autoGenerateCertificates}
                          onChange={(e) => { setAutoGenerateCertificates(e.target.checked); setHasChanges(true); }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Auto-generate certificates upon completion</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={requireApproval}
                          onChange={(e) => { setRequireApproval(e.target.checked); setHasChanges(true); }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Require supervisor approval for certificates</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
                
                {/* Authentication */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-indigo-600" />
                    Authentication
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={twoFactorEnabled}
                          onChange={(e) => { setTwoFactorEnabled(e.target.checked); setHasChanges(true); }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={sessionTimeout}
                          onChange={(e) => { setSessionTimeout(e.target.value); setHasChanges(true); }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          value={loginAttempts}
                          onChange={(e) => { setLoginAttempts(e.target.value); setHasChanges(true); }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Policy */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Key className="h-5 w-5 text-indigo-600" />
                    Password Policy
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Minimum Password Length
                        </label>
                        <input
                          type="number"
                          value={minPasswordLength}
                          onChange={(e) => { setMinPasswordLength(e.target.value); setHasChanges(true); }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password Expiry (days)
                        </label>
                        <input
                          type="number"
                          value={passwordExpiry}
                          onChange={(e) => { setPasswordExpiry(e.target.value); setHasChanges(true); }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={requireSpecialChars}
                        onChange={(e) => { setRequireSpecialChars(e.target.checked); setHasChanges(true); }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Require special characters in passwords</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSection === 'notifications' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                
                {/* Notification Channels */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Email Notifications</div>
                          <div className="text-sm text-gray-600">Receive notifications via email</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => { setEmailNotifications(e.target.checked); setHasChanges(true); }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">SMS Notifications</div>
                          <div className="text-sm text-gray-600">Receive text message alerts</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={smsNotifications}
                        onChange={(e) => { setSmsNotifications(e.target.checked); setHasChanges(true); }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-900">Push Notifications</div>
                          <div className="text-sm text-gray-600">Browser and mobile push notifications</div>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={(e) => { setPushNotifications(e.target.checked); setHasChanges(true); }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                      />
                    </label>
                  </div>
                </div>

                {/* Event Notifications */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Notifications</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notifyCalibrationDue}
                        onChange={(e) => { setNotifyCalibrationDue(e.target.checked); setHasChanges(true); }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Calibration due reminders</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notifyCalibrationComplete}
                        onChange={(e) => { setNotifyCalibrationComplete(e.target.checked); setHasChanges(true); }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Calibration completion</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notifyEquipmentIssues}
                        onChange={(e) => { setNotifyEquipmentIssues(e.target.checked); setHasChanges(true); }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Equipment issues and failures</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notifyNewClient}
                        onChange={(e) => { setNotifyNewClient(e.target.checked); setHasChanges(true); }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">New client registrations</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={notifyJobAssigned}
                        onChange={(e) => { setNotifyJobAssigned(e.target.checked); setHasChanges(true); }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Job assignments</span>
                    </label>
                  </div>
                </div>

                {/* Reminder Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Reminder Settings</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calibration Due Date Reminder (days before)
                    </label>
                    <input
                      type="number"
                      value={dueDateReminder}
                      onChange={(e) => { setDueDateReminder(e.target.value); setHasChanges(true); }}
                      className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-sm text-gray-600">
                      Send reminders {dueDateReminder} days before calibration is due
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeSection === 'system' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">System Settings</h2>
                
                {/* Backup & Restore */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Database className="h-5 w-5 text-indigo-600" />
                    Backup & Restore
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Automatic Backups</h4>
                        <p className="text-sm text-gray-600">Automatically backup data on schedule</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoBackup}
                          onChange={(e) => { setAutoBackup(e.target.checked); setHasChanges(true); }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    {autoBackup && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                        <select
                          value={backupFrequency}
                          onChange={(e) => { setBackupFrequency(e.target.value); setHasChanges(true); }}
                          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="hourly">Hourly</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={handleExportBackup}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export Backup
                      </button>
                      <button
                        onClick={handleImportBackup}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Import Backup
                      </button>
                    </div>
                  </div>
                </div>

                {/* Display Settings */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-indigo-600" />
                    Display Settings
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Items Per Page</label>
                    <select
                      value={pageSize}
                      onChange={(e) => { setPageSize(e.target.value); setHasChanges(true); }}
                      className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>

                {/* Advanced Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Maintenance Mode</div>
                        <div className="text-sm text-gray-600">Disable public access for maintenance</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={maintenanceMode}
                        onChange={(e) => { setMaintenanceMode(e.target.checked); setHasChanges(true); }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Debug Mode</div>
                        <div className="text-sm text-gray-600">Enable detailed error logging</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={debugMode}
                        onChange={(e) => { setDebugMode(e.target.checked); setHasChanges(true); }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Data & Privacy Settings */}
            {activeSection === 'data' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Data & Privacy Settings</h2>
                
                {/* Data Retention */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Retention</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Retain Data For (years)
                      </label>
                      <input
                        type="number"
                        value={dataRetention}
                        onChange={(e) => { setDataRetention(e.target.value); setHasChanges(true); }}
                        className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-600">
                        Automatically delete records older than {dataRetention} years
                      </p>
                    </div>

                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={anonymizeData}
                        onChange={(e) => { setAnonymizeData(e.target.checked); setHasChanges(true); }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Anonymize data before deletion</span>
                    </label>
                  </div>
                </div>

                {/* Privacy Controls */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Controls</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Allow Data Export</div>
                        <div className="text-sm text-gray-600">Users can export their personal data</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={allowDataExport}
                        onChange={(e) => { setAllowDataExport(e.target.checked); setHasChanges(true); }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-5 w-5"
                      />
                    </label>
                  </div>
                </div>

                {/* Data Management */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => alert('Export all data functionality coming soon')}
                      className="w-full md:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export All Data
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete all calibration data? This action cannot be undone.')) {
                          alert('Delete all data functionality requires admin confirmation');
                        }
                      }}
                      className="w-full md:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete All Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Integration Settings */}
            {activeSection === 'integrations' && (
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Integration Settings</h2>
                
                {/* API Settings */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Server className="h-5 w-5 text-indigo-600" />
                    API Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">API Access</h4>
                        <p className="text-sm text-gray-600">Enable API access for third-party integrations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={apiEnabled}
                          onChange={(e) => { setApiEnabled(e.target.checked); setHasChanges(true); }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    {apiEnabled && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={apiKey}
                                readOnly
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
                              />
                              <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            <button
                              onClick={handleGenerateApiKey}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                              <RefreshCw className="h-4 w-4" />
                              Regenerate
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            Keep your API key secure. Never share it publicly.
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            API Documentation
                          </label>
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
                          >
                            View API Documentation
                            <Globe className="h-4 w-4" />
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Webhook Settings */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Wifi className="h-5 w-5 text-indigo-600" />
                    Webhooks
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                      <input
                        type="url"
                        value={webhookUrl}
                        onChange={(e) => { setWebhookUrl(e.target.value); setHasChanges(true); }}
                        placeholder="https://your-server.com/webhook"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-sm text-gray-600">
                        Receive real-time notifications about events
                      </p>
                    </div>

                    <button
                      onClick={() => alert('Testing webhook...')}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Test Webhook
                    </button>
                  </div>
                </div>

                {/* Connected Services */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Connected Services</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Email Service</div>
                          <div className="text-sm text-gray-600">SendGrid • Connected</div>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded">
                        Disconnect
                      </button>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Database className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Cloud Storage</div>
                          <div className="text-sm text-gray-600">Not connected</div>
                        </div>
                      </div>
                      <button className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t border-gray-200 px-6 py-4 flex justify-between">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset to Defaults
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
