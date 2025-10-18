// Global state
let userData = null;
let metricsChart = null;

// Authentication check
function checkAuth() {
  const token = localStorage.getItem('auth_token');
  if (!token) {
console.error('No authentication token found');
console.log('Available keys:', Object.keys(localStorage));
setTimeout(() => {
  window.location.href = 'login.html';
}, 100);
return false;
  }
  console.log('âœ… Auth token found');
  return true;
}

// Load cached profile data
function loadCachedProfile() {
  try {
const cache = localStorage.getItem('profile_cache');
if (!cache) return null;
const { data, timestamp } = JSON.parse(cache);
// Cache valid for 6 hours
if (Date.now() - timestamp > 6 * 60 * 60 * 1000) return null;
return data;
  } catch {
return null;
  }
}

// Save profile to cache
function cacheProfile(data) {
  try {
localStorage.setItem('profile_cache', JSON.stringify({
  data,
  timestamp: Date.now()
}));
  } catch (err) {
console.error('Cache error:', err);
  }
}

// Load user profile
async function loadUserProfile() {
  try {
const token = localStorage.getItem('auth_token');
if (!token) {
  console.error('No token available');
  return;
}

console.log('Loading profile data...');
const response = await fetch('/api/user/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});

if (!response.ok) {
  if (response.status === 401) {
    console.error('Unauthorized - redirecting to login');
    localStorage.removeItem('auth_token');
    window.location.href = 'login.html';
    return;
  }
  throw new Error('Failed to load profile');
}

const data = await response.json();
console.log('Profile loaded:', data);
userData = data;
populateProfile(data);
cacheProfile(data);
calculateCompletion(data);
  } catch (error) {
console.error('Profile load error:', error);
showToast('Failed to load profile', 'error');
  }
}

// Populate profile data
function populateProfile(data) {
  // Header
  document.getElementById('profileName').textContent = data.fullName || 'User';
  document.getElementById('profileRole').textContent = data.jobTitle || data.role || 'Employee';
  document.getElementById('profileEmail').textContent = data.email || '';

  // Avatar
  if (data.avatarUrl) {
document.getElementById('profileAvatar').src = data.avatarUrl;
  }

  // Stats
  document.getElementById('statWorksheets').textContent = '0'; // Will be updated by metrics
  document.getElementById('statCertificates').textContent = '0';
  if (data.createdAt) {
const years = Math.floor((Date.now() - new Date(data.createdAt)) / (365.25 * 24 * 60 * 60 * 1000));
document.getElementById('statMemberSince').textContent = years > 0 ? `${years} yr${years > 1 ? 's' : ''}` : 'New';
  }

  // Personal Info
  document.getElementById('viewFullName').textContent = data.fullName || '-';
  document.getElementById('viewJobTitle').textContent = data.jobTitle || '-';
  document.getElementById('viewDepartment').textContent = data.department || '-';
  document.getElementById('viewPhone').textContent = data.phone || '-';
  document.getElementById('viewEmployeeId').textContent = data.employeeId || '-';

  // Company Info
  document.getElementById('viewCompanyName').textContent = data.companyName || '-';
  document.getElementById('viewLocation').textContent = data.location || '-';
  document.getElementById('viewLabCode').textContent = data.labCode || '-';
  document.getElementById('viewAddress').textContent = data.address || '-';

  // Form fields
  document.getElementById('editFullName').value = data.fullName || '';
  document.getElementById('editJobTitle').value = data.jobTitle || '';
  document.getElementById('editDepartment').value = data.department || '';
  document.getElementById('editPhone').value = data.phone || '';
  document.getElementById('editCompanyName').value = data.companyName || '';
  document.getElementById('editLocation').value = data.location || '';
  document.getElementById('editLabCode').value = data.labCode || '';
  document.getElementById('editAddress').value = data.address || '';

  // Last login
  if (data.lastLogin) {
const date = new Date(data.lastLogin);
document.getElementById('lastLoginTime').textContent = date.toLocaleString();
  }
}

// Calculate profile completion
function calculateCompletion(data) {
  const fields = ['fullName', 'jobTitle', 'department', 'phone', 'employeeId', 
              'companyName', 'location', 'labCode', 'address'];
  const filled = fields.filter(f => data[f] && String(data[f]).trim().length > 0).length;
  const percentage = Math.round((filled / fields.length) * 100);

  document.getElementById('completionPercent').textContent = `${percentage}%`;
  document.getElementById('completionFill').style.width = `${percentage}%`;

  // Show tips for missing fields
  const missing = fields.filter(f => !data[f] || String(data[f]).trim().length === 0);
  const tips = missing.slice(0, 3).map(f => {
const label = f.replace(/([A-Z])/g, ' $1').toLowerCase();
return `<li>Add your ${label}</li>`;
  });
  
  document.getElementById('completionTips').innerHTML = 
tips.length > 0 ? tips.join('') : '<li>âœ“ Profile is complete!</li>';
}

// Toggle edit mode
function toggleEdit(section) {
  const viewDiv = document.getElementById(`${section}View`);
  const editDiv = document.getElementById(`${section}Edit`);
  
  if (editDiv.style.display === 'none') {
viewDiv.style.display = 'none';
editDiv.style.display = 'block';
  } else {
viewDiv.style.display = 'block';
editDiv.style.display = 'none';
  }
}

// Handle personal form submit
document.getElementById('personalForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
fullName: document.getElementById('editFullName').value,
jobTitle: document.getElementById('editJobTitle').value,
department: document.getElementById('editDepartment').value,
phone: document.getElementById('editPhone').value
  };

  try {
const token = localStorage.getItem('auth_token');
const response = await fetch('/api/user/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(formData)
});

if (!response.ok) throw new Error('Update failed');

const data = await response.json();
userData = data;
populateProfile(data);
cacheProfile(data);
calculateCompletion(data);
toggleEdit('personal');
showToast('Personal information updated!', 'success');
  } catch (error) {
console.error('Update error:', error);
showToast('Failed to update information', 'error');
  }
});

