// Pressure Equipment Calibration Templates
// 15 pre-configured templates for common pressure instruments

const PRESSURE_TEMPLATES = {
  // 1. Pressure Transmitters
  'pressure_transmitter_0-100psi': {
    id: 'pt_100psi',
    name: 'Pressure Transmitter (0-100 psi)',
    category: 'Pressure Transmitters',
    description: 'Standard 0-100 psi pressure transmitter calibration',
    manufacturer: 'Rosemount',
    model: '3051CD',
    range: '0-100 psi',
    accuracy: '±0.075% of span',
    testPoints: [
      { percent: 0, refPressure: 0 },
      { percent: 25, refPressure: 25 },
      { percent: 50, refPressure: 50 },
      { percent: 75, refPressure: 75 },
      { percent: 100, refPressure: 100 }
    ],
    tableFormat: 'pressure_voltage', // Ref Pressure (Rising/Falling), UUT Pressure (Rising/Falling), UUT Voltage (Rising/Falling)
    standardEquipment: 'Fluke 718 Pressure Calibrator',
    acceptanceCriteria: '±0.5 psi',
    cyclePoints: true // Test both rising and falling
  },

  'pressure_transmitter_0-300psi': {
    id: 'pt_300psi',
    name: 'Pressure Transmitter (0-300 psi)',
    category: 'Pressure Transmitters',
    description: 'Medium pressure transmitter calibration',
    manufacturer: 'Yokogawa',
    model: 'EJA110A',
    range: '0-300 psi',
    accuracy: '±0.065% of span',
    testPoints: [
      { percent: 0, refPressure: 0 },
      { percent: 20, refPressure: 60 },
      { percent: 40, refPressure: 120 },
      { percent: 60, refPressure: 180 },
      { percent: 80, refPressure: 240 },
      { percent: 100, refPressure: 300 }
    ],
    tableFormat: 'pressure_voltage',
    standardEquipment: 'Fluke 719 Pressure Calibrator',
    acceptanceCriteria: '±1.5 psi',
    cyclePoints: true
  },

  'pressure_transmitter_0-1000psi': {
    id: 'pt_1000psi',
    name: 'Pressure Transmitter (0-1000 psi)',
    category: 'Pressure Transmitters',
    description: 'High pressure transmitter calibration',
    manufacturer: 'Rosemount',
    model: '3051CG',
    range: '0-1000 psi',
    accuracy: '±0.075% of span',
    testPoints: [
      { percent: 0, refPressure: 0 },
      { percent: 25, refPressure: 250 },
      { percent: 50, refPressure: 500 },
      { percent: 75, refPressure: 750 },
      { percent: 100, refPressure: 1000 }
    ],
    tableFormat: 'pressure_voltage',
    standardEquipment: 'Druck DPI 610',
    acceptanceCriteria: '±5 psi',
    cyclePoints: true
  },

  // 2. Pressure Gauges
  'pressure_gauge_0-100psi': {
    id: 'pg_100psi',
    name: 'Analog Pressure Gauge (0-100 psi)',
    category: 'Pressure Gauges',
    description: 'Mechanical pressure gauge calibration',
    manufacturer: 'Ashcroft',
    model: '1005D',
    range: '0-100 psi',
    accuracy: '±1% of span',
    testPoints: [
      { percent: 0, refPressure: 0 },
      { percent: 25, refPressure: 25 },
      { percent: 50, refPressure: 50 },
      { percent: 75, refPressure: 75 },
      { percent: 100, refPressure: 100 }
    ],
    tableFormat: 'pressure_reading', // Ref Pressure, Gauge Reading, Error
    standardEquipment: 'Fluke 700G Pressure Gauge Calibrator',
    acceptanceCriteria: '±2 psi',
    cyclePoints: true
  },

  'pressure_gauge_0-300psi': {
    id: 'pg_300psi',
    name: 'Analog Pressure Gauge (0-300 psi)',
    category: 'Pressure Gauges',
    description: 'Medium range pressure gauge',
    manufacturer: 'Wika',
    model: '232.50',
    range: '0-300 psi',
    accuracy: '±0.5% of span',
    testPoints: [
      { percent: 0, refPressure: 0 },
      { percent: 20, refPressure: 60 },
      { percent: 40, refPressure: 120 },
      { percent: 60, refPressure: 180 },
      { percent: 80, refPressure: 240 },
      { percent: 100, refPressure: 300 }
    ],
    tableFormat: 'pressure_reading',
    standardEquipment: 'Fluke 700G Pressure Gauge Calibrator',
    acceptanceCriteria: '±3 psi',
    cyclePoints: true
  },

  'digital_pressure_gauge_0-500psi': {
    id: 'dpg_500psi',
    name: 'Digital Pressure Gauge (0-500 psi)',
    category: 'Pressure Gauges',
    description: 'Digital pressure gauge calibration',
    manufacturer: 'Fluke',
    model: '700G27',
    range: '0-500 psi',
    accuracy: '±0.05% of reading',
    testPoints: [
      { percent: 0, refPressure: 0 },
      { percent: 20, refPressure: 100 },
      { percent: 40, refPressure: 200 },
      { percent: 60, refPressure: 300 },
      { percent: 80, refPressure: 400 },
      { percent: 100, refPressure: 500 }
    ],
    tableFormat: 'pressure_reading',
    standardEquipment: 'Druck DPI 610',
    acceptanceCriteria: '±2.5 psi',
    cyclePoints: false
  },

  // 3. Differential Pressure
  'dp_transmitter_0-100inH2O': {
    id: 'dp_100inh2o',
    name: 'DP Transmitter (0-100 inH2O)',
    category: 'Differential Pressure',
    description: 'Differential pressure transmitter',
    manufacturer: 'Rosemount',
    model: '3051CD',
    range: '0-100 inH2O',
    accuracy: '±0.075% of span',
    testPoints: [
      { percent: 0, refPressure: 0 },
      { percent: 25, refPressure: 25 },
      { percent: 50, refPressure: 50 },
      { percent: 75, refPressure: 75 },
      { percent: 100, refPressure: 100 }
    ],
    tableFormat: 'pressure_current', // DP, mA output
    standardEquipment: 'Fluke 718 DP Calibrator',
    acceptanceCriteria: '±0.5 inH2O',
    cyclePoints: true
  },

  'dp_gauge_0-50inH2O': {
    id: 'dp_50inh2o',
    name: 'DP Gauge (0-50 inH2O)',
    category: 'Differential Pressure',
    description: 'Low differential pressure gauge',
    manufacturer: 'Dwyer',
    model: 'Magnehelic 2000',
    range: '0-50 inH2O',
    accuracy: '±2% of full scale',
    testPoints: [
      { percent: 0, refPressure: 0 },
      { percent: 20, refPressure: 10 },
      { percent: 40, refPressure: 20 },
      { percent: 60, refPressure: 30 },
      { percent: 80, refPressure: 40 },
      { percent: 100, refPressure: 50 }
    ],
    tableFormat: 'pressure_reading',
    standardEquipment: 'Fluke 718 DP Calibrator',
    acceptanceCriteria: '±2 inH2O',
    cyclePoints: true
  },

  // 4. Vacuum Gauges
  'vacuum_gauge_0-30inHg': {
    id: 'vg_30inhg',
    name: 'Vacuum Gauge (0-30 inHg)',
    category: 'Vacuum Gauges',
    description: 'Vacuum pressure gauge calibration',
    manufacturer: 'Ashcroft',
    model: '1005D',
    range: '0-30 inHg vacuum',
    accuracy: '±1% of span',
    testPoints: [
      { percent: 0, refPressure: 0 },
      { percent: 25, refPressure: -7.5 },
      { percent: 50, refPressure: -15 },
      { percent: 75, refPressure: -22.5 },
      { percent: 100, refPressure: -30 }
    ],
    tableFormat: 'pressure_reading',
    standardEquipment: 'Fluke 700 Vacuum Calibrator',
    acceptanceCriteria: '±1 inHg',
    cyclePoints: true
  },

  // 5. Pressure Switches
  'pressure_switch_adjustable': {
    id: 'ps_adjustable',
    name: 'Adjustable Pressure Switch',
    category: 'Pressure Switches',
    description: 'Pressure switch setpoint calibration',
    manufacturer: 'United Electric',
    model: 'H117',
    range: '0-100 psi',
    accuracy: '±2% of setpoint',
    testPoints: [
      { percent: 'setpoint', refPressure: 'TBD', note: 'Rising pressure - switch closes' },
      { percent: 'reset', refPressure: 'TBD', note: 'Falling pressure - switch opens' },
      { percent: 'deadband', refPressure: 'TBD', note: 'Difference between setpoint and reset' }
    ],
    tableFormat: 'switch_setpoint', // Setpoint, Rising Actuation, Falling Actuation, Deadband
    standardEquipment: 'Fluke 718 Pressure Calibrator',
    acceptanceCriteria: '±2 psi of setpoint',
    cyclePoints: false
  },

  // 6. Compound Gauges
  'compound_gauge_30inHg-30psi': {
    id: 'cg_30inhg_30psi',
    name: 'Compound Gauge (-30 inHg to +30 psi)',
    category: 'Compound Gauges',
    description: 'Vacuum and pressure compound gauge',
    manufacturer: 'Ashcroft',
    model: '1490',
    range: '-30 inHg to +30 psi',
    accuracy: '±1% of span',
    testPoints: [
      { percent: 0, refPressure: -30, unit: 'inHg' },
      { percent: 25, refPressure: -15, unit: 'inHg' },
      { percent: 50, refPressure: 0, unit: 'psi' },
      { percent: 75, refPressure: 15, unit: 'psi' },
      { percent: 100, refPressure: 30, unit: 'psi' }
    ],
    tableFormat: 'pressure_reading',
    standardEquipment: 'Fluke 718 Calibrator',
    acceptanceCriteria: 'Vacuum: ±1 inHg, Pressure: ±1 psi',
    cyclePoints: true
  },

  // 7. High Pressure Gauges
  'hp_gauge_0-5000psi': {
    id: 'hpg_5000psi',
    name: 'High Pressure Gauge (0-5000 psi)',
    category: 'High Pressure Gauges',
    description: 'High range pressure gauge',
    manufacturer: 'Ashcroft',
    model: '2074',
    range: '0-5000 psi',
    accuracy: '±0.5% of span',
    testPoints: [
      { percent: 0, refPressure: 0 },
      { percent: 20, refPressure: 1000 },
      { percent: 40, refPressure: 2000 },
      { percent: 60, refPressure: 3000 },
      { percent: 80, refPressure: 4000 },
      { percent: 100, refPressure: 5000 }
    ],
    tableFormat: 'pressure_reading',
    standardEquipment: 'Fluke 2700G Reference Pressure Gauge',
    acceptanceCriteria: '±50 psi',
    cyclePoints: true
  },

  // 8. Pressure Calibrators
  'pressure_calibrator_portable': {
    id: 'pc_portable',
    name: 'Portable Pressure Calibrator',
    category: 'Pressure Calibrators',
    description: 'Handheld pressure calibrator verification',
    manufacturer: 'Fluke',
    model: '718 300G',
    range: '0-300 psi',
    accuracy: '±0.025% of reading',
    testPoints: [
      { percent: 0, refPressure: 0 },
      { percent: 25, refPressure: 75 },
      { percent: 50, refPressure: 150 },
      { percent: 75, refPressure: 225 },
      { percent: 100, refPressure: 300 }
    ],
    tableFormat: 'pressure_reading',
    standardEquipment: 'Druck DPI 610 (Reference Standard)',
    acceptanceCriteria: '±0.5 psi',
    cyclePoints: false
  },

  // 9. Barometers
  'barometer_digital': {
    id: 'bar_digital',
    name: 'Digital Barometer',
    category: 'Barometers',
    description: 'Atmospheric pressure measurement',
    manufacturer: 'Vaisala',
    model: 'PTB220',
    range: '600-1100 mbar',
    accuracy: '±0.3 mbar',
    testPoints: [
      { percent: 20, refPressure: 700 },
      { percent: 40, refPressure: 800 },
      { percent: 60, refPressure: 900 },
      { percent: 80, refPressure: 1000 },
      { percent: 100, refPressure: 1100 }
    ],
    tableFormat: 'pressure_reading',
    standardEquipment: 'Druck DPI 142 Digital Barometer',
    acceptanceCriteria: '±0.5 mbar',
    cyclePoints: false
  }
};

