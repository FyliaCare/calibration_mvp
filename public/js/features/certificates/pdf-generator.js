/**
 * PDF Generator Module
 * Handles PDF generation for calibration certificates
 */

const pdfGenerator = {
  /**
   * Generate PDF certificate
   */
  async generateCertificate(data) {
    // Load jsPDF if not already loaded
    if (typeof window.jspdf === 'undefined') {
      await this.loadJsPDF();
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    // Header
    this.addHeader(doc, data);

    // Equipment details
    this.addEquipmentDetails(doc, data);

    // Test results
    this.addTestResults(doc, data);

    // Footer
    this.addFooter(doc, data);

    return doc;
  },

  /**
   * Add header to PDF
   */
  addHeader(doc, data) {
    doc.setFontSize(18);
    doc.text('CALIBRATION CERTIFICATE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Certificate No: ${data.certificate_number || 'N/A'}`, 20, 40);
    doc.text(`Issue Date: ${data.date_of_issue || new Date().toISOString().split('T')[0]}`, 20, 50);
    doc.text(`Customer: ${data.customer || 'N/A'}`, 20, 60);
    doc.text(`Job Reference: ${data.job_reference || 'N/A'}`, 20, 70);
  },

  /**
   * Add equipment details to PDF
   */
  addEquipmentDetails(doc, data) {
    doc.setFontSize(14);
    doc.text('EQUIPMENT DETAILS', 20, 90);
    
    doc.setFontSize(10);
    doc.text(`Description: ${data.equipment_description || 'N/A'}`, 20, 100);
    doc.text(`Manufacturer: ${data.manufacturer || 'N/A'}`, 20, 110);
    doc.text(`Model/Type: ${data.model || 'N/A'}`, 20, 120);
    doc.text(`Serial Number: ${data.serial_number || 'N/A'}`, 20, 130);
    doc.text(`Range: ${data.equipment_range || 'N/A'}`, 20, 140);
    doc.text(`Accuracy: ${data.accuracy || 'N/A'}`, 20, 150);
  },

  /**
   * Add test results to PDF
   */
  addTestResults(doc, data) {
    const testPoints = data.test_points || [];
    
    if (testPoints.length === 0) return;

    doc.setFontSize(14);
    doc.text('TEST RESULTS', 20, 170);
    
    doc.setFontSize(10);
    
    // Table headers
    doc.text('Reference', 20, 180);
    doc.text('Measured', 60, 180);
    doc.text('Deviation', 100, 180);
    doc.text('Result', 140, 180);
    
    let yPos = 190;
    testPoints.forEach((point) => {
      const ref = point.reference_value || 0;
      const measured = point.measured_value || 0;
      const deviation = (parseFloat(measured) - parseFloat(ref)).toFixed(3);
      const result = point.pass_fail || 'N/A';
      
      doc.text(String(ref), 20, yPos);
      doc.text(String(measured), 60, yPos);
      doc.text(String(deviation), 100, yPos);
      doc.text(String(result), 140, yPos);
      yPos += 10;
      
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
  },

  /**
   * Add footer to PDF
   */
  addFooter(doc, data) {
    doc.setFontSize(8);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
    doc.text('CalPro - Professional Calibration Management System', 20, 285);
  },

  /**
   * Download PDF
   */
  async download(data, filename) {
    const doc = await this.generateCertificate(data);
    const fname = filename || `${data.certificate_number}_Certificate.pdf`;
    doc.save(fname);
    return fname;
  },

  /**
   * Load jsPDF library dynamically
   */
  loadJsPDF() {
    return new Promise((resolve, reject) => {
      if (window.jsPDF) {
        resolve();
        return;
      }

      if (window.loadJsPDF) {
        window.loadJsPDF();
        
        const checkInterval = setInterval(() => {
          if (window.jspdf) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error('Failed to load jsPDF'));
        }, 10000);
      } else {
        reject(new Error('jsPDF loader not available'));
      }
    });
  }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = pdfGenerator;
}

// Export to window for global access
window.pdfGenerator = pdfGenerator;
