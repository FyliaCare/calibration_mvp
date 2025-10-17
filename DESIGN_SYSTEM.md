# CalPro Design System - Color Guidelines

## 🎨 Official Color Palette

### Primary Brand Colors
```
CalPro Gold (Primary):     #FFB800
CalPro Gold Dark:          #FF8C00
CalPro Gold Light:         #FFC933
```

### Background Colors
```
Dark Primary:              #0f0f23  (Main background)
Dark Secondary:            #1a1a2e  (Cards, sections)
Dark Tertiary:             #16213e  (Sidebar gradient bottom)
```

### Text Colors
```
Text Primary (on dark):    #e2e8f0  (Main text)
Text Secondary (on dark):  #cbd5e0  (Secondary text)
Text Muted:                #94a3b8  (Hints, disabled)
Text Dark (on light):      #1a1a1a  (Headings on white)
```

### Status Colors
```
Success:                   #10b981  (Green - completed, active)
Warning:                   #f59e0b  (Amber - pending, caution)
Danger:                    #ef4444  (Red - error, delete)
Info:                      #3b82f6  (Blue - information)
```

### UI Element Colors
```
Border Default:            rgba(255, 184, 0, 0.2)  (Gold with opacity)
Border Focus:              #FFB800                   (Solid gold)
Shadow:                    rgba(255, 184, 0, 0.15)  (Gold glow)
Hover Background:          rgba(255, 184, 0, 0.1)   (Subtle gold)
```

### Stat Card Icon Colors (Keep these for visual distinction)
```
Blue Stats:                #3b82f6  (Total/General)
Green Stats:               #10b981  (Positive/Active)
Orange Stats:              #f59e0b  (Pending/Warning)
Purple Stats:              #8b5cf6  (Special/VIP)
```

## 📏 Typography

### Font Families
```
Primary Font:              'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
Monospace Font:            'Courier New', monospace
```

### Font Sizes
```
Heading 1:                 32px (Page titles)
Heading 2:                 24px (Section headers)
Heading 3:                 20px (Card headers)
Body Large:                16px (Primary content)
Body Regular:              14px (Standard text)
Body Small:                12px (Meta info)
Caption:                   10px (Labels)
```

### Font Weights
```
Light:                     300
Regular:                   400
Medium:                    500
Semibold:                  600
Bold:                      700
```

## 🎯 Component Color Usage

### Buttons
- **Primary Button**: Background #FFB800, Text #0f0f23, Hover #FF8C00
- **Secondary Button**: Background rgba(26, 26, 46, 0.8), Text #e2e8f0, Border #FFB800
- **Danger Button**: Background #ef4444, Text #ffffff, Hover #dc2626
- **Success Button**: Background #10b981, Text #ffffff, Hover #059669

### Cards
- **Background**: rgba(26, 26, 46, 0.8)
- **Border**: 1px solid rgba(255, 184, 0, 0.2)
- **Shadow**: 0 8px 25px rgba(255, 184, 0, 0.15)
- **Header Background**: rgba(255, 184, 0, 0.1)
- **Header Text**: #FFB800

### Tables
- **Header Background**: rgba(26, 26, 46, 0.9)
- **Header Text**: #FFB800
- **Row Background**: rgba(26, 26, 46, 0.6)
- **Row Hover**: rgba(255, 184, 0, 0.1)
- **Border**: rgba(255, 184, 0, 0.2)

### Forms
- **Input Background**: rgba(15, 15, 35, 0.6)
- **Input Border**: rgba(255, 184, 0, 0.2)
- **Input Focus Border**: #FFB800
- **Input Text**: #e2e8f0
- **Label Text**: #cbd5e0
- **Placeholder**: rgba(203, 213, 224, 0.5)

### Sidebar
- **Background**: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)
- **Active Item**: Background rgba(255, 184, 0, 0.15), Border-left 4px solid #FFB800
- **Hover**: Background rgba(255, 184, 0, 0.05)
- **Text**: #cbd5e0
- **Active Text**: #FFB800

### Status Badges
- **Active**: Background #10b981, Text #ffffff
- **Pending**: Background #f59e0b, Text #ffffff
- **Expired**: Background #ef4444, Text #ffffff
- **Draft**: Background #6b7280, Text #ffffff

## 🚫 Colors to AVOID (Inconsistencies)

❌ Random blues: #2196f3, #1976d2, #0ea5e9, #007bff
❌ Random greens: #4caf50, #27ae60, #28a745
❌ Random oranges: #ff9800
❌ Random reds: #f44336, #dc3545 (except danger button)
❌ Random purples: #7b1fa2 (except stat icons)
❌ Light backgrounds mixed with dark theme: #f0f9ff, #f5f5f5

## ✅ Implementation Priority

1. **HIGH**: Replace all inline style colors in index.html
2. **HIGH**: Standardize button colors across all pages
3. **HIGH**: Fix stat card icon colors to match system
4. **MEDIUM**: Update equipment.html and clients.html color schemes
5. **MEDIUM**: Ensure converter.html matches dark theme
6. **LOW**: Update modal and popup color schemes

## 🔄 Migration Strategy

1. Add CSS variables to styles.css for all colors
2. Search and replace inline styles with CSS classes
3. Update existing CSS classes to use variables
4. Test each page for visual consistency
5. Document any exceptions
