const fs = require('fs');
const path = require('path');

const sidebarHTML = `
  <!-- Navigation Sidebar -->
  <nav class="sidebar" id="sidebar" aria-label="Main navigation">
    <div class="sidebar-header">
      <div class="sidebar-brand">
        <div class="sidebar-logo-text">
          <i class="fas fa-balance-scale" style="font-size: 36px; color: #FFB800;"></i>
        </div>
        <div class="sidebar-title">
          <h3>CalPro</h3>
          <p>Calibration Management</p>
        </div>
      </div>
    </div>
    
    <div class="sidebar-menu" role="menu">
      <div class="menu-section">
        <h4>Main</h4>
        <a href="index.html#dashboard" class="menu-item">
          <i class="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </a>
        <a href="index.html#worksheets" class="menu-item">
          <i class="fas fa-file-lines"></i>
          <span>Worksheets</span>
        </a>
        <a href="index.html#certificates" class="menu-item">
          <i class="fas fa-certificate"></i>
          <span>Certificates</span>
        </a>
        <a href="equipment.html" class="menu-item">
          <i class="fas fa-tools"></i>
          <span>Equipment</span>
        </a>
      </div>
      
      <div class="menu-section">
        <h4>Management</h4>
        <a href="clients.html" class="menu-item">
          <i class="fas fa-users"></i>
          <span>Clients</span>
        </a>
        <a href="integrations.html" class="menu-item">
          <i class="fas fa-plug"></i>
          <span>Integrations</span>
        </a>
        <a href="index.html#reports" class="menu-item">
          <i class="fas fa-chart-bar"></i>
          <span>Reports</span>
        </a>
        <a href="index.html#settings" class="menu-item">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </a>
      </div>

      <div class="menu-section">
        <h4>Tools</h4>
        <a href="converter.html" class="menu-item">
          <i class="fas fa-calculator"></i>
          <span>Unit Converter</span>
        </a>
      </div>

      <div class="menu-section">
        <h4>Account</h4>
        <a href="profile.html" class="menu-item">
          <i class="fas fa-user-circle"></i>
          <span>My Profile</span>
        </a>
      </div>
    </div>
    
    <div class="sidebar-footer">
      <div class="sidebar-status">
        <div class="status-item" id="connectionStatus">
          <i class="fas fa-wifi" id="connectionIcon"></i>
          <span id="connectionText">Online</span>
        </div>
        <div class="version-info">v2.0.0</div>
      </div>
    </div>
  </nav>
`;

const sidebarCSS = `
    /* Sidebar Styles */
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: 260px;
      background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 2px 0 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .sidebar-header {
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .sidebar-title h3 {
      font-size: 20px;
      font-weight: 700;
      color: #FFB800;
      margin: 0;
      line-height: 1;
    }

    .sidebar-title p {
      font-size: 11px;
      color: rgba(255,255,255,0.7);
      margin: 4px 0 0;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .sidebar-menu {
      padding: 16px 0;
    }

    .menu-section {
      margin-bottom: 24px;
    }

    .menu-section h4 {
      padding: 0 20px;
      font-size: 11px;
      font-weight: 600;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin: 0 0 8px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      transition: all 0.2s;
      cursor: pointer;
    }

    .menu-item:hover {
      background: rgba(255,255,255,0.05);
      color: #FFB800;
    }

    .menu-item.active {
      background: rgba(255,184,0,0.15);
      color: #FFB800;
      border-left: 3px solid #FFB800;
    }

    .menu-item i {
      width: 20px;
      font-size: 16px;
      margin-right: 12px;
    }

    .sidebar-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px;
      border-top: 1px solid rgba(255,255,255,0.1);
      background: rgba(0,0,0,0.2);
    }

    .sidebar-status {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
    }

    .status-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba(255,255,255,0.7);
    }

    .version-info {
      color: rgba(255,255,255,0.5);
      font-size: 11px;
    }

    /* Page wrapper for sidebar layout */
    .page-wrapper {
      margin-left: 260px;
      min-height: 100vh;
      width: calc(100% - 260px);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
      }
      
      .sidebar.active {
        transform: translateX(0);
      }
      
      .page-wrapper {
        margin-left: 0;
        width: 100%;
      }
    }
`;

const pages = [
  { file: 'equipment.html', active: 'equipment.html' },
  { file: 'clients.html', active: 'clients.html' },
  { file: 'converter.html', active: 'converter.html' },
  { file: 'integrations.html', active: 'integrations.html' }
];

console.log('🎨 Adding sidebars to all pages...\n');

pages.forEach(({ file, active }) => {
  const filePath = path.join(__dirname, 'public', file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if sidebar already exists
  if (content.includes('class="sidebar"')) {
    console.log(`✅ ${file} - Already has sidebar`);
    return;
  }
  
  console.log(`📝 Processing ${file}...`);
  
  // Add sidebar CSS to the style section (before </style>)
  if (!content.includes('/* Sidebar Styles */')) {
    content = content.replace('</style>', sidebarCSS + '\n  </style>');
  }
  
  // Update body style to use flex layout
  content = content.replace(
    /body\s*\{([^}]*)\}/,
    (match, styles) => {
      if (!styles.includes('display: flex')) {
        return `body {\n      ${styles.trim()}\n      display: flex;\n      margin: 0;\n    }`;
      }
      return match;
    }
  );
  
  // Add sidebar HTML after <body> tag
  let activeSidebar = sidebarHTML.replace(
    new RegExp(`href="${active}" class="menu-item"`),
    `href="${active}" class="menu-item active"`
  );
  
  content = content.replace('<body>', `<body>\n${activeSidebar}\n\n  <!-- Page Content Wrapper -->\n  <div class="page-wrapper">`);
  
  // Close the page-wrapper before </body>
  content = content.replace('</body>', '  </div> <!-- End page-wrapper -->\n</body>');
  
  // Write updated content
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`   ✅ Added sidebar to ${file}\n`);
});

console.log('✅ All pages updated with sidebars!\n');
console.log('📋 Updated pages:');
pages.forEach(({ file }) => console.log(`   • ${file}`));
