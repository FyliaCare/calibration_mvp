/**
 * CalPro Mobile Enhancement Script
 * Provides professional mobile experience optimizations
 */

(function() {
  'use strict';

  // Mobile-first enhancements
  const MobileEnhancer = {
    
    init() {
      this.detectDevice();
      this.enhanceTouch();
      this.optimizeViewport();
      this.addMobileStyles();
      this.setupGestures();
      this.enhanceScrolling();
      this.preventZoom();
    },

    detectDevice() {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isTablet = /iPad|Android(?=.*\b(tablet|2\.0))/i.test(navigator.userAgent);
      
      document.body.classList.toggle('is-mobile', isMobile && !isTablet);
      document.body.classList.toggle('is-tablet', isTablet);
      document.body.classList.toggle('is-desktop', !isMobile && !isTablet);
      
      // Set CSS custom properties
      document.documentElement.style.setProperty('--is-mobile', isMobile && !isTablet ? '1' : '0');
      document.documentElement.style.setProperty('--is-tablet', isTablet ? '1' : '0');
    },

    enhanceTouch() {
      // Add touch-friendly classes
      const touchElements = document.querySelectorAll('button, .btn, a, input, select, textarea');
      touchElements.forEach(el => {
        el.classList.add('touch-optimized');
        
        // Add ripple effect
        el.addEventListener('touchstart', this.createRipple);
      });
    },

    createRipple(e) {
      const button = e.currentTarget;
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.touches[0].clientX - rect.left - size / 2;
      const y = e.touches[0].clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 184, 0, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
        z-index: 1000;
      `;
      
      // Ensure button has relative positioning
      if (getComputedStyle(button).position === 'static') {
        button.style.position = 'relative';
      }
      
      button.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
    },

    optimizeViewport() {
      // Dynamic viewport adjustment for mobile
      if (window.innerWidth <= 768) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
          );
        }
      }
    },

    addMobileStyles() {
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        
        .touch-optimized {
          -webkit-tap-highlight-color: rgba(255, 184, 0, 0.1);
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        
        @media (max-width: 768px) {
          body {
            -webkit-text-size-adjust: 100%;
            -webkit-font-smoothing: antialiased;
          }
          
          /* Smooth scrolling */
          * {
            -webkit-overflow-scrolling: touch;
          }
          
          /* Better input focus */
          input, textarea, select {
            font-size: 16px !important; /* Prevents zoom on iOS */
          }
          
          /* Professional loading states */
          .loading {
            position: relative;
            pointer-events: none;
          }
          
          .loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin: -10px 0 0 -10px;
            border: 2px solid rgba(255, 184, 0, 0.3);
            border-top: 2px solid #FFB800;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          
          /* Professional status bar */
          .mobile-status-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: env(safe-area-inset-top);
            background: #FFB800;
            z-index: 9999;
          }
        }
        
        /* iOS specific optimizations */
        @supports (-webkit-appearance: none) and (stroke-color: transparent) {
          .ios-scroll-fix {
            -webkit-overflow-scrolling: touch;
          }
        }
      `;
      document.head.appendChild(style);
    },

    setupGestures() {
      let touchStart = null;
      let touchEnd = null;

      document.addEventListener('touchstart', e => {
        touchStart = {
          x: e.changedTouches[0].screenX,
          y: e.changedTouches[0].screenY
        };
      });

      document.addEventListener('touchend', e => {
        touchEnd = {
          x: e.changedTouches[0].screenX,
          y: e.changedTouches[0].screenY
        };
        
        this.handleGesture();
      });
    },

    handleGesture() {
      if (!touchStart || !touchEnd) return;

      const deltaX = touchEnd.x - touchStart.x;
      const deltaY = touchEnd.y - touchStart.y;
      const minSwipeDistance = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            // Swipe right
            this.handleSwipeRight();
          } else {
            // Swipe left
            this.handleSwipeLeft();
          }
        }
      }
    },

    handleSwipeRight() {
      // Could be used for navigation
      const backBtn = document.querySelector('.back-btn, .nav-back');
      if (backBtn) {
        backBtn.click();
      }
    },

    handleSwipeLeft() {
      // Could be used for menu
      const menuBtn = document.querySelector('.menu-btn, .nav-menu');
      if (menuBtn) {
        menuBtn.click();
      }
    },

    enhanceScrolling() {
      // Add momentum scrolling for better mobile experience
      document.body.style.cssText += `
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      `;
      
      // Smooth scroll behavior
      if ('scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = 'smooth';
      }
    },

    preventZoom() {
      // Prevent zoom on double tap for inputs
      let lastTouchEnd = 0;
      document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, false);
    },

    // Professional table enhancement for mobile
    enhanceTables() {
      const tables = document.querySelectorAll('table');
      tables.forEach(table => {
        if (window.innerWidth <= 768) {
          // Convert table to card layout on mobile
          this.convertTableToCards(table);
        }
      });
    },

    convertTableToCards(table) {
      const rows = table.querySelectorAll('tbody tr');
      const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent);
      
      const cardContainer = document.createElement('div');
      cardContainer.className = 'table-cards mobile-only';
      
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const card = document.createElement('div');
        card.className = 'table-card';
        
        cells.forEach((cell, index) => {
          if (headers[index]) {
            const cardRow = document.createElement('div');
            cardRow.className = 'table-card-row';
            cardRow.innerHTML = `
              <span class="table-card-label">${headers[index]}</span>
              <span class="table-card-value">${cell.innerHTML}</span>
            `;
            card.appendChild(cardRow);
          }
        });
        
        cardContainer.appendChild(card);
      });
      
      table.parentNode.insertBefore(cardContainer, table.nextSibling);
    },

    // Professional form enhancements
    enhanceForms() {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        // Add floating labels
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          if (input.placeholder && !input.previousElementSibling?.tagName === 'LABEL') {
            const label = document.createElement('label');
            label.textContent = input.placeholder;
            label.className = 'floating-label';
            input.parentNode.insertBefore(label, input);
            
            // Floating label logic
            const updateLabel = () => {
              label.classList.toggle('active', input.value !== '' || input === document.activeElement);
            };
            
            input.addEventListener('focus', updateLabel);
            input.addEventListener('blur', updateLabel);
            input.addEventListener('input', updateLabel);
            updateLabel();
          }
        });
      });
    },

    // Add professional status indicators
    addStatusBar() {
      if (window.innerWidth <= 768 && !document.querySelector('.mobile-status-bar')) {
        const statusBar = document.createElement('div');
        statusBar.className = 'mobile-status-bar';
        document.body.prepend(statusBar);
        
        // Adjust body padding for status bar
        document.body.style.paddingTop = 'env(safe-area-inset-top)';
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MobileEnhancer.init());
  } else {
    MobileEnhancer.init();
  }

  // Re-enhance on dynamic content changes
  const observer = new MutationObserver(() => {
    MobileEnhancer.enhanceTables();
    MobileEnhancer.enhanceForms();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Export for global use
  window.MobileEnhancer = MobileEnhancer;

})();