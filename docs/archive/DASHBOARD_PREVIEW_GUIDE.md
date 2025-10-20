# Dashboard UI Preview Guide

## How to View the New Dashboard

### 1. Start the Servers (if not already running)

**Backend:**
```powershell
cd "c:\Users\Jay Monty\Desktop\Projects\calibration_mvp\backend"
npm run dev
```

**Frontend:**
```powershell
cd "c:\Users\Jay Monty\Desktop\Projects\calibration_mvp\frontend"
npm run dev
```

### 2. Access the Dashboard

1. Open your browser to: `http://localhost:3000`
2. Login with default credentials:
   - Email: `admin@calpro.com`
   - Password: `Admin@123`
3. You'll be redirected to the advanced dashboard

## Dashboard Sections

### 📊 Top Stats (4 Cards)
- **Total Equipment**: Shows total active instruments with trend
- **Due This Week**: Displays upcoming calibrations with critical count
- **Completed Today**: Today's completed calibrations
- **Compliance Rate**: Overall compliance percentage with improvement

### ⚠️ Alert Banner
- Yellow warning banner for overdue items
- Dismissible with X button
- Shows count of items needing attention

### 📈 Charts Section (3 Tabs)
1. **Overview Tab**:
   - Bar Chart: Weekly calibrations
   - Pie Chart: Equipment status distribution

2. **Trends Tab**:
   - Area Chart: 6-month calibration trend

3. **Compliance Tab**:
   - Line Chart: Monthly compliance history

### 📋 Equipment Status Table
- Comprehensive table with 5 equipment items
- Columns:
  - Equipment name
  - Serial number
  - Status badge (color-coded)
  - Next calibration date
  - Days until due (with color warnings)
  - Compliance progress bar

### 📅 Upcoming Calibrations
- List of next 3 scheduled calibrations
- Shows:
  - Equipment name
  - Priority badge (High/Medium/Low)
  - Date and time
  - Location
  - Assigned technician

### 🔔 Activity Feed
- Timeline of recent system activities
- Activity types:
  - ✅ Calibration completed (green)
  - ⚠️ Alerts (red)
  - 🔧 Maintenance (blue)
  - 📄 Reports (purple)
  - 👤 User activities (yellow)

## Color Coding

### Status Badges
- 🟢 **Green**: Operational, Success, Low Priority
- 🟡 **Yellow**: Due Soon, Warnings, Medium Priority
- 🔴 **Red**: Overdue, Errors, High Priority
- 🔵 **Blue**: Maintenance, Info
- 🟣 **Purple**: Reports, Special

### Progress Bars
- 🟢 **Green**: 95%+ compliance (success)
- 🟡 **Yellow**: 80-94% compliance (warning)
- 🔴 **Red**: Below 80% compliance (danger)

## Interactive Features

### Hover Effects
- All cards have subtle shadow on hover
- Table rows highlight on hover
- Buttons and links have smooth transitions

### Dismissible Alerts
- Click X button to dismiss alert banners
- Smooth fade-out animation

### Tab Navigation
- Click tabs to switch between chart views
- Active tab highlighted
- Smooth content transitions

## Responsive Design

### Desktop (1024px+)
- 4-column stats grid
- 2-column charts
- Full table width
- 2-column bottom section

### Tablet (768px-1023px)
- 2-column stats grid
- Single column charts
- Scrollable table
- 2-column bottom section

### Mobile (<768px)
- Single column layout
- Stacked stats cards
- Scrollable table
- Stacked bottom section

## Mock Data Details

### Sample Equipment
1. Digital Multimeter DMM-2500 (Operational, 45 days)
2. Pressure Gauge PG-1000 (Due Soon, 6 days)
3. Temperature Sensor TS-550 (Overdue, -5 days)
4. Flow Meter FM-800 (Maintenance, 18 days)
5. Oscilloscope OSC-3000 (Operational, 63 days)

### Chart Data
- 6 months of calibration trends
- Weekly breakdown for current month
- Equipment distribution by status
- Compliance tracking over time

## Technical Details

### Components Used
- 4 new UI components (Badge, Alert, Tabs, Progress)
- 5 new dashboard components (StatCard, CalibrationChart, etc.)
- Recharts for visualizations
- Lucide React for icons
- Tailwind CSS for styling

### Data Flow (Currently)
```
DashboardPage.tsx
    ↓
Mock Data (in component)
    ↓
Child Components (StatCard, Chart, Table, etc.)
    ↓
Rendered UI
```

### Future Data Flow (After Backend Integration)
```
DashboardPage.tsx
    ↓
TanStack Query Hooks
    ↓
API Endpoints (backend)
    ↓
Database (SQLite)
    ↓
Real Data
    ↓
Child Components
    ↓
Rendered UI
```

## Next Steps for Development

1. **Equipment Pages**: Create list, detail, and form views
2. **Client Management**: Build client profile pages
3. **Calibration Records**: History and new record forms
4. **API Integration**: Replace mock data with real endpoints
5. **Search & Filter**: Add data discovery features
6. **Pagination**: Handle large datasets
7. **Export Features**: PDF/Excel report generation
8. **Real-time Updates**: WebSocket integration for live data

## Tips for Customization

### Changing Colors
- Edit `tailwind.config.js` for global theme colors
- Modify variant styles in component files
- Use CSS variables for dynamic theming

### Adding More Charts
- Import additional chart types from Recharts
- Create new data structures
- Add new tabs in the dashboard

### Modifying Layout
- Adjust grid columns in className (e.g., `lg:grid-cols-4`)
- Change spacing with gap-* utilities
- Reorder sections as needed

## Performance Notes

- All components are optimized with React best practices
- Charts use ResponsiveContainer for adaptive sizing
- No unnecessary re-renders
- Efficient mock data structures
- Ready for React.memo() optimization if needed

---

**Status**: ✅ Dashboard UI Complete and Ready for Use
**Last Updated**: June 2025
**Version**: 2.0.0