// Helper function to generate table rows based on template
function generateTemplateRows(template) {
  const rows = [];
  
  if (template.tableFormat === 'pressure_voltage') {
    // Format: % Point | Ref Pressure (Rising/Falling) | UUT Pressure (Rising/Falling) | UUT Voltage (Rising/Falling)
    template.testPoints.forEach(point => {
      rows.push({
        percent: point.percent,
        refRising: point.refPressure,
        refFalling: template.cyclePoints ? point.refPressure : '',
        uutRising: '',
        uutFalling: template.cyclePoints ? '' : '',
        voltageRising: '',
        voltageFalling: template.cyclePoints ? '' : ''
      });
    });
  } else if (template.tableFormat === 'pressure_current') {
    // Format: % Point | Applied Pressure | Output mA | Error
    template.testPoints.forEach(point => {
      rows.push({
        percent: point.percent,
        applied: point.refPressure,
        output: '',
        error: ''
      });
    });
  } else if (template.tableFormat === 'pressure_reading') {
    // Format: % Point | Reference | As Found | Error | Pass/Fail
    template.testPoints.forEach(point => {
      rows.push({
        percent: point.percent,
        reference: point.refPressure,
        asFound: '',
        error: '',
        passFail: ''
      });
    });
  } else if (template.tableFormat === 'switch_setpoint') {
    // Format: Setpoint | Rising Actuation | Falling Actuation | Deadband
    rows.push({
      setpoint: 'Customer Setpoint',
      rising: '',
      falling: '',
      deadband: ''
    });
  }
  
  return rows;
}

