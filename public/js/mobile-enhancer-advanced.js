/**
 * CALPRO ADVANCED MOBILE ENHANCER
 * Modern Mobile Experience with Performance Optimizations
 * Version: 2.0
 */

class CalProMobileEnhancer {
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    this.isAndroid = /Android/.test(navigator.userAgent);
    this.touchStartY = 0;
    this.touchEndY = 0;
    this.lastScrollY = 0;
    this.scrollDirection = 'down';
    this.isRefreshing = false;
    this.observers = new Map();
    
    if (this.isMobile) {
      this.init();
    }
  }

  init() {
    console.log('🚀 CalPro Mobile Enhancer v2.0 Initialized');
    
    // Core Features
    this.setupViewport();
    this.setupTouchOptimizations();
    this.setupGestureHandling();
    this.setupSmartScrolling();
    this.setupPullToRefresh();
    this.setupLazyLoading();
    this.setupSkeletonScreens();
    this.setupBottomNavigation();
    this.setupToastSystem();
    this.setupOfflineDetection();
    this.setupPerformanceMonitoring();
    this.setupVirtualKeyboard();
    this.setupImageOptimization();
    
    // Enhanced Features
    this.preloadCriticalResources();
    this.setupServiceWorkerMessaging();
    this.optimizeAnimations();
  }

  setupViewport() {
    // Dynamic viewport height (fixes iOS Safari issue)
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', () => {
      setTimeout(setVh, 100);
    });

    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });
  }

  setupTouchOptimizations() {
    // Add haptic feedback for supported devices
    this.addHapticFeedback();
    
    // Optimize touch delay
    if ('touchstart' in window) {
      document.body.classList.add('touch-device');
    }

    // Prevent overscroll
    document.body.addEventListener('touchmove', (e) => {
      if (e.target.closest('.no-overscroll')) {
        const target = e.target.closest('.no-overscroll');
        const scrollTop = target.scrollTop;
        const scrollHeight = target.scrollHeight;
        const height = target.clientHeight;
        const isAtTop = scrollTop === 0;
        const isAtBottom = scrollTop + height >= scrollHeight;

        if ((isAtTop && e.touches[0].clientY > this.touchStartY) ||
            (isAtBottom && e.touches[0].clientY < this.touchStartY)) {
          e.preventDefault();
        }
      }
    }, { passive: false });
  }

  addHapticFeedback() {
    // Light haptic feedback for buttons
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button, .btn, .nav-tab');
      if (button && navigator.vibrate) {
        navigator.vibrate(10);
      }
    });
  }

  setupGestureHandling() {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      this.touchStartY = startY;
      isDragging = true;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
      this.touchEndY = currentY;

      const diffX = currentX - startX;
      const diffY = currentY - startY;

      // Horizontal swipe detection (for navigation)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (!e.target.closest('.no-swipe')) {
          this.handleSwipe(diffX > 0 ? 'right' : 'left');
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      isDragging = false;
    }, { passive: true });
  }

  handleSwipe(direction) {
    // Show swipe indicator
    this.showSwipeIndicator(direction);
    
    // Emit custom swipe event
    const event = new CustomEvent('swipe', { detail: { direction } });
    document.dispatchEvent(event);
  }

  showSwipeIndicator(direction) {
    let indicator = document.querySelector(`.swipe-indicator.${direction}`);
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = `swipe-indicator ${direction}`;
      indicator.innerHTML = direction === 'left' ? '<i class="fas fa-chevron-left"></i>' : '<i class="fas fa-chevron-right"></i>';
      document.body.appendChild(indicator);
    }

    indicator.classList.add('active');
    setTimeout(() => {
      indicator.classList.remove('active');
    }, 300);
  }

  setupSmartScrolling() {
    let ticking = false;
    const header = document.querySelector('.app-header');
    const bottomNav = document.querySelector('.mobile-bottom-nav');
    const fab = document.querySelector('.fab');
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollDiff = currentScrollY - this.lastScrollY;

          // Hide header/nav on scroll down, show on scroll up
          if (scrollDiff > 10 && currentScrollY > 100) {
            header?.classList.add('hidden');
            bottomNav?.classList.add('hidden');
            fab?.classList.add('hidden');
            this.scrollDirection = 'down';
          } else if (scrollDiff < -10) {
            header?.classList.remove('hidden');
            bottomNav?.classList.remove('hidden');
            fab?.classList.remove('hidden');
            this.scrollDirection = 'up';
          }

          // Add elevated shadow to header when scrolled
          if (currentScrollY > 10) {
            header?.classList.add('elevated');
          } else {
            header?.classList.remove('elevated');
          }

          this.lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  setupPullToRefresh() {
    const threshold = 80;
    let pullStartY = 0;
    let isPulling = false;

    document.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        pullStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (this.isRefreshing) return;
      
      const pullDistance = e.touches[0].clientY - pullStartY;
      
      if (window.scrollY === 0 && pullDistance > 0) {
        isPulling = true;
        this.updatePullToRefreshUI(Math.min(pullDistance, threshold));
        
        if (pullDistance > threshold) {
          // Ready to refresh
          this.showPullToRefreshIndicator(true);
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (isPulling && !this.isRefreshing) {
        const pullDistance = this.touchEndY - pullStartY;
        if (pullDistance > threshold) {
          this.triggerRefresh();
        } else {
          this.resetPullToRefresh();
        }
      }
      isPulling = false;
    }, { passive: true });
  }

  async triggerRefresh() {
    if (this.isRefreshing) return;
    
    this.isRefreshing = true;
    this.showPullToRefreshIndicator(true);
    
    // Emit refresh event
    const event = new CustomEvent('pulltorefresh');
    document.dispatchEvent(event);
    
    // Simulate refresh (replace with actual data fetch)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    this.showToast('Content updated', 'success');
    this.resetPullToRefresh();
    this.isRefreshing = false;
  }

  updatePullToRefreshUI(distance) {
    let indicator = document.querySelector('.pull-to-refresh');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'pull-to-refresh';
      indicator.innerHTML = '<div class="refresh-spinner"></div>';
      document.body.appendChild(indicator);
    }
    
    const progress = Math.min(distance / 80, 1);
    indicator.style.opacity = progress;
    indicator.style.transform = `translateX(-50%) translateY(${distance - 100}%)`;
  }

  showPullToRefreshIndicator(show) {
    const indicator = document.querySelector('.pull-to-refresh');
    if (indicator) {
      indicator.classList.toggle('active', show);
    }
  }

  resetPullToRefresh() {
    const indicator = document.querySelector('.pull-to-refresh');
    if (indicator) {
      indicator.style.opacity = '0';
      indicator.style.transform = 'translateX(-50%) translateY(-100%)';
      setTimeout(() => {
        indicator.classList.remove('active');
      }, 300);
    }
  }

  setupLazyLoading() {
    // Intersection Observer for lazy loading
    const lazyLoadOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.01
    };

    const lazyLoadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Lazy load images
          if (element.dataset.src) {
            element.src = element.dataset.src;
            element.removeAttribute('data-src');
          }
          
          // Lazy load background images
          if (element.dataset.bg) {
            element.style.backgroundImage = `url(${element.dataset.bg})`;
            element.removeAttribute('data-bg');
          }
          
          // Lazy load content
          if (element.dataset.lazyLoad) {
            this.loadDeferredContent(element);
          }
          
          lazyLoadObserver.unobserve(element);
        }
      });
    }, lazyLoadOptions);

    this.observers.set('lazyLoad', lazyLoadObserver);

    // Observe all lazy load elements
    document.querySelectorAll('[data-src], [data-bg], [data-lazy-load]').forEach(el => {
      lazyLoadObserver.observe(el);
    });
  }

  async loadDeferredContent(element) {
    const contentType = element.dataset.lazyLoad;
    element.classList.add('loading');
    
    // Simulate content loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    element.classList.remove('loading');
    element.classList.add('loaded');
  }

  setupSkeletonScreens() {
    // Auto-replace skeleton screens with real content
    const skeletonObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skeleton = entry.target;
          setTimeout(() => {
            skeleton.classList.add('loaded');
          }, 300);
        }
      });
    });

    document.querySelectorAll('.skeleton').forEach(el => {
      skeletonObserver.observe(el);
    });
  }

  setupBottomNavigation() {
    const navTabs = document.querySelectorAll('.nav-tab');
    
    navTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active state
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Navigate to page
        const page = tab.dataset.page;
        if (page) {
          this.navigateToPage(page);
        }
        
        // Haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      });
    });
  }

  navigateToPage(page) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });
    
    // Show target page
    const targetPage = document.getElementById(page);
    if (targetPage) {
      targetPage.classList.add('active');
      targetPage.style.display = 'block';
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Update hash
      window.location.hash = page;
    }
  }

  setupToastSystem() {
    // Create toast container
    if (!document.querySelector('.toast-container')) {
      const container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
  }

  showToast(message, type = 'info', duration = 3000) {
    const container = document.querySelector('.toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      info: 'fa-info-circle',
      warning: 'fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
      <div class="toast-icon">
        <i class="fas ${icons[type] || icons.info}"></i>
      </div>
      <div class="toast-content">
        <div class="toast-message">${message}</div>
      </div>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  setupOfflineDetection() {
    const showOfflineBanner = () => {
      let banner = document.querySelector('.offline-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.className = 'offline-banner';
        banner.innerHTML = '<i class="fas fa-wifi-slash"></i> You are offline';
        document.body.appendChild(banner);
      }
      setTimeout(() => banner.classList.add('show'), 10);
    };

    const hideOfflineBanner = () => {
      const banner = document.querySelector('.offline-banner');
      if (banner) {
        banner.classList.remove('show');
        this.showToast('Back online', 'success');
      }
    };

    window.addEventListener('online', hideOfflineBanner);
    window.addEventListener('offline', showOfflineBanner);
    
    if (!navigator.onLine) {
      showOfflineBanner();
    }
  }

  setupPerformanceMonitoring() {
    // Monitor page load performance
    if ('PerformanceObserver' in window) {
      const perfObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          console.log(`⚡ ${entry.name}: ${entry.duration.toFixed(2)}ms`);
        });
      });
      
      perfObserver.observe({ entryTypes: ['measure', 'navigation'] });
    }

    // Log FCP, LCP
    if ('PerformancePaintTiming' in window) {
      const paintEntries = performance.getEntriesByType('paint');
      paintEntries.forEach(entry => {
        console.log(`🎨 ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
      });
    }
  }

  setupVirtualKeyboard() {
    // Handle virtual keyboard appearance
    if ('visualViewport' in window) {
      window.visualViewport.addEventListener('resize', () => {
        const keyboardHeight = window.innerHeight - window.visualViewport.height;
        document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
        
        if (keyboardHeight > 100) {
          document.body.classList.add('keyboard-open');
        } else {
          document.body.classList.remove('keyboard-open');
        }
      });
    }

    // Scroll input into view when focused
    document.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('focus', () => {
        setTimeout(() => {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      });
    });
  }

  setupImageOptimization() {
    // Convert images to WebP if supported
    const supportsWebP = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    if (supportsWebP) {
      document.querySelectorAll('img[data-webp]').forEach(img => {
        img.src = img.dataset.webp;
      });
    }

    // Lazy load images with blur-up effect
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.style.filter = 'blur(10px)';
      img.addEventListener('load', () => {
        img.style.filter = 'blur(0)';
        img.style.transition = 'filter 0.3s';
      });
    });
  }

  preloadCriticalResources() {
    // Preload critical fonts
    const fontFiles = [
      '/fonts/inter-var.woff2',
    ];

    fontFiles.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.href = font;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preload critical API endpoints
    const criticalEndpoints = [
      '/api/dashboard/stats',
      '/api/user/profile'
    ];

    criticalEndpoints.forEach(endpoint => {
      fetch(endpoint, { method: 'HEAD' }).catch(() => {});
    });
  }

  setupServiceWorkerMessaging() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_UPDATED') {
          this.showToast('App updated! Refresh to see changes.', 'info', 5000);
        }
      });
    }
  }

  optimizeAnimations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.documentElement.classList.add('reduced-animations');
    }

    // Pause animations when page is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        document.body.style.animationPlayState = 'paused';
      } else {
        document.body.style.animationPlayState = 'running';
      }
    });
  }

  // Public API
  refresh() {
    this.triggerRefresh();
  }

  toast(message, type, duration) {
    this.showToast(message, type, duration);
  }

  navigate(page) {
    this.navigateToPage(page);
  }
}

// Initialize on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.calProMobile = new CalProMobileEnhancer();
  });
} else {
  window.calProMobile = new CalProMobileEnhancer();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CalProMobileEnhancer;
}
