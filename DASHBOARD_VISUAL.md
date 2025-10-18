# Dashboard Visual Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                         📊 DASHBOARD                                 │
│  Welcome back! Here's your calibration overview for today.          │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ ⚠️  3 Calibrations Overdue                                      [×] │
│     You have equipment that requires immediate attention.           │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────┬────────────────┬────────────────┬────────────────┐
│ 📦 Total       │ 📅 Due This    │ ✅ Completed   │ 📈 Compliance  │
│    Equipment   │    Week        │    Today       │    Rate        │
│                │                │                │                │
│    248         │    15          │    7           │    98.5%       │
│  ↑ 12%         │  3 critical    │  On schedule   │  ↑ 2.1%        │
│  Active        │    items       │                │  Above target  │
└────────────────┴────────────────┴────────────────┴────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ [ Overview ] [ Trends ] [ Compliance ]                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📊 Calibrations This Month          🥧 Equipment Status           │
│  ┌──────────────────────┐            ┌──────────────────────┐      │
│  │                      │            │                      │      │
│  │   [Bar Chart         │            │   [Pie Chart         │      │
│  │    Weekly            │            │    Distribution      │      │
│  │    Breakdown]        │            │    by Status]        │      │
│  │                      │            │                      │      │
│  │  Week 1: 18          │            │  Operational: 185    │      │
│  │  Week 2: 22          │            │  Due Soon: 42        │      │
│  │  Week 3: 15          │            │  Overdue: 8          │      │
│  │  Week 4: 12          │            │  Maintenance: 13     │      │
│  └──────────────────────┘            └──────────────────────┘      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ 📋 Equipment Status Overview                                        │
├──────────────┬────────────┬──────────┬──────────────┬─────────────┤
│ Equipment    │ Serial No  │ Status   │ Next Calib   │ Compliance  │
├──────────────┼────────────┼──────────┼──────────────┼─────────────┤
│ Digital      │ DMM-2500   │ ✅ Oper  │ Jul 15, 2025 │ ████████100%│
│ Multimeter   │  -001      │ ational  │ 45 days      │             │
├──────────────┼────────────┼──────────┼──────────────┼─────────────┤
│ Pressure     │ PG-1000    │ ⚠️ Due   │ Jun 08, 2025 │ ███████ 95% │
│ Gauge        │  -042      │ Soon     │ 6 days       │             │
├──────────────┼────────────┼──────────┼──────────────┼─────────────┤
│ Temperature  │ TS-550     │ 🔴 Over  │ May 28, 2025 │ █████   78% │
│ Sensor       │  -128      │ due      │ -5 days      │             │
├──────────────┼────────────┼──────────┼──────────────┼─────────────┤
│ Flow Meter   │ FM-800     │ 🔧 Main  │ Jun 20, 2025 │ ██████  88% │
│              │  -035      │ tenance  │ 18 days      │             │
├──────────────┼────────────┼──────────┼──────────────┼─────────────┤
│ Oscilloscope │ OSC-3000   │ ✅ Oper  │ Aug 05, 2025 │ ████████100%│
│              │  -007      │ ational  │ 63 days      │             │
└──────────────┴────────────┴──────────┴──────────────┴─────────────┘

┌─────────────────────────────────┬───────────────────────────────────┐
│ 📅 Upcoming Calibrations        │ 🔔 Recent Activity                │
├─────────────────────────────────┼───────────────────────────────────┤
│                                 │                                   │
│ ┌─ Pressure Gauge PG-1000 ────┐ │ ● ✅ Calibration Completed        │
│ │  🔴 High Priority            │ │   │  Digital Multimeter DMM-2500  │
│ │  📅 Jun 08, 2025 @ 09:00 AM  │ │   │  2 hours ago • John Smith    │
│ │  📍 Lab A - Bay 3            │ │   │                               │
│ │  👤 John Smith               │ │   ● ⚠️ Calibration Overdue       │
│ └──────────────────────────────┘ │   │  Temperature Sensor TS-550    │
│                                 │   │  4 hours ago • System         │
│ ┌─ Digital Multimeter ────────┐ │   │                               │
│ │  🟡 Medium Priority          │ │   ● 🔧 Maintenance Scheduled     │
│ │  📅 Jun 09, 2025 @ 02:00 PM  │ │   │  Flow Meter FM-800           │
│ │  📍 Lab B - Bay 1            │ │   │  6 hours ago • Sarah Johnson │
│ │  👤 Sarah Johnson            │ │   │                               │
│ └──────────────────────────────┘ │   ● 📄 Monthly Report Generated  │
│                                 │   │  Compliance report for May    │
│ ┌─ Temperature Sensor ─────────┐ │   │  1 day ago • System          │
│ │  🟢 Low Priority             │ │   │                               │
│ │  📅 Jun 10, 2025 @ 11:00 AM  │ │   ● 👤 New User Added            │
│ │  📍 Lab A - Bay 2            │ │      Emily Chen as Technician   │
│ │  👤 Mike Davis               │ │      2 days ago • Admin          │
│ └──────────────────────────────┘ │                                   │
│                                 │                                   │
└─────────────────────────────────┴───────────────────────────────────┘
```

## Color Legend

### Status Colors
- 🟢 **Green** - Operational, Success, Low Priority
- 🟡 **Yellow** - Due Soon, Warning, Medium Priority  
- 🔴 **Red** - Overdue, Danger, High Priority
- 🔵 **Blue** - Maintenance, Info
- 🟣 **Purple** - Reports, Special

### Icons Used
- 📦 Package (Total Equipment)
- 📅 Calendar (Due This Week)
- ✅ CheckCircle (Completed)
- 📈 TrendingUp (Compliance)
- ⚠️ AlertTriangle (Warnings)
- 🔔 Bell (Notifications)
- 📍 MapPin (Location)
- 👤 User (Person)
- 🔧 Wrench (Maintenance)
- 📄 FileText (Reports)
- 🥧 Pie (Distribution)
- 📊 Bar (Statistics)

## Interactive Elements

### Hover Effects
```
┌─────────────┐         ┌─────────────┐
│   Card      │  --->   │   Card      │  (elevated shadow)
└─────────────┘         └─────────────┘

