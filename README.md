
# 🎯 Calibration MVP - Professional Instrument Calibration System

A comprehensive, offline-first Progressive Web Application (PWA) for managing instrument calibration certificates. Built for calibration laboratories, quality control departments, and field technicians who need reliable certificate management even without internet connectivity.

## ✨ Features

### 🔧 Core Functionality
- **Multi-instrument Support**: Pressure gauges, torque wrenches, electrical meters, temperature sensors, flow meters, and force gauges
- **Offline-First Architecture**: Create, edit, and manage certificates without internet connection
- **Professional PDF Generation**: Generate publication-ready calibration certificates
- **Digital Signature Capture**: Touch-friendly signature pad with save/clear functionality
- **File Attachments**: Support for images, PDFs, and documents
- **Real-time Calculations**: Automatic deviation, error percentage, and pass/fail determination

### 📊 Advanced Features
- **Multi-step Form Interface**: Guided certificate creation process
- **Template System**: Pre-configured test point templates for standard procedures
- **Uncertainty Calculations**: Built-in measurement uncertainty calculations
- **Traceability Management**: Complete chain of traceability documentation
- **Search & Filter**: Advanced record management with multiple filter options
- **Export/Import**: JSON and CSV export for data portability
- **Auto-sync**: Automatic synchronization when online

### 🛡️ Quality & Compliance
- **Audit Trail**: Complete change tracking and user activity logs
- **Data Validation**: Comprehensive input validation and error checking
- **Standards Compliance**: Follows ISO/IEC 17025 calibration certificate requirements
- **Version Control**: Record versioning and change management
- **Backup & Recovery**: Built-in data backup and recovery mechanisms

## 🚀 Quick Start

### Prerequisites
- Node.js 14.0 or higher
- Modern web browser with PWA support
- SQLite3 (included with Node.js installation)

### Installation

1. **Clone or extract the project**
   ```bash
   cd calibration_mvp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Access the application**
   Open your browser to `http://localhost:3000`

### 📱 Install as PWA
1. Open the application in Chrome, Edge, or Safari
2. Look for the "Install" prompt in the address bar
3. Click "Install" to add to your desktop/home screen
4. Launch the app like any native application

## 💻 Usage Guide

### Creating a New Certificate

1. **Basic Information**
   - Enter certificate number (auto-generated if empty)
   - Select instrument type
   - Set issue and due dates
   - Add customer and job reference information

2. **Equipment Details**
   - Equipment description and manufacturer
   - Model, serial number, and specifications
   - Full scale range and accuracy specifications
   - Environmental test conditions

3. **Test Results**
   - Add test points manually or use standard templates
   - Enter reference and measured values
   - System automatically calculates deviations and pass/fail status
   - Add notes and attachments as needed

4. **Review & Sign**
   - Preview the complete certificate
   - Add technician information and certifications
   - Capture digital signature
   - Save locally and/or generate PDF

### Managing Records

- **Search**: Use the search bar to find certificates by number, description, or customer
- **Filter**: Filter by sync status, instrument type, or test results
- **Export**: Export all records or filtered subsets to JSON/CSV
- **Sync**: Manually sync records or rely on automatic synchronization

### Working Offline

The application is designed to work seamlessly offline:
- All certificate data is stored locally using IndexedDB
- Create and edit certificates without internet connection
- Records are automatically synced when connection is restored
- Service Worker ensures the app loads even when offline

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
HOST=localhost
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
DATABASE_PATH=./calibration.db
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### Instrument Configuration

Add or modify instrument types in `public/app.js`:

```javascript
const INSTRUMENTS = {
  custom_instrument: {
    label: 'Custom Instrument',
    units: ['Unit1', 'Unit2'],
    standardPoints: [0, 25, 50, 75, 100],
    toleranceCalculation: (record) => {
      // Custom tolerance calculation
      return calculatedTolerance;
    }
  }
};
```

## 🗄️ Database Schema

The application uses SQLite with the following main tables:

- **records**: Main certificate information
- **test_results**: Individual test point data
- **attachments**: File attachments metadata
- **audit_log**: Change tracking and user activity

## 📡 API Endpoints