// Handle company form submit
document.getElementById('companyForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = {
companyName: document.getElementById('editCompanyName').value,
location: document.getElementById('editLocation').value,
labCode: document.getElementById('editLabCode').value,
address: document.getElementById('editAddress').value
  };

  try {
const token = localStorage.getItem('auth_token');
const response = await fetch('/api/user/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(formData)
});

if (!response.ok) throw new Error('Update failed');

const data = await response.json();
userData = data;
populateProfile(data);
cacheProfile(data);
calculateCompletion(data);
toggleEdit('company');
showToast('Company information updated!', 'success');
  } catch (error) {
console.error('Update error:', error);
showToast('Failed to update information', 'error');
  }
});

// Handle avatar upload
document.getElementById('avatarInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file
  if (!file.type.startsWith('image/')) {
showToast('Please select an image file', 'error');
return;
  }

  if (file.size > 2 * 1024 * 1024) {
showToast('Image must be less than 2MB', 'error');
return;
  }

  // Show preview immediately
  const reader = new FileReader();
  reader.onload = (e) => {
document.getElementById('profileAvatar').src = e.target.result;
  };
  reader.readAsDataURL(file);

  // Upload to server
  try {
const formData = new FormData();
formData.append('avatar', file);

const token = localStorage.getItem('auth_token');
const response = await fetch('/api/user/avatar', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});

if (!response.ok) throw new Error('Upload failed');

const data = await response.json();
document.getElementById('profileAvatar').src = data.avatarUrl;
showToast('Avatar updated!', 'success');

// Update cache
if (userData) {
  userData.avatarUrl = data.avatarUrl;
  cacheProfile(userData);
}
  } catch (error) {
console.error('Upload error:', error);
showToast('Failed to upload avatar', 'error');
// Reload original if upload failed
if (userData && userData.avatarUrl) {
  document.getElementById('profileAvatar').src = userData.avatarUrl;
}
  }
});

// Load activity
async function loadActivity() {
  try {
const token = localStorage.getItem('auth_token');
const response = await fetch('/api/user/activity?limit=10', {
  headers: { 'Authorization': `Bearer ${token}` }
});

if (!response.ok) throw new Error('Failed to load activity');

const { activities } = await response.json();

const listHtml = activities.map(activity => {
  const icon = getActivityIcon(activity.action);
  const time = new Date(activity.created_at).toLocaleString();
  const title = formatActivityTitle(activity.action);
  
  return `
    <div class="activity-item">
      <div class="activity-icon">
        <i class="fas ${icon}"></i>
      </div>
      <div class="activity-content">
        <div class="activity-title">${title}</div>
        <div class="activity-time">${time}</div>
      </div>
    </div>
  `;
}).join('');

document.getElementById('activityList').innerHTML = listHtml || '<p style="text-align:center;color:#888;">No recent activity</p>';
  } catch (error) {
console.error('Activity load error:', error);
document.getElementById('activityList').innerHTML = '<p style="text-align:center;color:#888;">Failed to load activity</p>';
  }
}