┌─────────────┐         ┌─────────────┐
│ Table Row   │  --->   │ Table Row   │  (background highlight)
└─────────────┘         └─────────────┘
```

### Tab Switching
```
[ Overview ] [ Trends ] [ Compliance ]
   ▲ Active    Inactive    Inactive

[ Overview ] [ Trends ] [ Compliance ]
   Inactive    ▲ Active    Inactive
```

### Dismissible Alert
```
┌─────────────────────────────────────────────────┐
│ ⚠️  Alert Message                          [×]  │
└─────────────────────────────────────────────────┘
                ↓ Click X
         (Alert disappears)
```

## Responsive Breakpoints

### Desktop (1024px+)
```
┌──────────────────────────────────────────────┐
│ [Stat] [Stat] [Stat] [Stat]  ← 4 columns    │
│ [Chart]      [Chart]          ← 2 columns    │
│ [Table - Full Width]                         │
│ [Upcoming]   [Activity]       ← 2 columns    │
└──────────────────────────────────────────────┘
```

### Tablet (768px - 1023px)
```
┌────────────────────────────┐
│ [Stat] [Stat]  ← 2 columns │
│ [Stat] [Stat]              │
│ [Chart]        ← 1 column  │
│ [Chart]                    │
│ [Table - Scroll]           │
│ [Upcoming]     ← 2 columns │
│ [Activity]                 │
└────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────┐
│ [Stat]       │
│ [Stat]       │ ← 1 column
│ [Stat]       │   (stacked)
│ [Stat]       │
│ [Chart]      │
│ [Chart]      │
│ [Table]      │
│  (scroll →)  │
│ [Upcoming]   │
│ [Activity]   │
└──────────────┘
```

## Data Flow Visualization

```
Current (Mock Data):
┌──────────────────┐
│ DashboardPage.tsx│
│   (Mock Arrays)  │
└────────┬─────────┘
         ↓
┌────────┴─────────┐
│ Child Components │
│  - StatCard      │
│  - Chart         │
│  - Table         │
│  - Feed          │
└──────────────────┘


Future (Real Data):
┌──────────────────┐
│ DashboardPage.tsx│
└────────┬─────────┘
         ↓
┌────────┴─────────┐
│ TanStack Query   │
│   useQuery()     │
└────────┬─────────┘
         ↓
┌────────┴─────────┐
│ API Endpoints    │
│ GET /equipment   │
│ GET /calibrations│
└────────┬─────────┘
         ↓
┌────────┴─────────┐
│ SQLite Database  │
│  via Prisma ORM  │
└────────┬─────────┘
         ↓
┌────────┴─────────┐
│ Child Components │
│  (Real Data)     │
└──────────────────┘
```

## Component Hierarchy

```
DashboardPage
├── Alert (Warning Banner)
├── StatCard (×4)
│   ├── Icon
│   ├── Title
│   ├── Value
│   ├── Trend
│   └── Description
├── Tabs
│   ├── TabsList
│   │   └── TabsTrigger (×3)
│   └── TabsContent (×3)
│       └── CalibrationChart (×4 total)
├── EquipmentStatusTable
│   ├── Table Header
│   └── Table Rows (×N)
│       ├── Badge
│       └── Progress
├── UpcomingCalibrations
│   └── Calibration Card (×N)
│       ├── Badge (Priority)
│       └── Icons (Calendar, MapPin, User)
└── ActivityFeed
    └── Activity Item (×N)
        ├── Icon (Type-specific)
        ├── Badge (Type)
        └── Timestamp
```

---

**Visual Reference Complete** ✅  
This ASCII representation shows the complete dashboard layout and structure.
