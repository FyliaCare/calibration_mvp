// Equipment Database for Autocomplete - Field Technician Tool
// Contains comprehensive equipment data for calibration worksheets

const EQUIPMENT_DATABASE = {
  pressure: [
    // Pressure Gauges
    { type: "Pressure Gauge", manufacturer: "Ashcroft", model: "1490", range: "0-100 PSI", category: "pressure_gauge" },
    { type: "Pressure Gauge", manufacturer: "Ashcroft", model: "2174", range: "0-200 PSI", category: "pressure_gauge" },
    { type: "Pressure Gauge", manufacturer: "Wika", model: "233.50", range: "0-160 PSI", category: "pressure_gauge" },
    { type: "Pressure Gauge", manufacturer: "Wika", model: "232.50", range: "0-300 PSI", category: "pressure_gauge" },
    { type: "Pressure Gauge", manufacturer: "Ametek", model: "TPG", range: "0-1000 PSI", category: "pressure_gauge" },
    { type: "Digital Pressure Gauge", manufacturer: "Ashcroft", model: "2089", range: "0-500 PSI", category: "pressure_gauge" },
    { type: "Digital Pressure Gauge", manufacturer: "Fluke", model: "700G", range: "0-300 PSI", category: "pressure_gauge" },
    
    // Pressure Transmitters
    { type: "Pressure Transmitter", manufacturer: "Rosemount", model: "3051", range: "0-100 PSI", category: "pressure_transmitter" },
    { type: "Pressure Transmitter", manufacturer: "Rosemount", model: "3051CD", range: "0-200 INWC", category: "pressure_transmitter" },
    { type: "Pressure Transmitter", manufacturer: "Yokogawa", model: "EJA110A", range: "0-500 PSI", category: "pressure_transmitter" },
    { type: "Pressure Transmitter", manufacturer: "Yokogawa", model: "EJA120A", range: "0-50 INWC", category: "pressure_transmitter" },
    { type: "Pressure Transmitter", manufacturer: "Yokogawa", model: "EJA130A", range: "0-1000 PSI", category: "pressure_transmitter" },
    { type: "Pressure Transmitter", manufacturer: "Endress+Hauser", model: "Cerabar S PMC71", range: "0-250 PSI", category: "pressure_transmitter" },
    { type: "Pressure Transmitter", manufacturer: "ABB", model: "266DSH", range: "0-150 PSI", category: "pressure_transmitter" },
    { type: "Pressure Transmitter", manufacturer: "Siemens", model: "SITRANS P DS III", range: "0-400 PSI", category: "pressure_transmitter" },
    { type: "Pressure Transmitter", manufacturer: "Honeywell", model: "STG700", range: "0-300 PSI", category: "pressure_transmitter" },
    
    // Pressure Calibrators
    { type: "Pressure Calibrator", manufacturer: "Druck", model: "DPI611", range: "0-300 PSI", category: "pressure_calibrator" },
    { type: "Pressure Calibrator", manufacturer: "Druck", model: "DPI620", range: "0-10000 PSI", category: "pressure_calibrator" },
    { type: "Pressure Calibrator", manufacturer: "Fluke", model: "718", range: "0-100 PSI", category: "pressure_calibrator" },
    { type: "Pressure Calibrator", manufacturer: "Fluke", model: "719", range: "0-300 PSI", category: "pressure_calibrator" },
    { type: "Pressure Calibrator", manufacturer: "Beamex", model: "MC6", range: "0-600 PSI", category: "pressure_calibrator" },
    { type: "Deadweight Tester", manufacturer: "Ametek", model: "P3125", range: "0-5000 PSI", category: "pressure_calibrator" }
  ],
  
  temperature: [
    // RTDs
    { type: "RTD Sensor", manufacturer: "Omega", model: "PR-13", range: "-200 to 850°C", category: "temperature_sensor" },
    { type: "RTD Pt100", manufacturer: "Rosemount", model: "0085", range: "-200 to 650°C", category: "temperature_sensor" },
    { type: "RTD Pt100", manufacturer: "Endress+Hauser", model: "iTHERM TM411", range: "-50 to 400°C", category: "temperature_sensor" },
    
    // Thermocouples
    { type: "Thermocouple Type K", manufacturer: "Omega", model: "KMQSS-125", range: "-200 to 1250°C", category: "thermocouple" },
    { type: "Thermocouple Type J", manufacturer: "Omega", model: "JMQSS-125", range: "-40 to 750°C", category: "thermocouple" },
    { type: "Thermocouple Type T", manufacturer: "Fluke", model: "80PK-1", range: "-250 to 350°C", category: "thermocouple" },
    
    // Temperature Transmitters
    { type: "Temperature Transmitter", manufacturer: "Rosemount", model: "3144P", range: "-200 to 850°C", category: "temperature_transmitter" },
    { type: "Temperature Transmitter", manufacturer: "Rosemount", model: "3244MV", range: "-50 to 250°C", category: "temperature_transmitter" },
    { type: "Temperature Transmitter", manufacturer: "Endress+Hauser", model: "iTEMP TMT142", range: "-200 to 800°C", category: "temperature_transmitter" },
    { type: "Temperature Transmitter", manufacturer: "Yokogawa", model: "YTA320", range: "-200 to 650°C", category: "temperature_transmitter" },
    
    // Temperature Calibrators
    { type: "Dry Block Calibrator", manufacturer: "Fluke", model: "9140", range: "35 to 350°C", category: "temperature_block" },
    { type: "Dry Block Calibrator", manufacturer: "Fluke", model: "9143", range: "33 to 350°C", category: "temperature_block" },
    { type: "Temperature Bath", manufacturer: "Fluke", model: "7381", range: "-45 to 150°C", category: "temperature_block" },
    { type: "Temperature Calibrator", manufacturer: "Ametek", model: "RTC-157", range: "35 to 650°C", category: "temperature_block" },
    
    // IR Thermometers
    { type: "IR Thermometer", manufacturer: "Fluke", model: "59 MAX", range: "-30 to 350°C", category: "thermometer" },
    { type: "IR Thermometer", manufacturer: "Fluke", model: "572", range: "-30 to 900°C", category: "thermometer" }
  ],
  
  electrical: [
    // Digital Multimeters
    { type: "Digital Multimeter", manufacturer: "Fluke", model: "87V", range: "1000V DC/AC", category: "digital_multimeter" },
    { type: "Digital Multimeter", manufacturer: "Fluke", model: "179", range: "1000V DC/AC", category: "digital_multimeter" },
    { type: "Digital Multimeter", manufacturer: "Fluke", model: "289", range: "1000V DC/AC", category: "digital_multimeter" },
    { type: "Bench Multimeter", manufacturer: "Fluke", model: "8845A", range: "1000V DC/AC", category: "digital_multimeter" },
    { type: "Bench Multimeter", manufacturer: "Fluke", model: "8846A", range: "1000V DC/AC", category: "digital_multimeter" },
    { type: "Digital Multimeter", manufacturer: "Keysight", model: "34401A", range: "1000V DC/AC", category: "digital_multimeter" },
    { type: "Digital Multimeter", manufacturer: "Keysight", model: "34465A", range: "1000V DC/AC", category: "digital_multimeter" },
    { type: "Digital Multimeter", manufacturer: "Keysight", model: "34470A", range: "1000V DC/AC", category: "digital_multimeter" },
    
    // Insulation Testers (Meggers)
    { type: "Insulation Tester", manufacturer: "Fluke", model: "1503", range: "0-999 GΩ", category: "insulation_tester" },
    { type: "Insulation Tester", manufacturer: "Fluke", model: "1507", range: "0-2000 MΩ", category: "insulation_tester" },
    { type: "Insulation Tester", manufacturer: "Fluke", model: "1550C", range: "0-2 TΩ", category: "insulation_tester" },
    { type: "Insulation Tester", manufacturer: "Megger", model: "MIT400", range: "0-200 GΩ", category: "insulation_tester" },
    { type: "Insulation Tester", manufacturer: "Megger", model: "MIT1000", range: "0-20 TΩ", category: "insulation_tester" },
    
    // Oscilloscopes
    { type: "Oscilloscope", manufacturer: "Tektronix", model: "TDS2024C", range: "200 MHz", category: "oscilloscope" },
    { type: "Oscilloscope", manufacturer: "Tektronix", model: "MDO3024", range: "200 MHz", category: "oscilloscope" },
    { type: "Oscilloscope", manufacturer: "Keysight", model: "DSOX3024A", range: "200 MHz", category: "oscilloscope" },
    { type: "Oscilloscope", manufacturer: "Keysight", model: "DSOX4024A", range: "200 MHz", category: "oscilloscope" },
    
    // Power Meters
    { type: "Power Quality Analyzer", manufacturer: "Fluke", model: "435", range: "1000V", category: "power_meter" },
    { type: "Power Quality Analyzer", manufacturer: "Fluke", model: "437", range: "1000V", category: "power_meter" },
    { type: "Power Meter", manufacturer: "Hioki", model: "PW3360", range: "600V", category: "power_meter" },
    { type: "Power Meter", manufacturer: "Yokogawa", model: "WT310", range: "1000V", category: "power_meter" },
    
    // Calibrators
    { type: "Multifunction Calibrator", manufacturer: "Fluke", model: "754", range: "30V/24mA", category: "multifunction_calibrator" },
    { type: "Multifunction Calibrator", manufacturer: "Fluke", model: "726", range: "30V/24mA", category: "multifunction_calibrator" },
    { type: "Multifunction Calibrator", manufacturer: "Beamex", model: "MC6", range: "30V/55mA", category: "multifunction_calibrator" },
    { type: "Multifunction Calibrator", manufacturer: "Druck", model: "DPI620", range: "30V/24mA", category: "multifunction_calibrator" },
    
    // Decade Boxes
    { type: "Resistance Decade Box", manufacturer: "IET Labs", model: "RS-201", range: "0.1Ω to 10MΩ", category: "resistance_decade" },
    { type: "Capacitance Decade Box", manufacturer: "IET Labs", model: "1433", range: "100pF to 11.11µF", category: "resistance_decade" }
  ],
  
  mechanical: [
    // Torque Tools
    { type: "Torque Wrench", manufacturer: "Norbar", model: "15027", range: "5-25 Nm", category: "torque_wrench" },
    { type: "Torque Wrench", manufacturer: "CDI", model: "2503MRMH", range: "30-250 Nm", category: "torque_wrench" },
    { type: "Torque Wrench", manufacturer: "Snap-on", model: "TECH3FR250", range: "50-250 Nm", category: "torque_wrench" },
    { type: "Electronic Torque Wrench", manufacturer: "Norbar", model: "EvoTorque", range: "10-100 Nm", category: "torque_wrench" },
    
    // Force Gauges
    { type: "Digital Force Gauge", manufacturer: "Mark-10", model: "M5-200", range: "0-200 lbf", category: "force_gauge" },
    { type: "Digital Force Gauge", manufacturer: "Chatillon", model: "DFE II", range: "0-500 N", category: "force_gauge" },
    { type: "Digital Force Gauge", manufacturer: "Imada", model: "ZP-500N", range: "0-500 N", category: "force_gauge" },
    
    // Scales
    { type: "Analytical Balance", manufacturer: "Mettler Toledo", model: "XPE205", range: "0-220 g", category: "weight_scale" },
    { type: "Precision Balance", manufacturer: "Mettler Toledo", model: "MS4002TS", range: "0-4200 g", category: "weight_scale" },
    { type: "Bench Scale", manufacturer: "Ohaus", model: "Valor 7000", range: "0-30 kg", category: "weight_scale" },
    { type: "Floor Scale", manufacturer: "Rice Lake", model: "Roughdeck", range: "0-5000 kg", category: "weight_scale" }
  ],
  
  dimensional: [
    // Micrometers
    { type: "Outside Micrometer", manufacturer: "Mitutoyo", model: "293-340-30", range: "0-25 mm", category: "micrometer" },
    { type: "Outside Micrometer", manufacturer: "Mitutoyo", model: "293-831-30", range: "0-150 mm", category: "micrometer" },
    { type: "Digital Micrometer", manufacturer: "Starrett", model: "734XFLZ", range: "0-25 mm", category: "micrometer" },
    { type: "Inside Micrometer", manufacturer: "Mitutoyo", model: "141-104", range: "5-30 mm", category: "micrometer" },
    
    // Calipers
    { type: "Digital Caliper", manufacturer: "Mitutoyo", model: "500-196-30", range: "0-150 mm", category: "digital_caliper" },
    { type: "Digital Caliper", manufacturer: "Mitutoyo", model: "500-197-30", range: "0-200 mm", category: "digital_caliper" },
    { type: "Digital Caliper", manufacturer: "Starrett", model: "798A-6/150", range: "0-150 mm", category: "digital_caliper" },
    { type: "Vernier Caliper", manufacturer: "Mitutoyo", model: "530-312", range: "0-150 mm", category: "vernier_caliper" },
    { type: "Height Gauge", manufacturer: "Mitutoyo", model: "570-312", range: "0-300 mm", category: "height_gauge" },
    
    // Gage Blocks
    { type: "Gage Block Set", manufacturer: "Mitutoyo", model: "516-936-26", range: "0.5-100 mm", category: "gauge_block" },
    { type: "Gage Block Set", manufacturer: "Starrett", model: "S229Z", range: "0.1-4 in", category: "gauge_block" },
    
    // Indicators
    { type: "Dial Indicator", manufacturer: "Mitutoyo", model: "2046S", range: "0-10 mm", category: "dial_indicator" },
    { type: "Digital Indicator", manufacturer: "Mitutoyo", model: "543-390B", range: "0-12.7 mm", category: "dial_indicator" },
    { type: "Test Indicator", manufacturer: "Starrett", model: "711", range: "0-0.06 in", category: "dial_indicator" }
  ]
};

