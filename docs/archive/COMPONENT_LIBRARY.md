# Component Library Documentation

## UI Components (`frontend/src/components/ui/`)

### Badge
**Purpose**: Display status indicators, tags, and labels

**Props:**
```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  className?: string;
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<Badge variant="success">Active</Badge>
<Badge variant="danger">Overdue</Badge>
<Badge variant="warning">Due Soon</Badge>
```

**Variants:**
- `default`: Primary blue background
- `success`: Green background (operational, completed)
- `warning`: Yellow background (due soon, pending)
- `danger`: Red background (overdue, error)
- `info`: Blue background (information)
- `outline`: Transparent with border

---

### Alert
**Purpose**: Display contextual messages and notifications

**Props:**
```typescript
interface AlertProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
  children: React.ReactNode;
}
```

**Sub-components:**
- `AlertTitle`: Bold heading
- `AlertDescription`: Description text

**Usage:**
```tsx
<Alert variant="warning" dismissible onDismiss={handleDismiss}>
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>
    You have 3 calibrations overdue.
  </AlertDescription>
</Alert>
```

**Features:**
- Icon automatically displayed based on variant
- Dismissible functionality with X button
- Smooth fade animations
- Dark mode support

---

### Tabs
**Purpose**: Organize content into switchable sections

**Components:**
- `Tabs`: Container with state management
- `TabsList`: Horizontal list of tab triggers
- `TabsTrigger`: Individual tab button
- `TabsContent`: Content panel for each tab

**Props:**
```typescript
interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="trends">Trends</TabsTrigger>
  </TabsList>
  
  <TabsContent value="overview">
    <p>Overview content here</p>
  </TabsContent>
  
  <TabsContent value="trends">
    <p>Trends content here</p>
  </TabsContent>
</Tabs>
```

**Features:**
- Context-based state management
- Active tab highlighting
- Smooth transitions
- Keyboard accessible

---

### Progress
**Purpose**: Display progress indicators and completion percentages

**Props:**
```typescript
interface ProgressProps {
  value?: number;        // Current value (default: 0)
  max?: number;          // Maximum value (default: 100)
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}
```

**Usage:**
```tsx
<Progress value={75} variant="success" />
<Progress value={50} max={200} variant="warning" />
```

**Variants:**
- `default`: Primary blue fill
- `success`: Green fill (95%+)
- `warning`: Yellow fill (80-94%)
- `danger`: Red fill (<80%)

**Features:**
- Smooth animations
- Automatic percentage calculation
- Responsive width
- Dark mode support

---

## Dashboard Components (`frontend/src/components/dashboard/`)

### StatCard
**Purpose**: Display key performance indicators with icons and trends

**Props:**
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}
```

**Usage:**
```tsx
<StatCard
  title="Total Equipment"
  value="248"
  icon={Package}
  trend={{ value: 12, isPositive: true }}
  description="Active instruments"
  variant="default"
/>
```

**Features:**
- Color-coded icon backgrounds
- Trend indicators with arrows
- Hover shadow effect
- Responsive layout

---

### CalibrationChart
**Purpose**: Display data visualizations using Recharts

**Props:**
```typescript
interface CalibrationChartProps {
  type: 'line' | 'area' | 'bar' | 'pie';
  data: any[];
  title: string;
  description?: string;
  dataKey?: string;        // default: 'value'
  xAxisKey?: string;       // default: 'name'
  colors?: string[];       // default: predefined colors
}
```

**Usage:**
```tsx
// Line Chart
<CalibrationChart
  type="line"
  data={complianceData}
  title="Compliance Rate History"
  description="Monthly compliance tracking"
  dataKey="value"
  xAxisKey="name"
/>

// Pie Chart
<CalibrationChart
  type="pie"
  data={statusData}
  title="Equipment Status"
  dataKey="value"
  xAxisKey="name"
/>
```

**Chart Types:**
1. **Line**: Trends over time
2. **Area**: Filled area charts with gradients
3. **Bar**: Comparison between categories
4. **Pie**: Distribution percentages

**Features:**
- Responsive containers
- Interactive tooltips
- Legend display
- Grid lines for reference
- Dark mode compatible
- Customizable colors

---

### EquipmentStatusTable
**Purpose**: Comprehensive equipment monitoring table

**Props:**
```typescript
interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  status: 'operational' | 'due' | 'overdue' | 'maintenance';
  nextCalibration: string;
  daysUntilDue: number;
  compliance: number;
}