// Function to apply template to form
function applyPressureTemplate(templateId, skipFormShow = false) {
  const template = PRESSURE_TEMPLATES[templateId];
  if (!template) {
    console.error('Template not found:', templateId);
    return;
  }

  // Only show worksheet form if explicitly needed (not when called from template modal)
  if (!skipFormShow && window.showWorksheetForm) {
    window.showWorksheetForm();
  }

  // Fill in equipment details (try worksheet fields first, then certificate fields)
  const manufacturerInput = document.getElementById('ws_manufacturer') || document.getElementById('manufacturer');
  const modelInput = document.getElementById('ws_equipModel') || document.getElementById('equipModel');
  const rangeInput = document.getElementById('ws_typeRange') || document.getElementById('typeRange');
  const accuracyInput = document.getElementById('ws_accuracy') || document.getElementById('accuracy');
  const equipDescInput = document.getElementById('ws_equipDesc') || document.getElementById('equipDesc');

  if (equipDescInput) equipDescInput.value = template.description || template.name;
  if (manufacturerInput) manufacturerInput.value = template.manufacturer;
  if (modelInput) modelInput.value = template.model;
  if (rangeInput) rangeInput.value = template.range;
  if (accuracyInput) accuracyInput.value = template.accuracy;

  // Fill in standard equipment
  const refStandardInput = document.getElementById('ws_refStandard') || document.getElementById('refStandard');
  if (refStandardInput) refStandardInput.value = template.standardEquipment;

  // Generate and populate table rows (try worksheet table first, then certificate table)
  const tableBody = document.querySelector('#ws_resultsTable tbody') || 
                    document.querySelector('#resultsTable tbody') || 
                    document.querySelector('#measurementTable tbody');
  if (tableBody) {
    tableBody.innerHTML = ''; // Clear existing rows
    const rows = generateTemplateRows(template);
    
    rows.forEach(rowData => {
      // Add row to table based on format
      addTemplateRow(tableBody, rowData, template.tableFormat);
    });
    
    // Update test summary after all rows are added
    if (typeof window.updateTestSummary === 'function') {
      window.updateTestSummary();
    }
  }

  // Template applied silently - no notification needed
  console.log('✓ Applied template:', template.name);
}

// Helper to add row based on format (updated for worksheet table structure with auto-calculation)
function addTemplateRow(tbody, rowData, format) {
  const row = document.createElement('tr');
  
  // New unified format with Direction dropdown (Rising/Falling) and calculation classes
  row.innerHTML = `
    <td><input type="number" step="0.001" value="${rowData.refPressure || rowData.reference || 0}" class="ref-input" style="width:100%"></td>
    <td>
      <select class="dir-select" style="width:100%">
        <option value="rising">↑ Rising</option>
        <option value="falling">↓ Falling</option>
      </select>
    </td>
    <td><input type="number" step="0.001" placeholder="0" class="meas-input" style="width:100%"></td>
    <td class="dev-cell">0.000</td>
    <td class="error-cell">0.000%</td>
    <td class="unc-cell">-</td>
    <td class="pass-cell">-</td>
    <td><button onclick="removeWorksheetRow(this)" style="padding:4px 8px">×</button></td>
  `;
  
  tbody.appendChild(row);
  
  // Attach listeners if the function exists
  if (typeof window.attachWorksheetRowListeners === 'function') {
    window.attachWorksheetRowListeners(row);
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRESSURE_TEMPLATES, applyPressureTemplate, generateTemplateRows };
}