### Public Endpoints
- `GET /health` - System health check
- `POST /api/push` - Create/update calibration records
- `GET /api/records` - List records with filtering
- `GET /api/records/:id` - Get specific record details
- `GET /api/export` - Export data in JSON/CSV format
- `POST /api/upload` - File upload handler

### Response Formats

All API responses follow a consistent format:
```json
{
  "ok": true,
  "data": {},
  "message": "Success message",
  "errors": []
}
```

## 🔒 Security Features

- **Input Validation**: Comprehensive server-side validation
- **File Upload Security**: Type checking and size limits
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Configurable cross-origin policies
- **Audit Logging**: Complete activity tracking
- **Data Encryption**: Ready for HTTPS deployment

## 🎨 Customization

### Styling
Modify `public/styles.css` to customize the appearance:
- Color schemes and branding
- Layout and spacing
- Print styles for certificates
- Responsive breakpoints

### PDF Templates
Customize certificate layouts in the `generatePdfFromRecord` function:
- Company logos and headers
- Certificate layouts and formatting
- Additional data fields
- Digital signature placement

## 🚀 Deployment

### Local Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Production Deployment
```bash
# Install production dependencies
npm install --production

# Start with PM2 (recommended)
npm install -g pm2
pm2 start server.js --name calibration-mvp

# Or use standard Node.js
NODE_ENV=production npm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📱 Browser Support

- ✅ Chrome 80+ (Recommended)
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ⚠️ Internet Explorer (Not supported)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code formatting
- Add comprehensive comments
- Test offline functionality
- Ensure responsive design
- Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

**Application won't start**
- Check Node.js version (`node --version`)
- Ensure all dependencies are installed (`npm install`)
- Check port availability (default: 3000)

**Database errors**
- Ensure write permissions in project directory
- Check SQLite3 installation
- Review server logs for detailed error messages

**Sync issues**
- Verify internet connection
- Check server availability
- Clear browser cache and reload

**PDF generation problems**
- Ensure jsPDF libraries are loaded
- Check for JavaScript errors in browser console
- Verify signature and attachment data

### Getting Help

- 📧 Email: support@calibrationmvp.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/calibration-mvp/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/calibration-mvp/wiki)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/calibration-mvp/discussions)

## 🔄 Version History

### v2.0.0 (Current)
- Complete rewrite with modern architecture
- Enhanced offline capabilities
- Professional UI/UX design
- Advanced PDF generation
- Comprehensive API

### v1.0.0
- Initial release
- Basic certificate creation
- Simple sync functionality

## 🙏 Acknowledgments

- jsPDF for PDF generation
- IndexedDB for offline storage
- Service Workers for PWA functionality
- SQLite for reliable data storage
- All contributors and testers

## 📊 Project Status

![Development Status](https://img.shields.io/badge/status-active-brightgreen)
![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)

---

**Built with ❤️ for calibration professionals worldwide** (Hybrid Offline-first App)

This is a minimal hybrid (offline-first) calibration app scaffold that:
- Supports Pressure, Torque (mechanical), Electrical, and Temperature instrument records.
- Provides a static PWA frontend (IndexedDB) for offline data entry, signature capture, local PDF generation.
- Syncs to a Node/Express backend (SQLite) when network is available via `/api/push`.

## Structure
- server.js - Express backend + SQLite storage
- package.json - Node dependencies
- calibration.db - created automatically on first run
- /public - static frontend files (index.html, app.js, styles.css, service-worker.js)
- README.md - this file

## Quick start (Linux / macOS / WSL / Windows with Node)
1. Install Node.js (>=16 recommended).
2. In the project folder:
   ```
   npm install
   npm start
   ```
3. Open your browser at http://localhost:3000

## Frontend features
- Choose instrument type (Pressure, Torque, Electrical, Temperature)
- Fill Page-1 metadata and Page-2 results table (editable)
- Capture signature (touch/mouse)
- Generate PDF (opens as new tab) and save locally
- Works offline (PWA + IndexedDB). Tap **Sync** to push local records to server.

## Notes & Next Steps
- This scaffold is intentionally simple and meant to be extended. Production must add:
  - Authentication + user accounts
  - Encrypted local storage and transport (HTTPS)
  - Robust conflict resolution & sync acknowledgements
  - Better PDF layout matching corporate certificate templates
  - Photo attachments, calibration equipment records, uncertainty calculation improvements

