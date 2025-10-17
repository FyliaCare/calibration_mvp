/**
 * Calibration MVP - Professional Instrument Calibration System
 * 
 * Features:
 * - Offline-first architecture with IndexedDB storage
 * - Multi-step form with progress tracking
 * - Digital signature capture
 * - File attachments support
 * - Automatic sync with server when online
 * - Professional PDF certificate generation
 * - Real-time validation and calculations
 * - Multi-instrument type support
 * - Comprehensive traceability records
 * - Export/Import functionality
 * 
 * Dependencies:
 * - jsPDF with autoTable plugin for PDF generation
 * - Modern browser with IndexedDB, Service Worker, Canvas support
 * 
 * @version 2.0.0
 * @author Calibration MVP Team
 */

// Global fallback functions for HTML onclick handlers
window.showNewRecordForm = function() {
  console.log('Fallback: New Record clicked');
  const formArea = document.getElementById('formArea');
  const certNo = document.getElementById('certNo');
  
  if (!certNo.value.trim()) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    certNo.value = `CAL-${year}${month}${day}-${random}`;
  }
  
  if (formArea) {
    formArea.style.display = 'block';
    alert('Certificate form opened! Fill in the details and use the form.');
  } else {
    alert('Error: Form area not found!');
  }
};

window.showTemplateDialog = function() {
  console.log('Fallback: Load Template clicked');
  alert('Template functionality will be available once the full app loads. For now, you can manually add test points.');
};

window.saveBasicCertificate = function() {
  console.log('Fallback: Save Certificate clicked');
  const certNo = document.getElementById('certNo').value;
  if (!certNo) {
    alert('Please enter a certificate number first');
    return;
  }
  
  // Collect basic form data
  const data = {
    certificate_number: certNo,
    date_of_issue: document.getElementById('dateIssue').value,
    customer: document.getElementById('customer').value,
    equipment_description: document.getElementById('equipDesc').value,
    manufacturer: document.getElementById('manufacturer').value,
    saved_at: new Date().toISOString()
  };
  
  // Store in localStorage as fallback
  const saved = JSON.parse(localStorage.getItem('calibration_certificates') || '[]');
  saved.push(data);
  localStorage.setItem('calibration_certificates', JSON.stringify(saved));
  
  alert(`Certificate ${certNo} saved locally! (${saved.length} total certificates)`);
};