// Flatten equipment database for search
const EQUIPMENT_LIST = [
  ...EQUIPMENT_DATABASE.pressure,
  ...EQUIPMENT_DATABASE.temperature,
  ...EQUIPMENT_DATABASE.electrical,
  ...EQUIPMENT_DATABASE.mechanical,
  ...EQUIPMENT_DATABASE.dimensional
];

// Get unique manufacturers
const MANUFACTURERS = [...new Set(EQUIPMENT_LIST.map(eq => eq.manufacturer))].sort();

// Search functions for autocomplete
function searchEquipment(query, category = null) {
  const lowerQuery = query.toLowerCase();
  let results = EQUIPMENT_LIST;
  
  if (category) {
    results = results.filter(eq => eq.category === category);
  }
  
  return results.filter(eq => 
    eq.type.toLowerCase().includes(lowerQuery) ||
    eq.manufacturer.toLowerCase().includes(lowerQuery) ||
    eq.model.toLowerCase().includes(lowerQuery)
  ).slice(0, 10); // Limit to 10 results
}

function searchManufacturers(query) {
  const lowerQuery = query.toLowerCase();
  return MANUFACTURERS.filter(m => m.toLowerCase().includes(lowerQuery)).slice(0, 10);
}

function getModelsByManufacturer(manufacturer, category = null) {
  let results = EQUIPMENT_LIST.filter(eq => eq.manufacturer === manufacturer);
  
  if (category) {
    results = results.filter(eq => eq.category === category);
  }
  
  return results;
}

function getEquipmentByModel(manufacturer, model) {
  return EQUIPMENT_LIST.find(eq => 
    eq.manufacturer === manufacturer && eq.model === model
  );
}