interface EquipmentStatusTableProps {
  equipment: Equipment[];
}
```

**Usage:**
```tsx
<EquipmentStatusTable equipment={equipmentData} />
```

**Features:**
- Status badges with icons
- Progress bars for compliance
- Color-coded days until due
- Hover effects on rows
- Responsive scrolling
- Automatic status detection

**Status Types:**
- `operational`: Green, CheckCircle icon
- `due`: Yellow, Clock icon
- `overdue`: Red, AlertCircle icon
- `maintenance`: Blue, Wrench icon

---

### UpcomingCalibrations
**Purpose**: Display scheduled calibration activities

**Props:**
```typescript
interface Calibration {
  id: string;
  equipmentName: string;
  date: string;
  time: string;
  location: string;
  technician: string;
  priority: 'high' | 'medium' | 'low';
}

interface UpcomingCalibrationsProps {
  calibrations: Calibration[];
}
```

**Usage:**
```tsx
<UpcomingCalibrations calibrations={scheduledItems} />
```

**Features:**
- Priority badges (High/Medium/Low)
- Date, time, location display
- Technician assignment
- Icon-based information display
- Hover effects
- Responsive layout

**Priority Colors:**
- `high`: Red danger badge
- `medium`: Yellow warning badge
- `low`: Green success badge

---

### ActivityFeed
**Purpose**: Timeline of recent system activities and events

**Props:**
```typescript
interface Activity {
  id: string;
  type: 'calibration' | 'maintenance' | 'alert' | 'report' | 'user';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}
```

**Usage:**
```tsx
<ActivityFeed activities={recentActivities} />
```

**Features:**
- Timeline visualization with connecting lines
- Icon-based activity types
- Color-coded by activity type
- Timestamp and user attribution
- Activity badges
- Smooth hover effects

**Activity Types:**
- `calibration`: Green CheckCircle icon
- `maintenance`: Blue Wrench icon
- `alert`: Red AlertCircle icon
- `report`: Purple FileText icon
- `user`: Yellow UserPlus icon

---

## Common Patterns

### Color System
```typescript
// Success (Green)
- Operational equipment
- Completed tasks
- Positive trends
- High compliance

// Warning (Yellow)
- Due soon items
- Medium priority
- 80-94% compliance
- Pending actions

// Danger (Red)
- Overdue items
- Critical alerts
- Below 80% compliance
- High priority

// Info (Blue)
- Maintenance status
- General information
- Default states

// Purple
- Reports
- Special activities
```

### Icon Usage
All components use `lucide-react` icons:
```tsx
import { Package, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
```

### Styling Approach
- Tailwind CSS utility classes
- `cn()` helper for conditional classes
- Consistent spacing (p-4, gap-6)
- Rounded corners (rounded-lg)
- Border colors (border-border)
- Text colors (text-muted-foreground)

### Dark Mode Support
All components automatically support dark mode through Tailwind's `dark:` prefix:
```tsx
className="bg-blue-50 dark:bg-blue-900/20"
```

---

## Integration Examples

### Full Dashboard Layout
```tsx
<div className="p-6 space-y-6">
  {/* Stats */}
  <div className="grid grid-cols-4 gap-6">
    <StatCard {...statsProps} />
  </div>
  
  {/* Charts */}
  <Tabs defaultValue="overview">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <CalibrationChart {...chartProps} />
    </TabsContent>
  </Tabs>
  
  {/* Table */}
  <EquipmentStatusTable equipment={data} />
  
  {/* Bottom Section */}
  <div className="grid grid-cols-2 gap-6">
    <UpcomingCalibrations {...scheduleProps} />
    <ActivityFeed {...activityProps} />
  </div>
</div>
```

### With Real API Data (Future)
```tsx
// Using TanStack Query
const { data: equipment } = useQuery({
  queryKey: ['equipment'],
  queryFn: fetchEquipment,
});

<EquipmentStatusTable equipment={equipment || []} />
```

---

## Best Practices

### Performance
- Use React.memo() for expensive components
- Implement virtualization for large lists
- Lazy load charts when not visible
- Optimize re-renders with proper dependencies

### Accessibility
- All components have proper ARIA labels
- Keyboard navigation supported
- Focus indicators visible
- Screen reader friendly

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly tap targets (min 44px)
- Horizontal scrolling for tables on mobile

### Error Handling
- Display empty states when no data
- Show loading skeletons
- Handle API errors gracefully
- Provide fallback UI

---

## File Structure
```
frontend/src/components/
├── ui/
│   ├── Badge.tsx
│   ├── Alert.tsx
│   ├── Tabs.tsx
│   ├── Progress.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
└── dashboard/
    ├── StatCard.tsx
    ├── CalibrationChart.tsx
    ├── EquipmentStatusTable.tsx
    ├── UpcomingCalibrations.tsx
    └── ActivityFeed.tsx
```

---

**Version**: 2.0.0  
**Last Updated**: June 2025  
**Status**: ✅ Production Ready