// Get activity icon
function getActivityIcon(action) {
  if (/LOGIN/i.test(action)) return 'fa-sign-in-alt';
  if (/LOGOUT/i.test(action)) return 'fa-sign-out-alt';
  if (/PROFILE/i.test(action)) return 'fa-user-edit';
  if (/AVATAR/i.test(action)) return 'fa-image';
  if (/PASSWORD/i.test(action)) return 'fa-key';
  if (/WORKSHEET/i.test(action)) return 'fa-file-alt';
  if (/CERTIFICATE/i.test(action)) return 'fa-certificate';
  if (/EQUIPMENT/i.test(action)) return 'fa-tools';
  return 'fa-circle';
}

// Format activity title
function formatActivityTitle(action) {
  return action.replace(/_/g, ' ').toLowerCase()
.split(' ')
.map(word => word.charAt(0).toUpperCase() + word.slice(1))
.join(' ');
}

// Load metrics
async function loadMetrics() {
  try {
const token = localStorage.getItem('auth_token');
const response = await fetch('/api/user/metrics', {
  headers: { 'Authorization': `Bearer ${token}` }
});

if (!response.ok) throw new Error('Failed to load metrics');

const data = await response.json();

// Update stats
const totalWorksheets = data.worksheets.reduce((a, b) => a + b, 0);
const totalCertificates = data.certificates.reduce((a, b) => a + b, 0);
document.getElementById('statWorksheets').textContent = totalWorksheets;
document.getElementById('statCertificates').textContent = totalCertificates;

// Create chart
const ctx = document.getElementById('metricsChart');
if (metricsChart) {
  metricsChart.destroy();
}

metricsChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: data.labels,
    datasets: [
      {
        label: 'Worksheets',
        data: data.worksheets,
        borderColor: '#4e79a7',
        backgroundColor: 'rgba(78, 121, 167, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Certificates',
        data: data.certificates,
        borderColor: '#f28e2c',
        backgroundColor: 'rgba(242, 142, 44, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Equipment',
        data: data.equipment,
        borderColor: '#59a14f',
        backgroundColor: 'rgba(89, 161, 79, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  }
});
  } catch (error) {
console.error('Metrics load error:', error);
  }
}

// Password modal
function openPasswordModal() {
  document.getElementById('passwordModal').classList.add('active');
}

function closePasswordModal() {
  document.getElementById('passwordModal').classList.remove('active');
  document.getElementById('passwordForm').reset();
}

// Handle password form
document.getElementById('passwordForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const currentPassword = document.getElementById('currentPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  if (newPassword !== confirmPassword) {
showToast('Passwords do not match', 'error');
return;
  }

  // Validate password strength
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(newPassword)) {
showToast('Password does not meet requirements', 'error');
return;
  }

  try {
const token = localStorage.getItem('auth_token');
const response = await fetch('/api/user/change-password', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ currentPassword, newPassword })
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.error || 'Failed to change password');
}

showToast('Password changed successfully!', 'success');
closePasswordModal();
  } catch (error) {
console.error('Password change error:', error);
showToast(error.message, 'error');
  }
});

// Toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  
  toast.className = `toast show ${type}`;
  toastMessage.textContent = message;

  setTimeout(() => {
toast.classList.remove('show');
  }, 3000);
}

// Logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
localStorage.removeItem('auth_token');
localStorage.removeItem('user');
localStorage.removeItem('profile_cache');
window.location.href = 'login.html';
  }
}

// Close modal on outside click
document.getElementById('passwordModal').addEventListener('click', (e) => {
  if (e.target.id === 'passwordModal') {
closePasswordModal();
  }
});

// Initialize
window.addEventListener('DOMContentLoaded', async () => {
  console.log('Profile page initializing...');
  
  // Check auth first
  if (!checkAuth()) {
console.log('Auth check failed, will redirect...');
return;
  }

  console.log('Auth check passed, loading profile...');

  // Show cached data immediately
  const cached = loadCachedProfile();
  if (cached) {
console.log('Found cached profile data');
populateProfile(cached);
calculateCompletion(cached);
  }

  try {
// Load fresh data
await Promise.all([
  loadUserProfile(),
  loadActivity(),
  loadMetrics()
]);
console.log('All data loaded successfully');
  } catch (error) {
console.error('Error loading profile data:', error);
  } finally {
// Hide loading screen
setTimeout(() => {
  document.getElementById('loadingScreen').classList.add('hidden');
}, 500);
  }
});
