/**
 * Professional Mobile Navigation Component
 * Beautiful, responsive navigation for CalPro mobile interface
 */

class MobileNavigation {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    this.createMobileNav();
    this.addEventListeners();
    this.detectCurrentPage();
  }

  createMobileNav() {
    // Create mobile navigation HTML
    const navHTML = `
      <!-- Mobile Navigation Toggle -->
      <button class="mobile-nav-toggle" id="mobileNavToggle" aria-label="Toggle navigation">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <!-- Mobile Navigation Overlay -->
      <div class="mobile-nav-overlay" id="mobileNavOverlay"></div>

      <!-- Mobile Navigation Drawer -->
      <nav class="mobile-nav-drawer" id="mobileNavDrawer">
        <div class="mobile-nav-header">
          <div class="nav-logo">
            <i class="fas fa-bullseye"></i>
            <span>CalPro</span>
          </div>
          <button class="nav-close" id="navClose" aria-label="Close navigation">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="mobile-nav-body">
          <ul class="mobile-nav-menu">
            <li class="nav-item">
              <a href="index.html" class="nav-link" data-page="dashboard">
                <i class="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
                <i class="fas fa-chevron-right nav-arrow"></i>
              </a>
            </li>
            <li class="nav-item">
              <a href="clients.html" class="nav-link" data-page="clients">
                <i class="fas fa-building"></i>
                <span>Clients</span>
                <i class="fas fa-chevron-right nav-arrow"></i>
              </a>
            </li>
            <li class="nav-item">
              <a href="equipment.html" class="nav-link" data-page="equipment">
                <i class="fas fa-cogs"></i>
                <span>Equipment</span>
                <i class="fas fa-chevron-right nav-arrow"></i>
              </a>
            </li>
            <li class="nav-item">
              <a href="profile.html" class="nav-link" data-page="profile">
                <i class="fas fa-user"></i>
                <span>Profile</span>
                <i class="fas fa-chevron-right nav-arrow"></i>
              </a>
            </li>
          </ul>
          
          <div class="nav-footer">
            <div class="user-info">
              <div class="user-avatar">
                <i class="fas fa-user-circle"></i>
              </div>
              <div class="user-details">
                <div class="user-name" id="navUserName">Admin User</div>
                <div class="user-role" id="navUserRole">Administrator</div>
              </div>
            </div>
            
            <button class="nav-logout" id="navLogout">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    `;

    // Add navigation styles
    const styles = `
      <style>
        /* Mobile Navigation Styles */
        @media (max-width: 768px) {
          .mobile-nav-toggle {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            background: linear-gradient(135deg, #FFB800, #FF8C00);
            border: none;
            border-radius: 12px;
            width: 50px;
            height: 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            box-shadow: 0 4px 20px rgba(255, 184, 0, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
          }
          
          .mobile-nav-toggle:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 25px rgba(255, 184, 0, 0.4);
          }
          
          .mobile-nav-toggle.active {
            background: linear-gradient(135deg, #FF4444, #CC0000);
          }
          
          .hamburger-line {
            width: 20px;
            height: 2px;
            background: white;
            border-radius: 2px;
            transition: all 0.3s ease;
          }
          
          .mobile-nav-toggle.active .hamburger-line:nth-child(1) {
            transform: rotate(45deg) translate(6px, 6px);
          }
          
          .mobile-nav-toggle.active .hamburger-line:nth-child(2) {
            opacity: 0;
          }
          
          .mobile-nav-toggle.active .hamburger-line:nth-child(3) {
            transform: rotate(-45deg) translate(6px, -6px);
          }
          
          .mobile-nav-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 9997;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }
          
          .mobile-nav-overlay.active {
            opacity: 1;
            visibility: visible;
          }
          
          .mobile-nav-drawer {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 300px;
            background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
            z-index: 9998;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
          }
          
          .mobile-nav-drawer.active {
            transform: translateX(0);
          }
          
          .mobile-nav-header {
            background: linear-gradient(135deg, #FFB800, #FF8C00);
            color: white;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          
          .nav-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.5rem;
            font-weight: 700;
          }
          
          .nav-logo i {
            font-size: 2rem;
          }
          
          .nav-close {
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .nav-close:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
          }
          
          .mobile-nav-body {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 20px 0;
          }
          
          .mobile-nav-menu {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
          }
          
          .nav-item {
            margin: 4px 0;
          }
          
          .nav-link {
            display: flex;
            align-items: center;
            padding: 16px 24px;
            color: #2c3e50;
            text-decoration: none;
            transition: all 0.3s ease;
            border-radius: 0 25px 25px 0;
            margin-right: 20px;
            gap: 16px;
            position: relative;
            overflow: hidden;
          }
          
          .nav-link::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 184, 0, 0.1), transparent);
            transition: left 0.5s;
          }
          
          .nav-link:hover::before {
            left: 100%;
          }
          
          .nav-link:hover, .nav-link.active {
            background: linear-gradient(135deg, rgba(255, 184, 0, 0.1) 0%, rgba(255, 140, 0, 0.05) 100%);
            color: #FF8C00;
            transform: translateX(8px);
            box-shadow: 0 4px 15px rgba(255, 184, 0, 0.2);
          }
          
          .nav-link i:first-child {
            font-size: 1.2rem;
            min-width: 24px;
          }
          
          .nav-link span {
            flex: 1;
            font-weight: 500;
            font-size: 1rem;
          }
          
          .nav-arrow {
            font-size: 0.8rem;
            opacity: 0.5;
            transition: all 0.3s ease;
          }
          
          .nav-link:hover .nav-arrow, .nav-link.active .nav-arrow {
            opacity: 1;
            transform: translateX(4px);
          }
          
          .nav-footer {
            border-top: 1px solid #e9ecef;
            padding: 20px;
          }
          
          .user-info {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 12px;
          }
          
          .user-avatar {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #FFB800, #FF8C00);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
          }
          
          .user-details {
            flex: 1;
          }
          
          .user-name {
            font-weight: 600;
            color: #2c3e50;
            font-size: 0.9rem;
          }
          
          .user-role {
            font-size: 0.8rem;
            color: #6c757d;
          }
          
          .nav-logout {
            width: 100%;
            background: linear-gradient(135deg, #FF4444, #CC0000);
            border: none;
            color: white;
            padding: 12px 16px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .nav-logout:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 68, 68, 0.3);
          }
          
          /* Hide desktop navigation on mobile */
          .desktop-nav {
            display: none !important;
          }
          
          /* Adjust main content for mobile nav */
          body.nav-open {
            overflow: hidden;
          }
        }
        
        /* Hide mobile nav on desktop */
        @media (min-width: 769px) {
          .mobile-nav-toggle,
          .mobile-nav-overlay,
          .mobile-nav-drawer {
            display: none !important;
          }
        }
      </style>
    `;

    // Insert styles and navigation
    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.insertAdjacentHTML('afterbegin', navHTML);
  }

  addEventListeners() {
    const toggle = document.getElementById('mobileNavToggle');
    const close = document.getElementById('navClose');
    const overlay = document.getElementById('mobileNavOverlay');
    const logout = document.getElementById('navLogout');

    if (toggle) toggle.addEventListener('click', () => this.toggleNav());
    if (close) close.addEventListener('click', () => this.closeNav());
    if (overlay) overlay.addEventListener('click', () => this.closeNav());
    if (logout) logout.addEventListener('click', () => this.handleLogout());

    // Close nav on swipe left
    let startX = null;
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    document.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (diff > 50 && this.isOpen) {
        this.closeNav();
      }
      startX = null;
    });
  }

  toggleNav() {
    if (this.isOpen) {
      this.closeNav();
    } else {
      this.openNav();
    }
  }

  openNav() {
    this.isOpen = true;
    document.body.classList.add('nav-open');
    document.getElementById('mobileNavToggle')?.classList.add('active');
    document.getElementById('mobileNavOverlay')?.classList.add('active');
    document.getElementById('mobileNavDrawer')?.classList.add('active');
  }

  closeNav() {
    this.isOpen = false;
    document.body.classList.remove('nav-open');
    document.getElementById('mobileNavToggle')?.classList.remove('active');
    document.getElementById('mobileNavOverlay')?.classList.remove('active');
    document.getElementById('mobileNavDrawer')?.classList.remove('active');
  }

  detectCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link');
    
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
      }
    });
  }

  handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    }
  }

  updateUserInfo(user) {
    const nameEl = document.getElementById('navUserName');
    const roleEl = document.getElementById('navUserRole');
    
    if (nameEl) nameEl.textContent = user.full_name || 'User';
    if (roleEl) roleEl.textContent = user.role || 'User';
  }
}

// Initialize mobile navigation when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) {
      window.mobileNav = new MobileNavigation();
      
      // Update user info if available
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.full_name) {
        window.mobileNav.updateUserInfo(user);
      }
    }
  });
} else {
  if (window.innerWidth <= 768) {
    window.mobileNav = new MobileNavigation();
    
    // Update user info if available
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.full_name) {
      window.mobileNav.updateUserInfo(user);
    }
  }
}