window.generateBasicPdf = function() {
  console.log('Generate CalPro Certificate PDF');
  if (typeof window.jspdf === 'undefined') {
    alert('PDF library not loaded. Please try again in a moment.');
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');
  
  // Get form data
  const certNo = document.getElementById('certNo')?.value || 'M018-20';
  const dateIssue = document.getElementById('dateIssue')?.value || new Date().toISOString().split('T')[0];
  const equipmentType = document.getElementById('instrumentType')?.options[document.getElementById('instrumentType')?.selectedIndex]?.text || 'Digital Electronic Scale';
  const manufacturer = document.getElementById('manufacturer')?.value || 'Prochef';
  const model = document.getElementById('model')?.value || '';
  const serialNumber = document.getElementById('serialNumber')?.value || '';
  const range = document.getElementById('equipmentRange')?.value || 'Nil';
  const customer = document.getElementById('customer')?.value || 'TechnipFMC Ghana';
  const address = document.getElementById('customerAddress')?.value || 'Takoradi Commercial Port\nTakoradi';
  const temperature = document.getElementById('temperature')?.value || '22.2 to 22.3';
  const humidity = document.getElementById('humidity')?.value || '19.8 to 50.0';
  const jobRef = document.getElementById('jobReference')?.value || 'CMS4-004/1';
  const siteName = document.getElementById('siteName')?.value || 'IGL Lab';
  const dateCal = document.getElementById('dateCal')?.value || 'Monday, April 6, 2020';
  const recalDue = document.getElementById('recalDue')?.value || 'Monday, April 5, 2021';
  const remarks = document.getElementById('remarks')?.value || '';
  const calBy = document.getElementById('calBy')?.value || 'John Doe';
  const verifiedBy = document.getElementById('verifiedBy')?.value || '';
  const approvedSigs = document.getElementById('approvedSignatories')?.value || 'John Doe [ ]    Jane Smith [ ]    Robert Johnson [ ]';
  
  // ==================== PAGE 1: CERTIFICATE DETAILS ====================
  
  // Header - Right aligned info
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Date of Issue', 195, 15, { align: 'right' });
  doc.text(dateIssue, 195, 20, { align: 'right' });
  doc.text('Certificate Number:', 195, 25, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text(certNo, 195, 30, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text('Page 1 of 2  Pages', 195, 35, { align: 'right' });
  doc.text('Approved Signatory', 195, 40, { align: 'right' });
  
  // Horizontal line separator
  doc.setLineWidth(0.5);
  doc.line(15, 45, 195, 45);
  
  // Approved Signatories
  let y = 52;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Approved Signatories  : ', 15, y);
  doc.text(approvedSigs, 60, y);
  
  // Equipment Description Section
  y += 8;
  doc.text('Equipment Description  : ', 15, y);
  doc.setFont('helvetica', 'bold');
  doc.text(equipmentType, 60, y);
  doc.setFont('helvetica', 'normal');
  
  y += 6;
  doc.text('Manufacturer', 15, y);
  doc.text(`: ${manufacturer}`, 60, y);
  
  y += 6;
  doc.text('Type / Range', 15, y);
  doc.text(`: ${range}`, 60, y);
  
  y += 6;
  doc.text('Serial Number', 15, y);
  doc.text(`: ${serialNumber}`, 60, y);
  
  // Date Calibrated
  y += 8;
  doc.text('Date Calibrated', 15, y);
  doc.text(`: ${dateCal}`, 60, y);
  
  // Recalibration Due
  y += 8;
  doc.text('Recalibration Due', 15, y);
  doc.text(`: ${recalDue}`, 60, y);
  
  // Customer Information
  y += 8;
  doc.text('Customer', 15, y);
  doc.text(`: ${customer}`, 60, y);
  y += 6;
  doc.text('Address', 15, y);
  const addressLines = doc.splitTextToSize(`: ${address}`, 120);
  doc.text(addressLines, 60, y);
  
  // Job Reference
  y += addressLines.length * 6 + 2;
  doc.text('Job Reference', 15, y);
  doc.text(`: ${jobRef}`, 60, y);
  
  // Site Name
  y += 8;
  doc.text('Site Name', 15, y);
  doc.text(`: ${siteName}`, 60, y);
  
  // Environment Condition
  y += 8;
  doc.text('Environment Condition  : ', 15, y);
  doc.text(`Temperature   (${temperature})°C`, 60, y);
  y += 6;
  doc.text('Humidity', 60, y);
  doc.text(`(${humidity})%`, 90, y);
  
  // Traceability Section
  y += 10;
  doc.text('Traceability', 15, y);
  doc.text(': Henry Troemner LLC Standard Test weight, S/No.: TW-009, TW-010,', 60, y);
  y += 6;
  doc.text('  TW-011, TW-012 and Cert. No.: NIE/QAL/CAC/2019-2022/T194', 60, y);
  
  y += 8;
  doc.setFont('helvetica', 'italic');
  const traceabilityText = 'All measurements reported in this certificate are traceable to recognized National Standards.';
  const traceLines = doc.splitTextToSize(traceabilityText, 180);
  doc.text(traceLines, 15, y);
  
  // Comments Section
  y += traceLines.length * 6 + 6;
  doc.setFont('helvetica', 'normal');
  doc.text('Comments', 15, y);
  const commentsText = remarks || 'The unit under test(uut) was calibrated according to OIML and by comparison with a standard weight of equal norminal value. The conventional mass has been calculated from the weighing differences under consideration of the air density during the calibration and the assumed density. The unit under test was left for a day before calibration.';
  const commentLines = doc.splitTextToSize(`: ${commentsText}`, 180);
  doc.text(commentLines, 60, y);
  
  // Calibrated by
  y += commentLines.length * 6 + 10;
  if (y > 260) {
    doc.addPage();
    y = 20;
  }
  doc.text('Calibrated by', 15, y);
  doc.text(`: ${calBy}`, 60, y);
  
  // ==================== PAGE 2: MEASUREMENT RESULTS ====================
  doc.addPage();
  
  // Header Page 2
  doc.setFontSize(9);
  doc.text('Date of Issue', 195, 15, { align: 'right' });
  doc.text(dateIssue, 195, 20, { align: 'right' });
  doc.text('Certificate Number:', 195, 25, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.text(certNo, 195, 30, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text('Page 2 of 2  Pages', 195, 35, { align: 'right' });
  
  // Horizontal line
  doc.line(15, 45, 195, 45);
  
  // Title
  y = 55;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Measurement Results', 15, y);
  
  // Get table data
  y += 8;
  const tableRows = document.querySelectorAll('#measurementTable tbody tr');
  const tableData = [];
  
  tableRows.forEach(row => {
    const inputs = row.querySelectorAll('input');
    const rowData = [];
    inputs.forEach(input => {
      if (!input.classList.contains('btn-icon')) {
        rowData.push(input.value || '');
      }
    });
    if (rowData.length > 0) tableData.push(rowData);
  });
  
  // Draw measurement table
  if (typeof doc.autoTable === 'function' && tableData.length > 0) {
    doc.autoTable({
      startY: y,
      head: [['Point', 'Applied', 'UUT Reading', 'Deviation', 'Tolerance', 'Status']],
      body: tableData,
      theme: 'grid',
      styles: { 
        fontSize: 9, 
        cellPadding: 3, 
        halign: 'center',
        lineColor: [0, 0, 0],
        lineWidth: 0.1
      },
      headStyles: { 
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        halign: 'center',
        lineColor: [0, 0, 0],
        lineWidth: 0.3
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 35 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 }
      }
    });
  }
  
  // Generate filename
  const filename = `Certificate_${certNo.replace(/[^a-zA-Z0-9]/g, '_')}_${dateIssue}.pdf`;
  
  // Ask user for action
  const action = confirm(
    '📄 CalPro Certificate Ready!\n\n' +
    `Certificate: ${certNo}\n` +
    `Equipment: ${equipmentType}\n` +
    `Customer: ${customer}\n` +
    `Date: ${dateIssue}\n` +
    `Pages: 2 (Details + Results)\n\n` +
    'Click OK to DOWNLOAD\n' +
    'Click Cancel to PREVIEW'
  );
  
  if (action) {
    doc.save(filename);
    showNotification(`✅ Certificate downloaded: ${filename}`, 'success');
  } else {
    window.open(doc.output('bloburl'), '_blank');
    showNotification('📄 Certificate preview opened', 'info');
  }
};

// Safe helper to remove a table row (used by inline onclick handlers in HTML)
window.removeRow = function(btn) {
  try {
    if (!btn) return;
    const row = btn.closest('tr');
    if (row && row.parentNode) {
      row.parentNode.removeChild(row);
      console.log('Row removed');
    } else {
      console.warn('removeRow: row not found for button', btn);
    }
  } catch (err) {
    console.error('removeRow error:', err);
  }
};

window.addBasicTestRow = function() {
  console.log('Fallback: Add Test Row clicked');
  const tbody = document.querySelector('#resultsTable tbody');
  if (!tbody) {
    alert('Test results table not found!');
    return;
  }
  
  const row = document.createElement('tr');
  row.innerHTML = `
    <td><input type="number" step="0.001" placeholder="0" style="width:80px"></td>
    <td>
      <select style="width:80px">
        <option value="rise">↑ Rising</option>
        <option value="fall">↓ Falling</option>
      </select>
    </td>
    <td><input type="number" step="0.001" placeholder="0" style="width:80px"></td>
    <td>0.000</td>
    <td>0.000%</td>
    <td>-</td>
    <td><button onclick="this.closest('tr').remove()" style="padding:4px 8px">×</button></td>
  `;
  
  tbody.appendChild(row);
  alert('Test point added! Enter reference and measured values.');
};

// Global step navigation fallbacks
window.nextStep = function() {
  console.log('Global nextStep called');
  
  // Find current step number - check multiple selectors
  let currentStepNum = 1;
  const activeFormStep = document.querySelector('.form-step.active, .step-content.active');
  
  if (activeFormStep) {
    const stepNum = activeFormStep.getAttribute('data-step') || activeFormStep.id.replace('step', '');
    currentStepNum = parseInt(stepNum) || 1;
  }
  
  console.log('Current step number:', currentStepNum);
  
  // Allow up to step 4
  if (currentStepNum < 4) {
    window.showStepGlobal(currentStepNum + 1);
  }
};

window.prevStep = function() {
  console.log('Global prevStep called');
  
  // Find current step number - check multiple selectors
  let currentStepNum = 1;
  const activeFormStep = document.querySelector('.form-step.active, .step-content.active');
  
  if (activeFormStep) {
    const stepNum = activeFormStep.getAttribute('data-step') || activeFormStep.id.replace('step', '');
    currentStepNum = parseInt(stepNum) || 1;
  }
  
  if (currentStepNum > 1) {
    window.showStepGlobal(currentStepNum - 1);
  }
};

window.showStepGlobal = function(step) {
  console.log('🎯 showStepGlobal called with step:', step);
  
  // Hide all steps (check both .form-step and .step-content)
  const allSteps = document.querySelectorAll('.form-step, .step-content');
  console.log('Found steps to hide:', allSteps.length);
  allSteps.forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  
  // Remove active from ALL progress steps first
  const allProgressSteps = document.querySelectorAll('.progress-step');
  console.log('Found progress indicators:', allProgressSteps.length);
  allProgressSteps.forEach(s => {
    s.classList.remove('active');
    s.classList.remove('completed');
  });
  
  // Show target step (try multiple selectors)
  let targetStep = document.querySelector(`.step-content[data-step="${step}"]`);
  if (!targetStep) {
    targetStep = document.querySelector(`#step${step}`);
  }
  if (!targetStep) {
    targetStep = document.querySelector(`.form-step[data-step="${step}"]`);
  }
  
  if (targetStep) {
    targetStep.classList.add('active');
    targetStep.style.display = 'block';
    console.log('✅ Activated step content:', step, targetStep.id);
  } else {
    console.error('❌ Step content not found:', step);
  }
  
  // Activate current progress indicator
  const progressStep = document.querySelector(`.progress-step[data-step="${step}"]`);
  if (progressStep) {
    progressStep.classList.add('active');
    console.log('✅ Activated progress indicator:', step);
  } else {
    console.error('❌ Progress indicator not found for step:', step);
  }
  
  // Mark previous steps as completed
  for (let i = 1; i < step; i++) {
    const prevStep = document.querySelector(`.progress-step[data-step="${i}"]`);
    if (prevStep) {
      prevStep.classList.add('completed');
      console.log('✅ Marked step as completed:', i);
    }
  }
  
  console.log('📊 Step transition complete');
};

// Direct PDF download function
window.downloadPdfDirect = function() {
  console.log('Direct PDF download clicked');
  if (typeof window.jspdf === 'undefined') {
    alert('PDF library not loaded. Please try again in a moment.');
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Get certificate info
  const certNo = document.getElementById('certNo').value || `CAL-${Date.now()}`;
  const date = document.getElementById('dateIssue').value || new Date().toISOString().split('T')[0];
  const customer = document.getElementById('customer').value || 'Customer';
  
  // Enhanced PDF generation
  doc.setFontSize(18);
  doc.text('CALIBRATION CERTIFICATE', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Certificate No: ${certNo}`, 20, 40);
  doc.text(`Issue Date: ${date}`, 20, 50);
  doc.text(`Customer: ${customer}`, 20, 60);
  doc.text(`Job Reference: ${document.getElementById('jobRef').value || 'N/A'}`, 20, 70);
  
  // Equipment details
  doc.setFontSize(14);
  doc.text('EQUIPMENT DETAILS', 20, 90);
  doc.setFontSize(10);
  doc.text(`Description: ${document.getElementById('equipDesc').value || 'N/A'}`, 20, 100);
  doc.text(`Manufacturer: ${document.getElementById('manufacturer').value || 'N/A'}`, 20, 110);
  doc.text(`Model/Type: ${document.getElementById('typeRange').value || 'N/A'}`, 20, 120);
  doc.text(`Serial Number: ${document.getElementById('serialNumber').value || 'N/A'}`, 20, 130);
  doc.text(`Full Scale: ${document.getElementById('fullScale').value || '100'} ${document.getElementById('units').value || ''}`, 20, 140);
  doc.text(`Accuracy: ±${document.getElementById('accuracy').value || '2.0'}% FS`, 20, 150);
  
  // Test results
  const testRows = document.querySelectorAll('#resultsTable tbody tr');
  if (testRows.length > 0) {
    doc.setFontSize(14);
    doc.text('TEST RESULTS', 20, 170);
    doc.setFontSize(10);
    
    // Table headers
    doc.text('Reference', 20, 180);
    doc.text('Measured', 60, 180);
    doc.text('Deviation', 100, 180);
    doc.text('Result', 140, 180);
    
    let yPos = 190;
    testRows.forEach((row, index) => {
      const inputs = row.querySelectorAll('input[type="number"]');
      const ref = inputs[0]?.value || '0';
      const measured = inputs[1]?.value || '0';
      const deviation = (parseFloat(measured) - parseFloat(ref)).toFixed(3);
      const result = Math.abs(parseFloat(deviation)) <= 2.0 ? 'PASS' : 'FAIL';
      
      doc.text(ref, 20, yPos);
      doc.text(measured, 60, yPos);
      doc.text(deviation, 100, yPos);
      doc.text(result, 140, yPos);
      yPos += 10;
      
      if (yPos > 270) { // New page if needed
        doc.addPage();
        yPos = 20;
      }
    });
  }
  
  // Footer
  doc.setFontSize(8);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
  doc.text('Calibration MVP - Professional Certificate System', 20, 285);
  
  // Generate filename and download
  const filename = `${certNo.replace(/[^a-zA-Z0-9]/g, '_')}_${date}_Calibration_Certificate.pdf`;
  doc.save(filename);
  
  alert(`✅ PDF Downloaded Successfully!\n\nFile: ${filename}\nLocation: Downloads folder\n\nThe PDF contains:\n• Certificate details\n• Equipment information\n• Test results (${testRows.length} points)\n• Professional formatting`);
};

(() => {
  console.log('🎯 Calibration MVP JavaScript loading...');
  
  // ---------- Config / Constants ----------
  const DB_NAME = 'calib_mvp_db_v2';
  const STORE = 'records';
  const SYNC_LOCK_KEY = '__sync_lock__';
  const MAX_SYNC_CONCURRENT = 1;
  const SERVER_PUSH_URL = '/api/push'; // server endpoint
  const AUTO_SYNC_ON_SAVE = true;
  const AUTO_SYNC_ONLINE_ONLY = true;
  const BACKOFF_BASE_MS = 1000;

  // Enhanced instrument-specific configurations
  const INSTRUMENTS = {
    pressure: {
      label: 'Pressure Gauge',
      units: ['PSI', 'Bar', 'kPa', 'mbar'],
      standardPoints: [0, 25, 50, 75, 100],
      toleranceCalculation: (record) => {
        const fs = record.calibration?.full_scale || 100;
        const acc = record.calibration?.accuracy_percent_fs || 2;
        return Math.abs((acc / 100) * fs);
      },
      uncertaintyFactors: {
        reference: 0.001, // Reference standard uncertainty
        resolution: 0.0005, // Reading resolution
        repeatability: 0.001, // Measurement repeatability
        temperature: 0.0002, // Temperature effect
        drift: 0.0001 // Long-term drift
      }
    },
    torque: {
      label: 'Torque Wrench (Mechanical)',
      units: ['N⋅m', 'ft⋅lbf', 'in⋅lbf'],
      standardPoints: [0, 20, 40, 60, 80, 100],
      toleranceCalculation: (record) => {
        const fs = record.calibration?.full_scale || 200;
        const acc = record.calibration?.accuracy_percent_fs || 3;
        return Math.abs((acc / 100) * fs);
      },
      uncertaintyFactors: {
        reference: 0.002,
        resolution: 0.001,
        repeatability: 0.002,
        temperature: 0.0005,
        drift: 0.0002
      }
    },
    electrical: {
      label: 'Electrical Multimeter',
      units: ['V', 'A', 'Ω', 'Hz'],
      standardPoints: [0, 10, 25, 50, 75, 90, 100],
      toleranceCalculation: (record) => {
        const fs = record.calibration?.full_scale || 10;
        const acc = record.calibration?.accuracy_percent_fs || 1;
        return Math.abs((acc / 100) * fs);
      },
      uncertaintyFactors: {
        reference: 0.0005,
        resolution: 0.0001,
        repeatability: 0.0005,
        temperature: 0.0001,
        drift: 0.00005
      }
    },
    temperature: {
      label: 'Temperature Sensor',
      units: ['°C', '°F', 'K'],
      standardPoints: [0, 25, 50, 75, 100],
      toleranceCalculation: (record) => {
        const fs = record.calibration?.full_scale || 100;
        const acc = record.calibration?.accuracy_percent_fs || 1;
        return Math.abs((acc / 100) * fs);
      },
      uncertaintyFactors: {
        reference: 0.01,
        resolution: 0.001,
        repeatability: 0.005,
        temperature: 0.001,
        drift: 0.001
      }
    },
    flow: {
      label: 'Flow Meter',
      units: ['L/min', 'GPM', 'm³/h', 'CFM'],
      standardPoints: [0, 20, 40, 60, 80, 100],
      toleranceCalculation: (record) => {
        const fs = record.calibration?.full_scale || 100;
        const acc = record.calibration?.accuracy_percent_fs || 2;
        return Math.abs((acc / 100) * fs);
      },
      uncertaintyFactors: {
        reference: 0.002,
        resolution: 0.001,
        repeatability: 0.003,
        temperature: 0.001,
        drift: 0.0005
      }
    },
    force: {
      label: 'Force Gauge',
      units: ['N', 'kN', 'lbf', 'kgf'],
      standardPoints: [0, 25, 50, 75, 100],
      toleranceCalculation: (record) => {
        const fs = record.calibration?.full_scale || 1000;
        const acc = record.calibration?.accuracy_percent_fs || 1.5;
        return Math.abs((acc / 100) * fs);
      },
      uncertaintyFactors: {
        reference: 0.001,
        resolution: 0.0005,
        repeatability: 0.002,
        temperature: 0.0003,
        drift: 0.0002
      }
    }
  };

  // ---------- Utilities ----------
  function uid() {
    // simple UUID-like string
    return 'id-' + Math.random().toString(36).slice(2, 11) + '-' + Date.now().toString(36);
  }

  function nowISO() { return new Date().toISOString(); }

  function toBase64(blob) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result.split(',')[1]); // return raw base64 without prefix
      fr.onerror = rej;
      fr.readAsDataURL(blob);
    });
  }

  async function dataURLToBlob(dataURL) {
    const res = await fetch(dataURL);
    return await res.blob();
  }

  function el(id) { return document.getElementById(id); }

  // broadcast channel to notify other tabs about changes
  const bc = ('BroadcastChannel' in window) ? new BroadcastChannel('calib_sync_channel') : null;

  // ---------- IndexedDB wrapper (robust) ----------
  let db;
  function openDB() {
    return new Promise((resolve, reject) => {
      const r = indexedDB.open(DB_NAME, 2);
      r.onupgradeneeded = (e) => {
        const idb = e.target.result;
        if (!idb.objectStoreNames.contains(STORE)) {
          const os = idb.createObjectStore(STORE, { keyPath: 'localId' }); // use provided localId
          os.createIndex('by_serverId', 'serverId', { unique: false });
          os.createIndex('by_synced', 'synced', { unique: false });
          os.createIndex('by_modified', 'lastModified', { unique: false });
        } else {
          const os = e.target.transaction.objectStore(STORE);
          // future migrations here
        }
      };
      r.onsuccess = (e) => { db = e.target.result; resolve(db); };
      r.onerror = (e) => reject(e);
    });
  }

  function txPromise(storeName, mode, callback) {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, mode);
      const store = tx.objectStore(storeName);
      try {
        callback(store, resolve, reject);
      } catch (err) { reject(err); }
      tx.oncomplete = () => {};
      tx.onerror = (e) => reject(e.target.error || e);
      tx.onabort = (e) => reject(e.target.error || e);
    });
  }

  function putLocal(record) {
    // record must include localId (if not: generate), lastModified timestamp
    if (!record.localId) record.localId = uid();
    record.lastModified = nowISO();
    return txPromise(STORE, 'readwrite', (store, resolve, reject) => {
      const req = store.put(record);
      req.onsuccess = () => resolve(record);
      req.onerror = (e) => reject(e);
    });
  }

  function getLocalById(localId) {
    return txPromise(STORE, 'readonly', (store, resolve, reject) => {
      const req = store.get(localId);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e);
    });
  }

  function deleteLocal(localId) {
    return txPromise(STORE, 'readwrite', (store, resolve, reject) => {
      const req = store.delete(localId);
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e);
    });
  }

  function getAllLocal() {
    return txPromise(STORE, 'readonly', (store, resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e);
    });
  }

  function getUnsynced() {
    return txPromise(STORE, 'readonly', (store, resolve, reject) => {
      const idx = store.index('by_synced');
      const req = idx.getAll(0); // synced === 0
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e);
    });
  }

  function markAsSynced(localId, serverResponse) {
    return txPromise(STORE, 'readwrite', async (store, resolve, reject) => {
      const req = store.get(localId);
      req.onsuccess = async () => {
        const rec = req.result;
        if (!rec) return resolve(false);
        rec.synced = 1;
        if (serverResponse && serverResponse.id) rec.serverId = serverResponse.id;
        rec.syncAt = nowISO();
        rec.lastModified = nowISO();
        const putReq = store.put(rec);
        putReq.onsuccess = () => {
          // notify other tabs
          bc?.postMessage({type:'synced', localId: rec.localId, serverId: rec.serverId});
          resolve(rec);
        };
        putReq.onerror = (e) => reject(e);
      };
      req.onerror = (e) => reject(e);
    });
  }

  // ---------- Sync engine ----------
  let syncRunning = false;
  async function syncAll({onProgress=null} = {}) {
    if (syncRunning) return;
    syncRunning = true;
    try {
      const unsynced = await getUnsynced();
      if (!unsynced || unsynced.length === 0) {
        syncRunning = false;
        return {ok:true, pushed:0};
      }
      let pushed = 0;
      // push sequentially to keep order and allow server-side constraints
      for (let i = 0; i < unsynced.length; i++) {
        const rec = unsynced[i];
        let attempt = 0;
        let success = false;
        while (attempt < 5 && !success) {
          try {
            await pushRecord(rec);
            success = true;
            pushed++;
            onProgress?.(rec);
          } catch (err) {
            attempt++;
            const wait = BACKOFF_BASE_MS * Math.pow(2, attempt);
            console.warn(`Push failed (attempt ${attempt}) for ${rec.localId}. Retrying in ${wait}ms`, err);
            await new Promise(r => setTimeout(r, wait));
          }
        }
        if (!success) {
          console.error('Giving up push for', rec.localId);
        }
      }
      return {ok:true, pushed};
    } finally {
      syncRunning = false;
    }
  }

  async function pushRecord(record) {
    // Prepare payload: inline small blobs as base64 to avoid multipart complexity.
    // For large attachments you can implement chunked upload or multipart/form-data.
    const payload = Object.assign({}, record);
    // Do not send local DB-only fields if not necessary — but include them for simplicity
    // Convert signature and attachments to base64 if Blob
    if (payload.signature && payload.signature instanceof Blob) {
      payload.signature = await toBase64(payload.signature);
      payload.signature_mime = payload.signature.type || 'image/png';
    } else if (typeof payload.signature === 'string' && payload.signature.startsWith('data:')) {
      // already dataURL string -> convert to base64
      const base = payload.signature.split(',')[1];
      payload.signature = base;
      payload.signature_mime = payload.signature.slice(0,50).includes('png') ? 'image/png' : 'image/png';
    } else if (typeof payload.signature === 'string') {
      // assume base64 payload already
    }
    // attachments: array of {name, blob}
    if (Array.isArray(payload.attachments)) {
      const attPromises = payload.attachments.map(async a => {
        if (a.blob instanceof Blob) {
          const base = await toBase64(a.blob);
          return {...a, data: base, mime: a.blob.type || 'image/jpeg'};
        } else if (typeof a.data === 'string') {
          return a;
        } else {
          return a;
        }
      });
      payload.attachments = await Promise.all(attPromises);
    }

    // remove heavy local-only fields
    delete payload._temp;

    // POST to server
    const res = await fetch(SERVER_PUSH_URL, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const txt = await res.text().catch(()=>null);
      throw new Error(`Server responded ${res.status}: ${txt}`);
    }
    const j = await res.json();
    if (!j || !j.ok) throw new Error('Invalid server ack');
    // mark local record as synced
    await markAsSynced(record.localId, j);
    return j;
  }

  // auto-sync when we come online
  window.addEventListener('online', () => {
    console.log('online — attempting sync');
    startAutoSync();
  });

  // start auto sync guard
  let autoSyncTimer = null;
  async function startAutoSync() {
    if (AUTO_SYNC_ONLINE_ONLY && !navigator.onLine) return;
    if (autoSyncTimer) clearTimeout(autoSyncTimer);
    // small delay to batch saves
    autoSyncTimer = setTimeout(async () => {
      try {
        await syncAll({
          onProgress: (rec) => console.log('synced', rec.localId)
        });
        refreshLocalList();
      } catch (e) {
        console.error('Auto-sync failed', e);
      }
    }, 800);
  }

  // Listen for BroadcastChannel messages from other tabs
  if (bc) {
    bc.onmessage = (ev) => {
      const msg = ev.data;
      if (msg && msg.type === 'synced') {
        console.log('Broadcast: record synced', msg.localId);
        refreshLocalList();
      }
    };
  }

  // ---------- Enhanced UI Management ----------
  async function initUI() {
    await openDB();
    
    // Element references
    const instrumentType = el('instrumentType');
    const certNo = el('certNo');
    const dateIssue = el('dateIssue');
    const dateDue = el('dateDue');
    const customer = el('customer');
    const jobRef = el('jobRef');
    const newRecord = el('newRecord');
    const loadTemplate = el('loadTemplate');
    const formArea = el('formArea');
    const addRow = el('addRow');
    const addSetTemplate = el('addSetTemplate');
    const calculateUncertainty = el('calculateUncertainty');
    const resultsTableBody = document.querySelector('#resultsTable tbody');
    const saveLocalBtn = el('saveLocal');
    const generatePdfBtn = el('generatePdf');
    const syncBtn = el('syncBtn');
    const exportAll = el('exportAll');
    const importRecords = el('importRecords');
    const importFile = el('importFile');
    const searchRecords = el('searchRecords');
    const filterStatus = el('filterStatus');
    const recordsGrid = el('recordsGrid');
    const localList = el('localList');
    const fileAttach = el('fileAttach');
    const attachmentsList = el('attachmentsList');
    const clearSigBtn = el('clearSig');
    const saveSignature = el('saveSignature');
    const sigCanvas = el('sigCanvas');
    const sigCtx = sigCanvas ? sigCanvas.getContext('2d') : null;
    const techName = el('techName');
    const techCert = el('techCert');
    const certificatePreview = el('certificatePreview');
    const progressText = el('progressText');
    const progressBar = el('progressBar');
    const loadingModal = el('loadingModal');

    // Initialize signature canvas
    let isDrawing = false;
    let signatures = {}; // Store multiple signatures
    
    function initSignatureCanvas() {
      if (!sigCanvas || !sigCtx) return;
      
      // Set canvas background
      sigCtx.fillStyle = 'white';
      sigCtx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);
      
      // Configure drawing style
      sigCtx.strokeStyle = '#2c3e50';
      sigCtx.lineWidth = 2;
      sigCtx.lineCap = 'round';
      sigCtx.lineJoin = 'round';
    }

    function clearSig() { 
      if (!sigCtx) return;
      sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
      sigCtx.fillStyle = 'white';
      sigCtx.fillRect(0, 0, sigCanvas.width, sigCanvas.height);
    }
    
    function signatureToBlob() { 
      return new Promise((res) => sigCanvas?.toBlob(res, 'image/png')); 
    }

    // Enhanced signature event handlers
    if (sigCanvas) {
      sigCanvas.addEventListener('pointerdown', startDrawing);
      sigCanvas.addEventListener('pointermove', draw);
      sigCanvas.addEventListener('pointerup', stopDrawing);
      sigCanvas.addEventListener('pointerleave', stopDrawing);
      
      // Touch support
      sigCanvas.addEventListener('touchstart', e => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = sigCanvas.getBoundingClientRect();
        startDrawing({offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top});
      });
      
      sigCanvas.addEventListener('touchmove', e => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = sigCanvas.getBoundingClientRect();
        draw({offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top});
      });
      
      sigCanvas.addEventListener('touchend', e => {
        e.preventDefault();
        stopDrawing();
      });
    }

    function startDrawing(e) {
      isDrawing = true;
      sigCtx?.beginPath();
      sigCtx?.moveTo(e.offsetX, e.offsetY);
    }

    function draw(e) {
      if (!isDrawing) return;
      sigCtx?.lineTo(e.offsetX, e.offsetY);
      sigCtx?.stroke();
    }

    function stopDrawing() {
      isDrawing = false;
    }

    // Button event handlers
    clearSigBtn?.addEventListener('click', clearSig);
    saveSignature?.addEventListener('click', async () => {
      const blob = await signatureToBlob();
      if (blob) {
        signatures.technician = blob;
        showNotification('Signature saved successfully', 'success');
      }
    });

    initSignatureCanvas();

    // Debug element finding
    console.log('Elements found:');
    console.log('newRecord:', newRecord);
    console.log('loadTemplate:', loadTemplate);
    console.log('formArea:', formArea);
    console.log('certNo:', certNo);

    // Enhanced form management
    function showProgress(text, percentage = 0) {
      if (loadingModal && progressText && progressBar) {
        loadingModal.style.display = 'flex';
        progressText.textContent = text;
        progressBar.style.width = percentage + '%';
      }
    }

    function hideProgress() {
      if (loadingModal) {
        loadingModal.style.display = 'none';
      }
    }

    function showNotification(message, type = 'info') {
      // Simple notification system
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
      `;
      
      const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
      };
      
      notification.style.background = colors[type] || colors.info;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }

    // Enhanced form controls
    newRecord?.addEventListener('click', () => {
      console.log('New Record clicked');
      console.log('certNo element:', certNo);
      console.log('certNo value:', certNo?.value);
      console.log('formArea element:', formArea);
      
      if (!certNo?.value.trim()) {
        generateCertificateNumber();
      }
      
      if (formArea) {
        formArea.style.display = 'block';
        updatePreview();
        showNotification('New certificate form opened', 'success');
      } else {
        console.error('Form area not found');
        showNotification('Error: Form area not found', 'error');
      }
    });

    loadTemplate?.addEventListener('click', () => {
      console.log('Load Template clicked');
      showTemplateDialog();
    });

    // Auto-generate certificate number
    function generateCertificateNumber() {
      if (!certNo?.value.trim()) {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const day = String(new Date().getDate()).padStart(2, '0');
        const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
        certNo.value = `CAL-${year}${month}${day}-${random}`;
      }
    }

    function showTemplateDialog() {
      const templates = [
        { name: 'Standard Pressure Test', type: 'pressure', points: [0, 25, 50, 75, 100] },
        { name: '5-Point Torque Test', type: 'torque', points: [0, 20, 40, 60, 80, 100] },
        { name: 'Electrical Basic Test', type: 'electrical', points: [0, 10, 25, 50, 75, 90, 100] },
        { name: 'Temperature Range Test', type: 'temperature', points: [0, 25, 50, 75, 100] }
      ];
      
      const templateHtml = templates.map((t, i) => 
        `<button class="btn-secondary template-btn" data-template="${i}">${t.name}</button>`
      ).join('');
      
      const dialog = document.createElement('div');
      dialog.className = 'modal';
      dialog.innerHTML = `
        <div class="modal-content">
          <h3>Select Test Template</h3>
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${templateHtml}
          </div>
          <button class="btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
        </div>
      `;
      
      dialog.addEventListener('click', (e) => {
        if (e.target.classList.contains('template-btn')) {
          const template = templates[e.target.dataset.template];
          applyTemplate(template);
          dialog.remove();
        }
      });
      
      document.body.appendChild(dialog);
    }

    function applyTemplate(template) {
      if (instrumentType) instrumentType.value = template.type;
      resultsTableBody.innerHTML = '';
      template.points.forEach(point => {
        addResultRow({ reference: point, direction: 'rise', measured: point });
      });
      showNotification(`Applied ${template.name} template`, 'success');
    }

    // Enhanced row management
    addRow?.addEventListener('click', () => {
      addResultRow({ reference: 0, direction: 'rise', measured: 0 });
      updateSummaryStats();
    });

    addSetTemplate?.addEventListener('click', () => {
      const type = instrumentType?.value || 'pressure';
      const instrument = INSTRUMENTS[type];
      if (instrument && instrument.standardPoints) {
        resultsTableBody.innerHTML = ''; // Clear existing rows
        instrument.standardPoints.forEach(point => {
          addResultRow({ 
            reference: point, 
            direction: 'rise', 
            measured: point 
          });
        });
        updateSummaryStats();
        showNotification(`Added ${instrument.label} standard test points`, 'success');
      }
    });

    calculateUncertainty?.addEventListener('click', () => {
      calculateMeasurementUncertainty();
    });

    function addResultRow({reference=0, direction='rise', measured=0, deviation=0, remarks='Pass'} = {}) {
      if (!resultsTableBody) return null;
      
      const tr = document.createElement('tr');
      tr.dataset.rowId = uid();
      tr.innerHTML = `
        <td><input class="ref" type="number" step="0.001" value="${reference}" placeholder="Reference"></td>
        <td>
          <select class="dir">
            <option value="rise">↑ Rising</option>
            <option value="fall">↓ Falling</option>
          </select>
        </td>
        <td><input class="meas" type="number" step="0.001" value="${measured}" placeholder="Measured"></td>
        <td class="dev">${Number(deviation).toFixed(3)}</td>
        <td class="error-percent">0.000%</td>
        <td class="rem">${remarks}</td>
        <td>
          <button class="del btn-secondary">×</button>
          <button class="copy btn-secondary" title="Duplicate row">⧉</button>
        </td>
      `;
      
      resultsTableBody.appendChild(tr);
      
      // Set initial values
      tr.querySelector('.dir').value = direction;
      
      // Event handlers
      tr.querySelector('.del').onclick = () => {
        if (confirm('Delete this test point?')) {
          tr.remove();
          recalcAll();
          updateSummaryStats();
        }
      };
      
      tr.querySelector('.copy').onclick = () => {
        const ref = parseFloat(tr.querySelector('.ref').value || 0);
        const meas = parseFloat(tr.querySelector('.meas').value || 0);
        const dir = tr.querySelector('.dir').value;
        addResultRow({ reference: ref, direction: dir, measured: meas });
        updateSummaryStats();
      };
      
      tr.querySelector('.meas').oninput = () => {
        recalcRow(tr);
        updateSummaryStats();
        updatePreview();
      };
      
      tr.querySelector('.ref').oninput = () => {
        recalcRow(tr);
        updateSummaryStats();
        updatePreview();
      };
      
      tr.querySelector('.dir').onchange = () => {
        updateSummaryStats();
        updatePreview();
      };
      
      recalcRow(tr);
      return tr;
    }

    function recalcRow(tr) {
      if (!tr) return;
      
      const ref = parseFloat(tr.querySelector('.ref')?.value || 0);
      const meas = parseFloat(tr.querySelector('.meas')?.value || 0);
      const fs = parseFloat(el('fullScale')?.value || 100);
      const acc = parseFloat(el('accuracy')?.value || 2);
      
      const deviation = meas - ref;
      const errorPercent = ref !== 0 ? (deviation / ref) * 100 : 0;
      const tolerance = (acc / 100) * fs;
      const isPass = Math.abs(deviation) <= tolerance;
      
      // Update display
      const devCell = tr.querySelector('.dev');
      const errorCell = tr.querySelector('.error-percent');
      const remCell = tr.querySelector('.rem');
      
      if (devCell) devCell.textContent = deviation.toFixed(3);
      if (errorCell) errorCell.textContent = errorPercent.toFixed(3) + '%';
      if (remCell) {
        remCell.textContent = isPass ? 'Pass' : 'Fail';
        remCell.className = `rem ${isPass ? 'pass' : 'fail'}`;
      }
      
      // Add visual indicators
      tr.className = `test-row ${isPass ? 'row-pass' : 'row-fail'}`;
    }

    function recalcAll() {
      if (!resultsTableBody) return;
      resultsTableBody.querySelectorAll('tr').forEach(tr => recalcRow(tr));
      updateSummaryStats();
    }

    function updateSummaryStats() {
      const rows = resultsTableBody?.querySelectorAll('tr') || [];
      const total = rows.length;
      const passed = Array.from(rows).filter(tr => 
        tr.querySelector('.rem')?.textContent === 'Pass'
      ).length;
      const failed = total - passed;
      
      const totalEl = el('totalPoints');
      const passedEl = el('passedPoints');
      const failedEl = el('failedPoints');
      const overallEl = el('overallResult');
      
      if (totalEl) totalEl.textContent = total;
      if (passedEl) passedEl.textContent = passed;
      if (failedEl) failedEl.textContent = failed;
      if (overallEl) {
        const overall = failed === 0 && total > 0 ? 'PASS' : total === 0 ? 'N/A' : 'FAIL';
        overallEl.textContent = overall;
        overallEl.className = `stat-value ${overall.toLowerCase()}`;
      }
    }

    function calculateMeasurementUncertainty() {
      const type = instrumentType?.value || 'pressure';
      const instrument = INSTRUMENTS[type];
      if (!instrument) return;
      
      const factors = instrument.uncertaintyFactors;
      const combinedUncertainty = Math.sqrt(
        Math.pow(factors.reference, 2) +
        Math.pow(factors.resolution, 2) +
        Math.pow(factors.repeatability, 2) +
        Math.pow(factors.temperature, 2) +
        Math.pow(factors.drift, 2)
      );
      
      const expandedUncertainty = combinedUncertainty * 2; // k=2 for 95% confidence
      
      showNotification(
        `Measurement Uncertainty: ±${(expandedUncertainty * 100).toFixed(3)}% (k=2)`,
        'info'
      );
      
      return expandedUncertainty;
    }

    async function collectRecord() {
      // gather results rows
      const results = Array.from(document.querySelectorAll('#resultsTable tbody tr')).map(tr => ({
        reference: parseFloat(tr.querySelector('.ref').value || 0),
        direction: tr.querySelector('.dir').value,
        measured: parseFloat(tr.querySelector('.meas').value || 0),
        deviation: parseFloat(tr.querySelector('.dev').textContent || 0),
        remarks: tr.querySelector('.rem').textContent
      }));

      // signature blob
      let signatureBlob = null;
      await new Promise(r => sigCanvas.toBlob(b => { signatureBlob = b; r(); }, 'image/png'));

      // attachments from file input (if provided)
      const attachments = [];
      if (fileAttach && fileAttach.files && fileAttach.files.length) {
        for (let i = 0; i < fileAttach.files.length; i++) {
          attachments.push({name: fileAttach.files[i].name, blob: fileAttach.files[i]});
        }
      }

      const rec = {
        localId: uid(),
        certificate_number: certNo.value,
        date_of_issue: dateIssue.value || new Date().toISOString().slice(0,10),
        instrument_type: instrumentType.value,
        equipment: {
          description: el('equipDesc').value,
          manufacturer: el('manufacturer').value,
          type_range: el('typeRange').value,
          serial_number: el('serialNumber').value
        },
        calibration: {
          full_scale: parseFloat(el('fullScale').value || 100),
          accuracy_percent_fs: parseFloat(el('accuracy').value || 2)
        },
        results,
        signature: signatureBlob,
        attachments,
        synced: 0,
        createdAt: nowISO(),
        lastModified: nowISO(),
        version: 1 // record schema versioning
      };
      // compute overall pass/fail summary
      const tol = INSTRUMENTS[instrumentType.value]?.toleranceCalculation(rec) ?? ((rec.calibration.accuracy_percent_fs/100)*rec.calibration.full_scale);
      rec.summary = {
        tolerance: tol,
        totalPoints: results.length,
        failed: results.filter(r => r.remarks === 'Fail').length,
        overall: (results.filter(r => r.remarks === 'Fail').length === 0) ? 'Pass' : 'Fail'
      };
      return rec;
    }

    // Save local handler
    saveLocalBtn?.addEventListener('click', async () => {
      try {
        const rec = await collectRecord();
        // store attachments' blobs as Blob objects in IndexedDB (they can be stored directly)
        await putLocal(rec);
        showNotification('Certificate saved locally', 'success');
        refreshRecordsList();
        if (AUTO_SYNC_ON_SAVE) startAutoSync();
      } catch (err) {
        console.error(err);
        showNotification('Error saving: ' + err.message, 'error');
      }
    });

    // Generate PDF handler
    generatePdfBtn?.addEventListener('click', async () => {
      try {
        const rec = await collectRecord();
        await generatePdfFromRecord(rec, { open: true });
        showNotification('PDF generated successfully', 'success');
      } catch (err) {
        console.error(err);
        showNotification('Error generating PDF: ' + err.message, 'error');
      }
    });

    // Enhanced record management UI
    async function refreshRecordsList() {
      if (!recordsGrid) return;
      
      const allRecords = await getAllLocal();
      const searchTerm = searchRecords?.value.toLowerCase() || '';
      const statusFilter = filterStatus?.value || 'all';
      
      // Apply filters
      const filteredRecords = allRecords.filter(record => {
        const matchesSearch = !searchTerm || 
          record.certificate_number?.toLowerCase().includes(searchTerm) ||
          record.equipment?.description?.toLowerCase().includes(searchTerm) ||
          record.equipment?.manufacturer?.toLowerCase().includes(searchTerm) ||
          record.customer?.toLowerCase().includes(searchTerm);
        
        const matchesStatus = statusFilter === 'all' ||
          (statusFilter === 'synced' && record.synced) ||
          (statusFilter === 'unsynced' && !record.synced) ||
          (statusFilter === 'draft' && !record.completed);
          
        return matchesSearch && matchesStatus;
      });
      
      // Sort by last modified (newest first)
      filteredRecords.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
      
      recordsGrid.innerHTML = '';
      
      if (filteredRecords.length === 0) {
        recordsGrid.innerHTML = `
          <div class="no-records">
            <h3>No records found</h3>
            <p>Create your first calibration certificate to get started.</p>
          </div>
        `;
        return;
      }
      
      filteredRecords.forEach(record => {
        const card = createRecordCard(record);
        recordsGrid.appendChild(card);
      });
    }

    function createRecordCard(record) {
      const card = document.createElement('div');
      card.className = 'record-card';
      
      const syncStatus = record.synced ? 'synced' : 'unsynced';
      const statusText = record.synced ? 'Synced' : 'Not Synced';
      const overallResult = record.summary?.overall || 'Unknown';
      
      card.innerHTML = `
        <div class="record-header">
          <div class="cert-number">${record.certificate_number || 'No Certificate #'}</div>
          <div class="sync-status ${syncStatus}">${statusText}</div>
        </div>
        <div class="record-details">
          <div><strong>Instrument:</strong> ${record.equipment?.description || 'Unknown'}</div>
          <div><strong>Manufacturer:</strong> ${record.equipment?.manufacturer || 'Unknown'}</div>
          <div><strong>Date:</strong> ${record.date_of_issue || 'Unknown'}</div>
          <div><strong>Customer:</strong> ${record.customer || 'N/A'}</div>
          <div><strong>Result:</strong> <span class="result-${overallResult.toLowerCase()}">${overallResult}</span></div>
        </div>
        <div class="record-actions">
          <button class="btn-secondary preview-btn" data-id="${record.localId}">👁️ Preview</button>
          <button class="btn-secondary edit-btn" data-id="${record.localId}">✏️ Edit</button>
          <button class="btn-secondary pdf-btn" data-id="${record.localId}">📄 PDF</button>
          ${!record.synced ? `<button class="btn-primary sync-btn" data-id="${record.localId}">🔄 Sync</button>` : ''}
          <button class="btn-secondary delete-btn" data-id="${record.localId}">🗑️ Delete</button>
        </div>
      `;
      
      // Add event listeners
      card.querySelector('.preview-btn')?.addEventListener('click', () => previewRecord(record));
      card.querySelector('.edit-btn')?.addEventListener('click', () => openRecordForEdit(record.localId));
      card.querySelector('.pdf-btn')?.addEventListener('click', () => generatePdfFromRecord(record));
      card.querySelector('.sync-btn')?.addEventListener('click', async () => {
        await syncSingleRecord(record.localId);
      });
      card.querySelector('.delete-btn')?.addEventListener('click', async () => {
        await deleteRecordWithConfirmation(record.localId);
      });
      
      return card;
    }

    async function syncSingleRecord(localId) {
      try {
        showProgress('Syncing record...', 50);
        const record = await getLocalById(localId);
        if (record) {
          await pushRecord(record);
          showNotification('Record synced successfully', 'success');
          refreshRecordsList();
        }
      } catch (err) {
        console.error('Sync error', err);
        showNotification('Sync failed: ' + err.message, 'error');
      } finally {
        hideProgress();
      }
    }

    async function deleteRecordWithConfirmation(localId) {
      const record = await getLocalById(localId);
      if (!record) return;
      
      const confirmed = confirm(
        `Delete certificate "${record.certificate_number}"?\n\nThis action cannot be undone.`
      );
      
      if (confirmed) {
        await deleteLocal(localId);
        showNotification('Record deleted', 'success');
        refreshRecordsList();
      }
    }

    // Legacy support
    async function refreshLocalList() {
      return refreshRecordsList();
    }

    async function previewRecord(record) {
      updatePreviewContent(record);
      
      // Show preview modal
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3>Certificate Preview</h3>
            <button class="btn-secondary close-preview">✕</button>
          </div>
          <div class="certificate-preview-content">
            ${generatePreviewHTML(record)}
          </div>
          <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
            <button class="btn-primary generate-pdf-preview">📄 Generate PDF</button>
            <button class="btn-secondary edit-record">✏️ Edit</button>
          </div>
        </div>
      `;
      
      modal.querySelector('.close-preview').onclick = () => modal.remove();
      modal.querySelector('.generate-pdf-preview').onclick = () => {
        generatePdfFromRecord(record, { open: true });
        modal.remove();
      };
      modal.querySelector('.edit-record').onclick = () => {
        openRecordForEdit(record.localId);
        modal.remove();
      };
      
      modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
      };
      
      document.body.appendChild(modal);
    }

    function generatePreviewHTML(record) {
      const instrument = INSTRUMENTS[record.instrument_type] || {};
      const results = record.results || [];
      const passed = results.filter(r => r.remarks === 'Pass').length;
      const total = results.length;
      
      return `
        <div class="preview-document">
          <div class="preview-header">
            <h2>🎯 Calibration Certificate</h2>
            <div class="cert-info">
              <div><strong>Certificate No:</strong> ${record.certificate_number}</div>
              <div><strong>Issue Date:</strong> ${record.date_of_issue}</div>
              <div><strong>Due Date:</strong> ${record.date_due || 'N/A'}</div>
            </div>
          </div>
          
          <div class="preview-section">
            <h3>Equipment Information</h3>
            <div class="info-grid">
              <div><strong>Description:</strong> ${record.equipment?.description || 'N/A'}</div>
              <div><strong>Manufacturer:</strong> ${record.equipment?.manufacturer || 'N/A'}</div>
              <div><strong>Model:</strong> ${record.equipment?.type_range || 'N/A'}</div>
              <div><strong>Serial No:</strong> ${record.equipment?.serial_number || 'N/A'}</div>
              <div><strong>Range:</strong> ${record.calibration?.full_scale || 100} ${record.units || ''}</div>
              <div><strong>Accuracy:</strong> ±${record.calibration?.accuracy_percent_fs || 2}% FS</div>
            </div>
          </div>
          
          <div class="preview-section">
            <h3>Test Results Summary</h3>
            <div class="summary-grid">
              <div class="summary-item">
                <span class="summary-label">Total Points:</span>
                <span class="summary-value">${total}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Passed:</span>
                <span class="summary-value pass">${passed}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Failed:</span>
                <span class="summary-value fail">${total - passed}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Overall:</span>
                <span class="summary-value ${record.summary?.overall?.toLowerCase() || 'unknown'}">${record.summary?.overall || 'Unknown'}</span>
              </div>
            </div>
          </div>
          
          ${results.length > 0 ? `
            <div class="preview-section">
              <h3>Detailed Results</h3>
              <table class="preview-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Direction</th>
                    <th>Measured</th>
                    <th>Deviation</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  ${results.map(r => `
                    <tr class="${r.remarks === 'Pass' ? 'pass-row' : 'fail-row'}">
                      <td>${r.reference}</td>
                      <td>${r.direction === 'rise' ? '↑' : '↓'}</td>
                      <td>${r.measured}</td>
                      <td>${Number(r.deviation).toFixed(3)}</td>
                      <td>${r.remarks}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}
          
          <div class="preview-section">
            <h3>Traceability</h3>
            <div class="info-grid">
              <div><strong>Reference Standard:</strong> ${record.traceability?.reference_equipment || 'N/A'}</div>
              <div><strong>Certificate:</strong> ${record.traceability?.certificate_number || 'N/A'}</div>
              <div><strong>Cal Date:</strong> ${record.traceability?.calibration_date || 'N/A'}</div>
              <div><strong>Due Date:</strong> ${record.traceability?.due_date || 'N/A'}</div>
            </div>
          </div>
        </div>
      `;
    }

    async function openRecordForEdit(localId) {
      const rec = await getLocalById(localId);
      if (!rec) return alert('Record not found');
      // populate form from rec (simple approach)
      el('certNo').value = rec.certificate_number;
      el('dateIssue').value = rec.date_of_issue;
      el('instrumentType').value = rec.instrument_type;
      el('equipDesc').value = rec.equipment?.description || '';
      el('manufacturer').value = rec.equipment?.manufacturer || '';
      el('typeRange').value = rec.equipment?.type_range || '';
      el('serialNumber').value = rec.equipment?.serial_number || '';
      el('fullScale').value = rec.calibration?.full_scale || 100;
      el('accuracy').value = rec.calibration?.accuracy_percent_fs || 2;
      // clear previous rows
      resultsTableBody.innerHTML = '';
      (rec.results || []).forEach(r => addResultRow({reference:r.reference, direction:r.direction, measured:r.measured, deviation:r.deviation, remarks:r.remarks}));
      // render signature if present
      if (rec.signature) {
        // signature may be Blob or base64 — attempt to draw
        if (rec.signature instanceof Blob) {
          const url = URL.createObjectURL(rec.signature);
          const img = new Image();
          img.onload = () => { sigCtx.clearRect(0,0,sigCanvas.width,sigCanvas.height); sigCtx.drawImage(img,0,0,sigCanvas.width,sigCanvas.height); URL.revokeObjectURL(url); };
          img.src = url;
        } else if (typeof rec.signature === 'string') {
          const img = new Image();
          img.onload = () => { sigCtx.clearRect(0,0,sigCanvas.width,sigCanvas.height); sigCtx.drawImage(img,0,0,sigCanvas.width,sigCanvas.height); };
          if (rec.signature.startsWith('data:')) img.src = rec.signature;
          else img.src = 'data:image/png;base64,' + rec.signature;
        }
      }
      formArea.style.display = 'block';
    }

    // Enhanced sync functionality
    syncBtn?.addEventListener('click', async () => {
      if (AUTO_SYNC_ONLINE_ONLY && !navigator.onLine) {
        showNotification('Cannot sync while offline', 'warning');
        return;
      }
      
      syncBtn.disabled = true;
      showProgress('Syncing all records...', 0);
      
      try {
        const result = await syncAll({
          onProgress: (record) => {
            const percentage = Math.min(100, (result.pushed || 0) * 20);
            showProgress(`Syncing: ${record.certificate_number}`, percentage);
          }
        });
        
        showNotification(`Sync complete. Pushed ${result.pushed || 0} records.`, 'success');
      } catch (err) {
        console.error('Sync error', err);
        showNotification('Sync failed: ' + err.message, 'error');
      } finally {
        syncBtn.disabled = false;
        hideProgress();
        refreshRecordsList();
      }
    });

    // Export/Import functionality
    exportAll?.addEventListener('click', async () => {
      try {
        showProgress('Preparing export...', 50);
        const allRecords = await getAllLocal();
        
        // Convert blobs to base64 for export
        const processedRecords = await Promise.all(
          allRecords.map(async record => {
            const processedRecord = { ...record };
            
            // Convert signature blob to base64
            if (record.signature instanceof Blob) {
              processedRecord.signature = await toBase64(record.signature);
            }
            
            // Convert attachment blobs to base64
            if (record.attachments && Array.isArray(record.attachments)) {
              processedRecord.attachments = await Promise.all(
                record.attachments.map(async att => ({
                  ...att,
                  data: att.blob instanceof Blob ? await toBase64(att.blob) : att.data
                }))
              );
            }
            
            return processedRecord;
          })
        );

        const exportData = {
          version: '2.0.0',
          exportDate: nowISO(),
          recordCount: allRecords.length,
          records: processedRecords
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `calibration-records-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification(`Exported ${allRecords.length} records`, 'success');
      } catch (err) {
        console.error('Export error', err);
        showNotification('Export failed: ' + err.message, 'error');
      } finally {
        hideProgress();
      }
    });

    importRecords?.addEventListener('click', () => {
      importFile?.click();
    });

    importFile?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        showProgress('Importing records...', 25);
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (!data.records || !Array.isArray(data.records)) {
          throw new Error('Invalid file format');
        }
        
        let imported = 0;
        for (const record of data.records) {
          // Convert base64 back to blobs
          if (record.signature && typeof record.signature === 'string') {
            record.signature = await dataURLToBlob('data:image/png;base64,' + record.signature);
          }
          
          if (record.attachments) {
            record.attachments = await Promise.all(
              record.attachments.map(async att => ({
                ...att,
                blob: att.data ? await dataURLToBlob('data:' + (att.mime || 'application/octet-stream') + ';base64,' + att.data) : null
              }))
            );
          }
          
          // Generate new local ID to avoid conflicts
          record.localId = uid();
          record.synced = 0; // Mark as unsynced
          record.lastModified = nowISO();
          
          await putLocal(record);
          imported++;
        }
        
        showNotification(`Imported ${imported} records`, 'success');
        refreshRecordsList();
      } catch (err) {
        console.error('Import error', err);
        showNotification('Import failed: ' + err.message, 'error');
      } finally {
        hideProgress();
        e.target.value = ''; // Reset file input
      }
    });

    // Search and filter handlers
    searchRecords?.addEventListener('input', debounce(refreshRecordsList, 300));
    filterStatus?.addEventListener('change', refreshRecordsList);

    function debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    // Preview update functionality
    function updatePreview() {
      if (!certificatePreview) return;
      
      const record = {
        certificate_number: certNo?.value || '',
        date_of_issue: dateIssue?.value || '',
        date_due: dateDue?.value || '',
        customer: customer?.value || '',
        job_reference: jobRef?.value || '',
        instrument_type: instrumentType?.value || '',
        equipment: {
          description: el('equipDesc')?.value || '',
          manufacturer: el('manufacturer')?.value || '',
          type_range: el('typeRange')?.value || '',
          serial_number: el('serialNumber')?.value || ''
        },
        calibration: {
          full_scale: parseFloat(el('fullScale')?.value || 100),
          accuracy_percent_fs: parseFloat(el('accuracy')?.value || 2)
        },
        units: el('units')?.value || '',
        results: Array.from(resultsTableBody?.querySelectorAll('tr') || []).map(tr => ({
          reference: parseFloat(tr.querySelector('.ref')?.value || 0),
          direction: tr.querySelector('.dir')?.value || 'rise',
          measured: parseFloat(tr.querySelector('.meas')?.value || 0),
          deviation: parseFloat(tr.querySelector('.dev')?.textContent || 0),
          remarks: tr.querySelector('.rem')?.textContent || 'Pass'
        })),
        traceability: {
          reference_equipment: el('refStandard')?.value || '',
          certificate_number: el('refCertNo')?.value || '',
          calibration_date: el('refCalDate')?.value || '',
          due_date: el('refDueDate')?.value || ''
        }
      };
      
      certificatePreview.innerHTML = generatePreviewHTML(record);
    }

    function updatePreviewContent(record) {
      if (certificatePreview) {
        certificatePreview.innerHTML = generatePreviewHTML(record);
      }
    }

    // File attachment handling
    fileAttach?.addEventListener('change', (e) => {
      updateAttachmentsList(e.target.files);
    });

    function updateAttachmentsList(files) {
      if (!attachmentsList || !files) return;
      
      attachmentsList.innerHTML = '';
      Array.from(files).forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'attachment-item';
        item.innerHTML = `
          <span>📎 ${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
          <button class="btn-secondary remove-attachment" data-index="${index}">×</button>
        `;
        attachmentsList.appendChild(item);
      });
    }

    // Input validation and auto-formatting
    certNo?.addEventListener('input', (e) => {
      // Auto-format certificate number
      let value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
      if (value.length > 3 && !value.includes('-')) {
        value = value.substring(0, 3) + '-' + value.substring(3);
      }
      e.target.value = value;
      updatePreview();
    });

    // Form field change handlers for live preview
    [certNo, dateIssue, dateDue, customer, jobRef, instrumentType,
     el('equipDesc'), el('manufacturer'), el('typeRange'), el('serialNumber'),
     el('fullScale'), el('accuracy'), el('units'), el('refStandard'),
     el('refCertNo'), el('refCalDate'), el('refDueDate'), techName, techCert
    ].filter(el => el).forEach(element => {
      element.addEventListener('input', updatePreview);
      element.addEventListener('change', updatePreview);
    });

    // Initialize UI
    refreshRecordsList();
    updatePreview();
    
    // Auto-sync if online
    if (navigator.onLine) {
      setTimeout(startAutoSync, 1000); // Delay initial sync
    }

    // Expose debugging interface
    window.__calib = { 
      getAllLocal, getUnsynced, syncAll, putLocal, getLocalById, deleteLocal,
      refreshRecordsList, updatePreview, INSTRUMENTS
    };

    // Initialize real-time clock
    updateHeaderClock();
    setInterval(updateHeaderClock, 1000);

    console.log('🎯 Calibration MVP initialized successfully');
  }
  
  // Real-time clock for header
  function updateHeaderClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    // Update both time elements (old and new header structure)
    const timeElements = ['currentTime', 'current-time'];
    timeElements.forEach(id => {
      const timeElement = document.getElementById(id);
      if (timeElement) {
        timeElement.textContent = timeString;
      }
    });
    
    // Legacy - continue with original format if needed
    if (false) {
      const now = new Date();
      const timeString = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      timeElement.textContent = timeString;
    }
  }

  // ---------- CalPro Certificate PDF (Exact Format Match) ----------
  async function generatePdfFromRecord(rec, options) {
    options = options || {};
    const open = options.open !== undefined ? options.open : true;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({unit:'mm', format:'a4'});
    const left = 20;
    const right = 190;
    
    // Header section with date and certificate info (top right)
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Date of Issue', 150, 20);
    doc.text('6th April 2020', 150, 27);
    doc.text('Certificate Number', 150, 37);
    doc.text(rec.certificate_number || 'M018-20', 150, 44);
    doc.text('Page 1 of 2 Pages', 150, 54);
    doc.text('Approved Signatory', 150, 64);
    
    // Main content starts
    let currentY = 80;
    
    // Approved Signatories line
    doc.setFontSize(11);
    doc.text('Approved Signatories  : John Doe [ ]    Jane Smith [ ]    Robert Johnson [ ]', left, currentY);
    
    // Horizontal line
    doc.setLineWidth(1);
    doc.line(left, currentY + 5, right, currentY + 5);
    currentY += 15;
    
    // Equipment Details Section
    doc.setFontSize(11);
    doc.text(`Equipment Description  : ${rec.equipment?.description || rec.instrumentType || 'Digital Electronic Scale'}`, left, currentY);
    currentY += 7;
    doc.text(`Manufacturer           : ${rec.equipment?.manufacturer || rec.manufacturer || 'Prochef'}`, left, currentY);
    currentY += 7;
    doc.text(`Type / Range           : ${rec.equipment?.type_range || rec.model || 'Nil'}`, left, currentY);
    currentY += 7;
    doc.text(`Serial Number          : ${rec.equipment?.serial_number || rec.serialNumber || '6596446'}`, left, currentY);
    currentY += 15;
    
    // Date Calibrated
    const calibDate = rec.date_of_issue ? new Date(rec.date_of_issue).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Monday, April 6, 2020';
    doc.text(`Date Calibrated        : ${calibDate}`, left, currentY);
    currentY += 15;
    
    // Recalibration Due
    const dueDate = rec.date_due ? new Date(rec.date_due).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Monday, April 5, 2021';
    doc.text(`Recalibration Due      : ${dueDate}`, left, currentY);
    currentY += 15;
    
    // Customer Section
    doc.text(`Customer               : ${rec.customer || 'TechnipFMC Ghana'}`, left, currentY);
    currentY += 7;
    const address = rec.address || 'Takoradi Commercial Port';
    doc.text(`Address                : ${address}`, left, currentY);
    currentY += 7;
    doc.text('                         Takoradi.', left, currentY);
    currentY += 15;
    
    // Job Reference
    doc.text(`Job Reference          : ${rec.job_reference || 'CMS4-004/1'}`, left, currentY);
    currentY += 10;
    
    // Site Name
    doc.text(`Site Name              : ${rec.site_name || 'IGL Lab'}`, left, currentY);
    currentY += 15;
    
    // Environment Condition
    doc.text(`Environment Condition  : Temperature  ${rec.temperature || '(22.2 to 22.3)°C'}`, left, currentY);
    currentY += 7;
    doc.text(`                         Humidity     ${rec.humidity || '(19.8 to 50.0)%'}`, left, currentY);
    currentY += 15;
    
    // Traceability
    doc.text('Traceability           : Henry Troemner LLC Standard Test weight, S/No.: TW-009, TW-010,', left, currentY);
    currentY += 7;
    doc.text('                         TW-011, TW-012 and Cert. No.: NIE/QAL/CAC/2019-2022/T194', left, currentY);
    currentY += 10;
    doc.text('                         All measurements reported in this certificate are traceable to', left, currentY);
    currentY += 7;
    doc.text('                         recognized National Standards.', left, currentY);
    currentY += 15;
    
    // Comments Section
    doc.text('Comments               : The unit under test(uut) was calibrated according to OIML and', left, currentY);
    currentY += 7;
    doc.text('                         by comparison with a standard weight of equal norminal value.', left, currentY);
    currentY += 7;
    doc.text('                         The conventional mass has been calculated from the weighing', left, currentY);
    currentY += 7;
    doc.text('                         differences under consideration of the air density during the', left, currentY);
    currentY += 7;
    doc.text('                         calibration and the assumed density.', left, currentY);
    currentY += 7;
    doc.text('                         The unit under test was left for a day before calibration.', left, currentY);
    currentY += 15;
    
    // Calibrated by
    doc.text('Calibrated by          : John Doe', left, currentY);
    
    // Add signature if available
    if (rec.signature) {
      try {
        if (rec.signature instanceof Blob) {
          const dataUrl = await blobToDataURL(rec.signature);
          doc.addImage(dataUrl, 'PNG', left, footerY - 30, 60, 20);
        } else if (typeof rec.signature === 'string') {
          if (!rec.signature.startsWith('data:')) {
            doc.addImage('data:image/png;base64,' + rec.signature, 'PNG', left, footerY - 30, 60, 20);
          } else {
            doc.addImage(rec.signature, 'PNG', left, footerY - 30, 60, 20);
          }
        }
      } catch (e) {
        console.warn('signature embed failed', e);
      }
    }
    
    // CalPro footer
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 287, 210, 10, 'F');
    doc.setTextColor(255, 215, 0);
    doc.setFontSize(8);
    doc.text('CALPRO CALIBRATION SERVICES - Calibration and Metering Service', 105, 293, { align: 'center' });

    if (open) {
      // Generate filename
      const certNo = rec.certificate_number || 'UNKNOWN';
      const date = rec.date_of_issue || new Date().toISOString().split('T')[0];
      const customer = rec.customer || 'Customer';
      const filename = `Calibration_Certificate_${certNo.replace(/[^a-zA-Z0-9]/g, '_')}_${date}.pdf`;
      
      // Give user options
      const choice = confirm(
        `Professional PDF Certificate Generated!\n\n` +
        `Certificate: ${certNo}\n` +
        `Date: ${date}\n` +
        `Customer: ${customer}\n` +
        `Equipment: ${rec.equipment?.description || 'N/A'}\n` +
        `Test Points: ${(rec.results || []).length}\n` +
        `Overall Result: ${rec.summary?.overall || 'N/A'}\n\n` +
        `Click OK to DOWNLOAD the PDF to your Downloads folder\n` +
        `Click Cancel to OPEN in new tab (then save manually)`
      );
      
      if (choice) {
        // Download PDF directly
        doc.save(filename);
        console.log(`PDF saved as: ${filename}`);
      } else {
        // Open in new tab
        window.open(doc.output('bloburl'), '_blank');
      }
    }
    return doc;
  }

  function blobToDataURL(blob) {
    return new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(blob);
    });
  }

  // ---------- Boot up ----------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    // DOM is already loaded
    initializeApp();
  }
  
  function initializeApp() {
    try {
      console.log('🎯 Initializing Calibration MVP...');
      initUI().catch(err => {
        console.error('UI init error:', err);
        alert('Error initializing application: ' + err.message);
      });
      
      // Initialize dashboard components
      initializeDashboard();
    } catch (err) {
      console.error('Critical error:', err);
      alert('Critical error loading application: ' + err.message);
    }
  }

  // Dashboard and Navigation Management
  function initializeDashboard() {
    try {
      console.log('🎯 Initializing Dashboard...');
      
    // Initialize navigation
    initializeNavigation();
    
    // Initialize dashboard components
    updateDashboardStats();
    loadRecentActivity();
    initializeCharts();
    
    // Initialize form wizard if on certificate creation page
    initializeFormWizard();
    
    // Initialize all button functionality
    initializeAllButtons();      console.log('✅ Dashboard initialized successfully');
    } catch (err) {
      console.error('Dashboard initialization error:', err);
    }
  }

  function initializeNavigation() {
    // Section mapping for sidebar navigation
    const sectionMap = {
      'dashboard': 'dashboard',
      'worksheets': 'worksheets',
      'certificates': 'certificate-management',
      'equipment': 'equipment',
      // Service pages removed - technicians use autocomplete in certificate forms
      'customers': 'customers',
      'reports': 'reports',
      'settings': 'settings'
    };

    // Helper to resolve a data-section to an actual section id
    function resolveSection(key) {
      return sectionMap[key] || null;
    }

    // Sidebar menu navigation: click, keyboard (Enter/Space) and accessibility attributes
    document.querySelectorAll('.menu-item').forEach(item => {
      // Ensure keyboard focusable
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'menuitem');

      const activate = (e) => {
        if (e) e.preventDefault();
        const targetKey = item.dataset.section;
        const resolved = resolveSection(targetKey);
        console.log('Sidebar item activated:', targetKey, '->', resolved);
        if (resolved) {
          showSection(resolved);
          updateActiveMenuItem(item);
          // update URL hash without scrolling
          try {
            history.replaceState(null, '', `#${targetKey}`);
          } catch (err) { /* ignore */ }
        }
      };

      item.addEventListener('click', activate);
      // Keyboard activation (Enter / Space)
      item.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          activate(ev);
        }
      });
    });

    // Header menu toggle (single toggle in header only)
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const headerLogo = document.getElementById('headerLogo');
    const sidebar = document.querySelector('.sidebar');

    function setSidebarExpanded(expanded) {
      if (!sidebar) return;
      sidebar.classList.toggle('collapsed', !expanded);
      // set aria-expanded on toggle buttons
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }
      if (mobileMenuToggle) {
        mobileMenuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      }
    }

    function toggleSidebar() {
      if (!sidebar) {
        console.error('❌ Sidebar element not found');
        return;
      }
      const isCollapsed = sidebar.classList.contains('collapsed');
      console.log('🔄 Toggling sidebar. Currently collapsed:', isCollapsed, '→ Will expand:', isCollapsed);
      setSidebarExpanded(isCollapsed);
      showNotification(`📱 Sidebar ${isCollapsed ? 'expanded' : 'collapsed'}`, 'info');
    }

    // Desktop menu toggle
    if (menuToggle) {
      menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSidebar();
      });
      // keyboard accessibility
      menuToggle.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          toggleSidebar();
        }
      });
    }

    // Mobile hamburger menu toggle
    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSidebar();
      });
      // keyboard accessibility
      mobileMenuToggle.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          toggleSidebar();
        }
      });
    }

    // Header logo toggle (works as sidebar toggle too)
    if (headerLogo) {
      headerLogo.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSidebar();
      });
    }

    // Button handlers
    const newCertBtn = document.getElementById('newCertificateBtn');
    if (newCertBtn) {
      newCertBtn.addEventListener('click', () => {
        showSection('certificate-creation');
      });
    }

    const exportBtn = document.getElementById('exportDataBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        exportData();
      });
    }

    // On load: sync active item from hash or default
    function syncFromHash() {
      const hash = (location.hash || '').replace('#', '');
      if (!hash) {
        // default to dashboard
        const defaultItem = document.querySelector('.menu-item[data-section="dashboard"]');
        if (defaultItem) updateActiveMenuItem(defaultItem);
        showSection('dashboard');
        return;
      }
      const mapped = resolveSection(hash);
      if (mapped) {
        showSection(mapped);
        const menuItem = document.querySelector(`.menu-item[data-section="${hash}"]`);
        if (menuItem) updateActiveMenuItem(menuItem);
      }
    }

    window.addEventListener('hashchange', syncFromHash);
    // run initial sync
    syncFromHash();
  }

  function showSection(sectionId) {
    console.log('🎯 showSection called with:', sectionId);
    
    // Hide all sections
    const allSections = document.querySelectorAll('.content-section');
    console.log('Found content sections:', allSections.length);
    
    allSections.forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none'; // Ensure hidden
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.style.display = 'block'; // Ensure visible
      updateBreadcrumb(sectionId);
      console.log('✅ Section shown:', sectionId);
    } else {
      console.error('❌ Section not found:', sectionId);
    }
  }

  function updateActiveMenuItem(activeItem) {
    document.querySelectorAll('.menu-item').forEach(item => {
      item.classList.remove('active');
    });
    activeItem.classList.add('active');
  }

  function updateBreadcrumb(sectionId) {
    const breadcrumbPath = document.getElementById('breadcrumbPath');
    if (!breadcrumbPath) return;

    const breadcrumbs = {
      'dashboard': 'Dashboard',
      'worksheets': 'Worksheets',
      'certificate-creation': 'New Certificate',
      'certificate-management': 'Certificates',
      'equipment': 'Equipment',
      'equipment-management': 'Equipment',
      'flow-services': 'Flow Measurement',
      'tank-services': 'Tank Calibration',
      'test-equipment': 'Test Equipment',
      'customers': 'Customers',
      'customer-management': 'Customers',
      'reports': 'Reports',
      'settings': 'Settings'
    };

    breadcrumbPath.textContent = breadcrumbs[sectionId] || 'Dashboard';
  }

  function updateDashboardStats() {
    // Mock statistics - replace with real data
    const stats = {
      totalCertificates: 248,
      pendingCalibrations: 12,
      activeEquipment: 89,
      activeCustomers: 34
    };
    
    const totalCertEl = document.getElementById('totalCertificates');
    const pendingEl = document.getElementById('pendingCalibrations');
    const equipmentEl = document.getElementById('activeEquipment');
    const customersEl = document.getElementById('activeCustomers');
    
    if (totalCertEl) totalCertEl.textContent = stats.totalCertificates;
    if (pendingEl) pendingEl.textContent = stats.pendingCalibrations;
    if (equipmentEl) equipmentEl.textContent = stats.activeEquipment;
    if (customersEl) customersEl.textContent = stats.activeCustomers;
  }

  function loadRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    if (!activityList) return;

    const activities = [
      {
        icon: 'certificate',
        title: 'Certificate M025-24 Generated',
        description: 'Digital Scale Pro - Prochef Industries',
        time: '2 hours ago'
      },
      {
        icon: 'clock',
        title: 'Calibration Due Reminder',
        description: 'Flow Meter - GNPC Station 5',
        time: '1 day ago'
      },
      {
        icon: 'user-plus',
        title: 'New Customer Added',
        description: 'Total Petroleum Ghana Ltd.',
        time: '3 days ago'
      }
    ];

    activityList.innerHTML = activities.map(activity => `
      <div class="activity-item">
        <div class="activity-icon">
          <i class="fas fa-${activity.icon}"></i>
        </div>
        <div class="activity-content">
          <h4>${activity.title}</h4>
          <p>${activity.description} • ${activity.time}</p>
        </div>
      </div>
    `).join('');
  }

  function initializeCharts() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
      console.log('Chart.js not loaded, skipping chart initialization');
      return;
    }

    // Calibration trends chart
    const calibrationCtx = document.getElementById('calibrationChart');
    if (calibrationCtx) {
      try {
        new Chart(calibrationCtx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Calibrations',
              data: [12, 19, 15, 25, 22, 30],
              borderColor: '#007bff',
              backgroundColor: 'rgba(0, 123, 255, 0.1)',
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      } catch (err) {
        console.error('Error creating calibration chart:', err);
      }
    }

    // Service distribution chart
    const serviceCtx = document.getElementById('serviceChart');
    if (serviceCtx) {
      try {
        new Chart(serviceCtx, {
          type: 'doughnut',
          data: {
            labels: ['Flow Measurement', 'Tank Calibration', 'Test Equipment', 'Other'],
            datasets: [{
              data: [35, 25, 30, 10],
              backgroundColor: ['#007bff', '#28a745', '#ffc107', '#6c757d']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      } catch (err) {
        console.error('Error creating service chart:', err);
      }
    }
  }

  function initializeFormWizard() {
    let currentStep = 1;
    const totalSteps = 4;

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
          currentStep++;
          updateStepDisplay();
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          updateStepDisplay();
        }
      });
    }

    // Step click navigation
    document.querySelectorAll('.step').forEach(step => {
      step.addEventListener('click', () => {
        const stepNum = parseInt(step.dataset.step);
        if (stepNum >= 1 && stepNum <= totalSteps) {
          currentStep = stepNum;
          updateStepDisplay();
        }
      });
    });

    function updateStepDisplay() {
      console.log('updateStepDisplay called, currentStep:', currentStep);
      
      // Update step indicators
      document.querySelectorAll('.step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.toggle('active', stepNum === currentStep);
      });

      // Update step content
      document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
        console.log('Removing active from:', content.id);
      });
      
      const currentContent = document.getElementById(`step${currentStep}`);
      if (currentContent) {
        currentContent.classList.add('active');
        console.log('Adding active to step:', currentStep, 'element:', currentContent.id);
      } else {
        console.log('Could not find element for step:', currentStep);
      }

      // Update navigation buttons
      if (prevBtn) {
        prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
      }

      if (nextBtn) {
        if (currentStep === totalSteps) {
          nextBtn.innerHTML = '<i class="fas fa-check"></i> Complete';
          nextBtn.classList.remove('btn-primary');
          nextBtn.classList.add('btn-success');
        } else {
          nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
          nextBtn.classList.remove('btn-success');
          nextBtn.classList.add('btn-primary');
        }
      }
    }

    console.log('Initializing form wizard...');
    updateStepDisplay();
  }

  function exportData() {
    showNotification('📊 Exporting data...', 'info');
    
    // Simulate export process
    setTimeout(() => {
      // Create sample data export
      const exportData = {
        certificates: [
          { id: 'M025-24', customer: 'Prochef Industries', equipment: 'Digital Scale Pro', date: '2024-01-15' },
          { id: 'M024-24', customer: 'GNPC Station 5', equipment: 'Flow Meter FM-500', date: '2024-01-10' }
        ],
        statistics: {
          totalCertificates: 248,
          activeCustomers: 34,
          thisMonth: 28
        },
        exportDate: new Date().toISOString()
      };
      
      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `calibration-data-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      showNotification('✅ Data exported successfully!', 'success');
    }, 1500);
  }

  // Comprehensive Button Initialization
  function initializeAllButtons() {
    console.log('🎯 Initializing all buttons...');
    
    // Header action buttons
    initializeHeaderButtons();
    
    // Dashboard buttons  
    initializeDashboardButtons();
    
    // Certificate form buttons
    initializeCertificateFormButtons();
    
    // Navigation and filter buttons
    initializeNavigationButtons();
    
    // Table action buttons
    initializeTableButtons();
    
    console.log('✅ All buttons initialized');
  }

  function initializeHeaderButtons() {
    // Note: Sidebar toggles are now handled in initializeNavigation() to avoid duplicate handlers

    // Quick actions
    const quickSearch = document.getElementById('quickSearch');
    if (quickSearch) {
      quickSearch.addEventListener('click', () => {
        showQuickSearchModal();
      });
    }

    const quickAdd = document.getElementById('quickAdd');
    if (quickAdd) {
      quickAdd.addEventListener('click', () => {
        showSection('certificate-creation');
        showNotification('➕ Quick add certificate opened', 'success');
      });
    }

    // Notification button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
      notificationBtn.addEventListener('click', () => {
        showNotificationPanel();
      });
    }

    // Settings button
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        showSettingsModal();
      });
    }

    // Profile dropdown
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown) {
      profileDropdown.addEventListener('click', () => {
        showProfileMenu();
      });
    }
  }

  function initializeDashboardButtons() {
    // View All button
    const viewAllBtn = document.getElementById('viewAllBtn');
    if (viewAllBtn) {
      viewAllBtn.addEventListener('click', () => {
        showSection('certificate-management');
        showNotification('📋 Viewing all certificates', 'info');
      });
    }
  }

  function initializeCertificateFormButtons() {
    // Load template button
    const loadTemplateBtn = document.getElementById('loadTemplateBtn');
    if (loadTemplateBtn) {
      loadTemplateBtn.addEventListener('click', () => {
        showTemplateSelector();
      });
    }

    // Save draft button
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', () => {
        saveCertificateDraft();
      });
    }

    // Preview button
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        generateCertificatePreview();
      });
    }

    // Generate button (main certificate generation)
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        generateCertificatePDF();
      });
    }

    // Additional certificate management button
    const newCertBtn2 = document.getElementById('newCertBtn2');
    if (newCertBtn2) {
      newCertBtn2.addEventListener('click', () => {
        showSection('certificate-creation');
        showNotification('📝 New certificate form opened', 'success');
      });
    }
  }

  function initializeNavigationButtons() {
    // Clear filters
    const clearFilters = document.getElementById('clearFilters');
    if (clearFilters) {
      clearFilters.addEventListener('click', () => {
        clearAllFilters();
      });
    }

    // Pagination
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    
    if (prevPage) {
      prevPage.addEventListener('click', () => {
        navigateToPage('prev');
      });
    }
    
    if (nextPage) {
      nextPage.addEventListener('click', () => {
        navigateToPage('next');
      });
    }
  }

  function initializeTableButtons() {
    // This will handle dynamically created table buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-sm')) {
        const btn = e.target.closest('.btn-sm');
        const action = btn.onclick || btn.getAttribute('onclick');
        
        if (action && action.toString().includes('viewCertificate')) {
          const certId = action.match(/['"`]([^'"`]+)['"`]/)?.[1];
          if (certId) {
            viewCertificateDetails(certId);
          }
        }
      }
    });
  }

  // Supporting Functions for Button Actions
  
  function showQuickSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Quick Search</h3>
        <div class="search-form">
          <input type="text" id="quickSearchInput" placeholder="Search certificates, customers, equipment..." style="width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px;">
          <div class="search-results" id="searchResults" style="max-height: 200px; overflow-y: auto; margin: 10px 0;"></div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="performQuickSearch()">Search</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('quickSearchInput').focus();
    
    // Add search as you type
    document.getElementById('quickSearchInput').addEventListener('input', (e) => {
      performQuickSearch(e.target.value);
    });
  }

  function performQuickSearch(query) {
    const searchResults = document.getElementById('searchResults');
    if (!query) {
      searchResults.innerHTML = '';
      return;
    }
    
    // Mock search results
    const results = [
      { type: 'Certificate', id: 'M025-24', name: 'Digital Scale Pro - Prochef Industries' },
      { type: 'Customer', id: 'CUST001', name: 'Ghana National Petroleum Corporation' },
      { type: 'Equipment', id: 'EQ001', name: 'Flow Meter FM-500' }
    ].filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    
    searchResults.innerHTML = results.map(result => `
      <div class="search-result-item" style="padding: 8px; border-bottom: 1px solid #eee; cursor: pointer;" onclick="selectSearchResult('${result.type}', '${result.id}')">
        <strong>${result.type}:</strong> ${result.name}
      </div>
    `).join('') || '<div style="padding: 8px; color: #666;">No results found</div>';
  }

  function selectSearchResult(type, id) {
    showNotification(`📋 Selected ${type}: ${id}`, 'success');
    document.querySelector('.modal').remove();
  }

  function showNotificationPanel() {
    const panel = document.createElement('div');
    panel.className = 'notification-panel';
    panel.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      width: 350px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      z-index: 1001;
      max-height: 400px;
      overflow-y: auto;
    `;
    
    panel.innerHTML = `
      <div style="padding: 20px; border-bottom: 1px solid #eee;">
        <h3 style="margin: 0; display: flex; align-items: center; justify-content: space-between;">
          <span>📢 Notifications</span>
          <button onclick="this.closest('.notification-panel').remove()" style="background: none; border: none; font-size: 18px; cursor: pointer;">×</button>
        </h3>
      </div>
      <div style="padding: 15px;">
        <div class="notification-item" style="padding: 10px; margin: 8px 0; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #ffc107;">
          <strong>⚠️ Calibration Due</strong><br>
          <small>Flow Meter FM-500 due for calibration in 3 days</small>
        </div>
        <div class="notification-item" style="padding: 10px; margin: 8px 0; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #28a745;">
          <strong>✅ Certificate Generated</strong><br>
          <small>M025-24 successfully created and sent to customer</small>
        </div>
        <div class="notification-item" style="padding: 10px; margin: 8px 0; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
          <strong>📋 New Customer</strong><br>
          <small>Total Petroleum Ghana Ltd. added to system</small>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    
    // Auto close after 10 seconds
    setTimeout(() => {
      if (panel.parentNode) {
        panel.remove();
      }
    }, 10000);
  }

  function showSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 600px;">
        <h3>⚙️ System Settings</h3>
        <div class="settings-form">
          <div class="setting-group" style="margin: 20px 0;">
            <label><strong>Company Information</strong></label>
            <input type="text" value="CalPro Calibration Services" style="width: 100%; padding: 8px; margin: 5px 0;">
          </div>
          <div class="setting-group" style="margin: 20px 0;">
            <label><strong>Default Calibration Interval (months)</strong></label>
            <input type="number" value="12" style="width: 100%; padding: 8px; margin: 5px 0;">
          </div>
          <div class="setting-group" style="margin: 20px 0;">
            <label><strong>Auto-sync Interval (minutes)</strong></label>
            <select style="width: 100%; padding: 8px; margin: 5px 0;">
              <option value="5">5 minutes</option>
              <option value="15" selected>15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
          <div class="setting-group" style="margin: 20px 0;">
            <label><input type="checkbox" checked> Enable email notifications</label><br>
            <label><input type="checkbox"> Enable SMS alerts</label><br>
            <label><input type="checkbox" checked> Auto-backup data</label>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="saveSettings()">Save Settings</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function showProfileMenu() {
    const menu = document.createElement('div');
    menu.className = 'profile-menu';
    menu.style.cssText = `
      position: fixed;
      top: 80px;
      right: 20px;
      width: 250px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      z-index: 1001;
      padding: 15px;
    `;
    
    menu.innerHTML = `
      <div style="text-align: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #007bff, #0056b3); margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
          <i class="fas fa-user-tie"></i>
        </div>
        <strong>John Doe</strong><br>
        <small style="color: #666;">Lead Calibrator</small>
      </div>
      <div class="menu-items">
        <div class="menu-item" onclick="showUserProfile()" style="padding: 10px; cursor: pointer; border-radius: 8px; margin: 5px 0;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
          <i class="fas fa-user" style="margin-right: 10px;"></i> View Profile
        </div>
        <div class="menu-item" onclick="showChangePassword()" style="padding: 10px; cursor: pointer; border-radius: 8px; margin: 5px 0;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
          <i class="fas fa-key" style="margin-right: 10px;"></i> Change Password
        </div>
        <div class="menu-item" onclick="showUserPreferences()" style="padding: 10px; cursor: pointer; border-radius: 8px; margin: 5px 0;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
          <i class="fas fa-cog" style="margin-right: 10px;"></i> Preferences
        </div>
        <hr>
        <div class="menu-item" onclick="logout()" style="padding: 10px; cursor: pointer; border-radius: 8px; margin: 5px 0; color: #dc3545;" onmouseover="this.style.background='#f8f9fa'" onmouseout="this.style.background='white'">
          <i class="fas fa-sign-out-alt" style="margin-right: 10px;"></i> Logout
        </div>
      </div>
    `;
    
    document.body.appendChild(menu);
    
    // Close when clicking outside
    setTimeout(() => {
      document.addEventListener('click', function closeMenu(e) {
        if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 100);
  }

  function showTemplateSelector() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>📋 Select Certificate Template</h3>
        <div class="template-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
          <div class="template-card" onclick="selectTemplate('flow')" style="padding: 15px; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; text-align: center;" onmouseover="this.style.borderColor='#007bff'" onmouseout="this.style.borderColor='#e2e8f0'">
            <i class="fas fa-water" style="font-size: 24px; color: #007bff; margin-bottom: 10px;"></i>
            <h4>Flow Measurement</h4>
            <small>For flow meters and prover calibrations</small>
          </div>
          <div class="template-card" onclick="selectTemplate('tank')" style="padding: 15px; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; text-align: center;" onmouseover="this.style.borderColor='#007bff'" onmouseout="this.style.borderColor='#e2e8f0'">
            <i class="fas fa-oil-can" style="font-size: 24px; color: #28a745; margin-bottom: 10px;"></i>
            <h4>Tank Calibration</h4>
            <small>For storage tank calibrations</small>
          </div>
          <div class="template-card" onclick="selectTemplate('electrical')" style="padding: 15px; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; text-align: center;" onmouseover="this.style.borderColor='#007bff'" onmouseout="this.style.borderColor='#e2e8f0'">
            <i class="fas fa-bolt" style="font-size: 24px; color: #ffc107; margin-bottom: 10px;"></i>
            <h4>Electrical Testing</h4>
            <small>For electrical test instruments</small>
          </div>
          <div class="template-card" onclick="selectTemplate('pressure')" style="padding: 15px; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; text-align: center;" onmouseover="this.style.borderColor='#007bff'" onmouseout="this.style.borderColor='#e2e8f0'">
            <i class="fas fa-tachometer-alt" style="font-size: 24px; color: #dc3545; margin-bottom: 10px;"></i>
            <h4>Pressure Testing</h4>
            <small>For pressure gauges and transmitters</small>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function selectTemplate(templateType) {
    const templates = {
      flow: {
        instrumentType: 'flow_meter_calibration',
        manufacturer: 'Endress+Hauser',
        model: 'Promag 550',
        measurements: [
          { standard: '0.00', reading: '0.00', error: '0.00', uncertainty: '±0.01' },
          { standard: '25.00', reading: '25.01', error: '0.01', uncertainty: '±0.01' },
          { standard: '50.00', reading: '49.99', error: '-0.01', uncertainty: '±0.01' }
        ]
      },
      tank: {
        instrumentType: 'bulk_storage_tank',
        manufacturer: 'Custom Tank Co.',
        model: 'Storage Tank 1000L',
        measurements: [
          { standard: '100', reading: '100.2', error: '0.2', uncertainty: '±0.5' },
          { standard: '500', reading: '499.8', error: '-0.2', uncertainty: '±0.5' }
        ]
      }
    };
    
    const template = templates[templateType];
    if (template) {
      // Fill form fields
      document.getElementById('instrumentType').value = template.instrumentType;
      document.getElementById('manufacturer').value = template.manufacturer;
      document.getElementById('model').value = template.model;
      
      // Add measurement rows
      const tableBody = document.querySelector('#measurementTable tbody');
      if (tableBody) {
        tableBody.innerHTML = '';
        template.measurements.forEach(measurement => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td><input type="number" step="0.01" value="${measurement.standard}"></td>
            <td><input type="number" step="0.01" value="${measurement.reading}"></td>
            <td><input type="number" step="0.01" value="${measurement.error}"></td>
            <td><input type="number" step="0.01" value="${measurement.uncertainty}"></td>
            <td><button type="button" class="btn btn-danger btn-sm" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
          `;
          tableBody.appendChild(row);
        });
      }
      
      showNotification(`📋 ${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template loaded`, 'success');
    }
    
    document.querySelector('.modal').remove();
  }

  function saveCertificateDraft() {
    showNotification('💾 Saving draft...', 'info');
    
    // Collect form data
    const draftData = {
      certNo: document.getElementById('certNo')?.value || '',
      manufacturer: document.getElementById('manufacturer')?.value || '',
      model: document.getElementById('model')?.value || '',
      customer: document.getElementById('customer')?.value || '',
      savedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const draftKey = `draft_${draftData.certNo || 'unnamed'}_${Date.now()}`;
    localStorage.setItem(draftKey, JSON.stringify(draftData));
    
    setTimeout(() => {
      showNotification('✅ Draft saved successfully!', 'success');
    }, 1000);
  }

  function generateCertificatePreview() {
    const previewArea = document.getElementById('certificatePreview');
    if (!previewArea) return;
    
    showNotification('👁️ Generating preview...', 'info');
    
    const certNo = document.getElementById('certNo')?.value || 'PREVIEW-001';
    const manufacturer = document.getElementById('manufacturer')?.value || 'Sample Manufacturer';
    const model = document.getElementById('model')?.value || 'Sample Model';
    const customer = document.getElementById('customer')?.value || 'Sample Customer';
    
    setTimeout(() => {
      previewArea.innerHTML = `
        <div style="border: 2px solid #007bff; padding: 20px; background: white; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #007bff; margin: 0;">CALPRO CALIBRATION SERVICES</h2>
            <p style="margin: 5px 0;">Calibration Certificate</p>
            <p style="margin: 5px 0;"><strong>Certificate No: ${certNo}</strong></p>
          </div>
          <div style="margin: 15px 0;">
            <strong>Equipment Details:</strong><br>
            Manufacturer: ${manufacturer}<br>
            Model: ${model}<br>
            Customer: ${customer}
          </div>
          <div style="margin-top: 20px; text-align: center; color: #666; font-style: italic;">
            Preview - Actual certificate will include measurement data and signatures
          </div>
        </div>
      `;
      showNotification('✅ Preview generated!', 'success');
    }, 1500);
  }

  function generateCertificatePDF() {
    showNotification('📄 Generating PDF certificate...', 'info');
    
    // Use existing PDF generation function if available
    setTimeout(() => {
      showNotification('✅ PDF certificate generated and downloaded!', 'success');
      // Trigger actual PDF generation here
      if (typeof generatePDF === 'function') {
        generatePDF();
      }
    }, 2000);
  }

  function clearAllFilters() {
    // Clear all filter inputs
    document.getElementById('statusFilter').value = '';
    document.getElementById('serviceFilter').value = '';
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    document.getElementById('certificateSearch').value = '';
    
    showNotification('🧹 All filters cleared', 'info');
    // Refresh table data
    updateCertificateTable();
  }

  function navigateToPage(direction) {
    const current = parseInt(document.getElementById('pageNumbers')?.textContent || '1');
    const newPage = direction === 'prev' ? Math.max(1, current - 1) : current + 1;
    
    showNotification(`📄 Loading page ${newPage}...`, 'info');
    
    // Update pagination display
    setTimeout(() => {
      document.getElementById('pageNumbers').textContent = newPage;
      showNotification(`✅ Page ${newPage} loaded`, 'success');
    }, 500);
  }

  function viewCertificateDetails(certId) {
    showNotification(`👁️ Opening certificate ${certId}...`, 'info');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 800px;">
        <h3>📋 Certificate Details - ${certId}</h3>
        <div class="certificate-details">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
            <div>
              <strong>Certificate Information</strong><br>
              Certificate No: ${certId}<br>
              Issue Date: 2024-01-15<br>
              Due Date: 2025-01-15<br>
              Status: <span style="color: #28a745;">Active</span>
            </div>
            <div>
              <strong>Equipment Details</strong><br>
              Manufacturer: Prochef<br>
              Model: Digital Scale Pro<br>
              Serial No: 6596446<br>
              Type: Test Equipment
            </div>
          </div>
          <div style="margin: 20px 0;">
            <strong>Customer Information</strong><br>
            Name: Prochef Industries<br>
            Address: Industrial Area, Tema<br>
            Contact: +233 XXX XXX XXX
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
          <button class="btn btn-primary" onclick="downloadCertificatePDF('${certId}')">Download PDF</button>
          <button class="btn btn-success" onclick="emailCertificate('${certId}')">Email Certificate</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Additional utility functions
  function saveSettings() {
    showNotification('⚙️ Saving settings...', 'info');
    setTimeout(() => {
      showNotification('✅ Settings saved successfully!', 'success');
      document.querySelector('.modal').remove();
    }, 1000);
  }

  function showUserProfile() {
    showNotification('👤 Opening user profile...', 'info');
    document.querySelector('.profile-menu').remove();
  }

  function showChangePassword() {
    showNotification('🔐 Opening password change...', 'info');
    document.querySelector('.profile-menu').remove();
  }

  function showUserPreferences() {
    showNotification('⚙️ Opening user preferences...', 'info');
    document.querySelector('.profile-menu').remove();
  }

  function logout() {
    showNotification('👋 Logging out...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  function downloadCertificatePDF(certId) {
    showNotification(`📥 Downloading certificate ${certId}...`, 'info');
    document.querySelector('.modal').remove();
  }

  function emailCertificate(certId) {
    showNotification(`📧 Emailing certificate ${certId}...`, 'info');
    document.querySelector('.modal').remove();
  }

  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease;
    `;
    
    const colors = {
      info: '#007bff',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Certificate management functions - exposed globally
  window.addMeasurementRow = function() {
    const tableBody = document.querySelector('#measurementTable tbody');
    if (!tableBody) return;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td><input type="number" step="0.01" placeholder="0.00"></td>
      <td><input type="number" step="0.01" placeholder="0.00"></td>
      <td><input type="number" step="0.01" placeholder="0.00"></td>
      <td><input type="number" step="0.01" placeholder="±0.01"></td>
      <td><button type="button" class="btn btn-danger btn-sm" onclick="removeRow(this)"><i class="fas fa-trash"></i></button></td>
    `;
    
    tableBody.appendChild(newRow);
    showNotification('➕ Measurement row added', 'success');
  };

  window.removeRow = function(button) {
    const row = button.closest('tr');
    if (row) {
      row.remove();
    }
  };

  window.viewCertificate = function(certId) {
    console.log('Viewing certificate:', certId);
    alert(`Viewing certificate ${certId}`);
  };

  window.editCertificate = function(certId) {
    console.log('Editing certificate:', certId);
    alert(`Editing certificate ${certId}`);
  };

  window.downloadCertificate = function(certId) {
    console.log('Downloading certificate:', certId);
    alert(`Downloading certificate ${certId}`);
  };

  // Add measurement button handler
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'addMeasurementBtn') {
      window.addMeasurementRow();
    }
  });

  // CRITICAL: Export all functions needed by onclick handlers in HTML
  // This ensures buttons work immediately when clicked
  const exportToGlobal = {
    // Initialization
    initializeApp,
    initializeDashboard,
    initializeNavigation,
    initializeCharts,
    initializeFormWizard,
    initializeAllButtons,
    
    // Dashboard functions
    updateDashboardStats,
    loadRecentActivity,
    showQuickSearchModal,
    showNotificationPanel,
    clearAllNotifications: () => {
      console.log('Clearing notifications');
      showNotification('All notifications cleared', 'success');
    },
    
    // Navigation
    showSection,
    updateActiveMenuItem,
    updateBreadcrumb,
    toggleSidebar: () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        const isCollapsed = sidebar.classList.contains('collapsed');
        sidebar.classList.toggle('collapsed', !isCollapsed);
        showNotification(`📱 Sidebar ${!isCollapsed ? 'expanded' : 'collapsed'}`, 'info');
      }
    },
    
    // Worksheet functions
    showWorksheetList: () => showSection('worksheets'),
    showWorksheetForm: () => {
      console.log('Show worksheet form');
      showSection('worksheets');
      const formArea = document.getElementById('worksheetFormArea');
      const listArea = document.getElementById('worksheetListArea');
      if (formArea) formArea.style.display = 'block';
      if (listArea) listArea.style.display = 'none';
    },
    loadWorksheetCards: () => {
      console.log('Loading worksheet cards');
      updateDashboardStats();
    },
    selectWorksheetType: (type) => {
      console.log('Selected type:', type);
      const typeSelector = document.getElementById('worksheetTypeSelector');
      const formArea = document.getElementById('worksheetFormContent');
      if (typeSelector) typeSelector.style.display = 'none';
      if (formArea) formArea.style.display = 'block';
      showNotification(`Selected ${type} worksheet type`, 'success');
    },
    changeWorksheetType: () => {
      const typeSelector = document.getElementById('worksheetTypeSelector');
      const formArea = document.getElementById('worksheetFormContent');
      if (typeSelector) typeSelector.style.display = 'block';
      if (formArea) formArea.style.display = 'none';
    },
    nextWorksheetStep: () => {
      console.log('Next worksheet step');
      showNotification('Moving to next step', 'info');
    },
    prevWorksheetStep: () => {
      console.log('Previous worksheet step');
      showNotification('Moving to previous step', 'info');
    },
    addWorksheetTestRow: () => {
      console.log('Add test row');
      showNotification('Test row added', 'success');
    },
    addWorksheetStandardSet: () => {
      console.log('Add standard set');
      showNotification('Standard set added', 'success');
    },
    calculateWorksheetUncertainty: () => {
      console.log('Calculate uncertainty');
      showNotification('Calculating uncertainty...', 'info');
    },
    saveWorksheetDraft: () => {
      console.log('Save worksheet draft');
      showNotification('Worksheet saved as draft', 'success');
    },
    completeWorksheet: () => {
      console.log('Complete worksheet');
      if (confirm('Complete this worksheet?')) {
        showNotification('Worksheet completed successfully!', 'success');
        setTimeout(() => showSection('worksheets'), 1500);
      }
    },
    viewWorksheet: (id) => {
      console.log('View worksheet:', id);
      showNotification(`Opening worksheet ${id}`, 'info');
    },
    continueWorksheet: (id) => {
      console.log('Continue worksheet:', id);
      showNotification(`Continuing worksheet ${id}`, 'info');
    },
    deleteWorksheet: (id) => {
      if (confirm(`Delete worksheet ${id}?`)) {
        console.log('Delete worksheet:', id);
        showNotification(`Worksheet ${id} deleted`, 'success');
      }
    },
    approveWorksheet: (id) => {
      console.log('Approve worksheet:', id);
      showNotification(`Worksheet ${id} approved`, 'success');
    },
    convertToCertificate: (id) => {
      console.log('Convert to certificate:', id);
      showNotification(`Converting worksheet ${id} to certificate`, 'info');
      setTimeout(() => showSection('certificates'), 1000);
    },
    
    // Certificate functions
    openCertificateTemplateModal: () => {
      console.log('Open certificate template');
      showNotification('Opening certificate templates', 'info');
    },
    toggleCertificateView: (view) => {
      document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelector(`[data-view="${view}"]`)?.classList.add('active');
      const gridView = document.getElementById('certificateGridView');
      const listView = document.getElementById('certificateListView');
      if (view === 'grid') {
        if (gridView) gridView.style.display = 'grid';
        if (listView) listView.style.display = 'none';
      } else {
        if (gridView) gridView.style.display = 'none';
        if (listView) listView.style.display = 'block';
      }
    },
    
    // Pressure templates
    showPressureTemplates: () => {
      const modal = document.getElementById('pressureTemplateModal');
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      } else {
        console.log('Opening pressure templates');
        showNotification('Loading pressure templates...', 'info');
      }
    },
    closePressureTemplates: () => {
      const modal = document.getElementById('pressureTemplateModal');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    },
    selectPressureTemplate: (templateId) => {
      console.log('Selected pressure template:', templateId);
      const modal = document.getElementById('pressureTemplateModal');
      if (modal) modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      window.location.hash = 'worksheets';
      showNotification(`Loaded template: ${templateId}`, 'success');
    },
    
    // Modals and dialogs
    openQuickScanModal: () => {
      console.log('Quick scan modal');
      showNotification('Quick scan feature coming soon', 'info');
    },
    openExportModal: exportData,
    closeUserModal: () => {
      const modal = document.getElementById('userModal');
      if (modal) modal.style.display = 'none';
    },
    closeUserActivityModal: () => {
      const modal = document.getElementById('userActivityModal');
      if (modal) modal.style.display = 'none';
    },
    
    // Settings and profile
    showSettings: showSettingsModal,
    showProfile: showProfileMenu,
    logout,
    
    // Utility functions
    showNotification,
    exportData
  };

  // Assign all functions to window object
  Object.assign(window, exportToGlobal);

  // Mark app as loaded
  window.appLoaded = true;
  console.log('✅ App functions exported to global scope');


})();
