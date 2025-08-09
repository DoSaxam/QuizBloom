// ===== NeonQuest Main Application =====

class NeonQuestApp {
  constructor() {
    this.isLoaded = false;
    this.performance = {
      navigationStart: performance.now(),
      domReady: null,
      appReady: null
    };
    
    // Initialize app
    this.init();
  }

  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }
  }

  onDOMReady() {
    this.performance.domReady = performance.now();
    
    // Initialize core systems
    this.initializeAccessibility();
    this.initializePerformanceOptimizations();
    this.initializeEventListeners();
    this.initializeKeyboardNavigation();
    this.initializeScreenReader();
    this.initializeReducedMotion();
    
    // Mark app as ready
    this.performance.appReady = performance.now();
    this.isLoaded = true;
    
    // Log performance metrics
    this.logPerformanceMetrics();
    
    // Initialize quiz state (already done in state.js, but ensure it's ready)
    if (window.quizState) {
      this.setupQuizStateIntegration();
    }
    
    // Dispatch app ready event
    window.dispatchEvent(new CustomEvent('appReady'));
    
    console.log('🚀 NeonQuest Quiz App initialized successfully!');
  }

  // ===== Accessibility Features =====
  initializeAccessibility() {
    // Ensure all interactive elements have proper ARIA labels
    this.enhanceARIALabels();
    
    // Set up focus management
    this.setupFocusManagement();
    
    // Initialize live regions
    this.initializeLiveRegions();
    
    // Add skip links
    this.addSkipLinks();
    
    // Enhance form accessibility
    this.enhanceFormAccessibility();
  }

  enhanceARIALabels() {
    // Add missing ARIA labels to buttons without text
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
      const icon = button.querySelector('.btn-icon');
      const text = button.textContent.trim();
      
      if (!text && icon) {
        // Provide labels for icon-only buttons
        const iconMap = {
          '🚀': 'Start quiz',
          '⚙️': 'Settings',
          '▶️': 'Play',
          '⏸️': 'Pause',
          '🔄': 'Replay',
          '📤': 'Share',
          '→': 'Next'
        };
        
        const label = iconMap[icon.textContent] || 'Button';
        button.setAttribute('aria-label', label);
      }
    });

    // Add ARIA labels to progress elements
    const progressBar = document.getElementById('quiz-progress');
    if (progressBar) {
      progressBar.setAttribute('role', 'progressbar');
      progressBar.setAttribute('aria-valuemin', '0');
      progressBar.setAttribute('aria-valuemax', '100');
      progressBar.setAttribute('aria-valuenow', '0');
    }

    // Add ARIA labels to timer
    const timer = document.getElementById('timer');
    if (timer) {
      timer.setAttribute('role', 'timer');
      timer.setAttribute('aria-live', 'polite');
    }
  }

  setupFocusManagement() {
    // Focus trap for modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeActiveModal();
      }
      
      if (e.key === 'Tab') {
        this.handleTabNavigation(e);
      }
    });

    // Focus management for page transitions
    window.addEventListener('pageChanged', (e) => {
      this.focusPageTitle(e.detail.page);
    });
  }

  handleTabNavigation(e) {
    const modal = document.querySelector('.modal.active');
    if (modal) {
      this.trapFocusInModal(e, modal);
    }
  }

  trapFocusInModal(e, modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstFocusable) {
      e.preventDefault();
      lastFocusable.focus();
    } else if (!e.shiftKey && document.activeElement === lastFocusable) {
      e.preventDefault();
      firstFocusable.focus();
    }
  }

  closeActiveModal() {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
      activeModal.classList.remove('active');
      
      // Return focus to triggering element
      const lastFocused = document.querySelector('[data-last-focused]');
      if (lastFocused) {
        lastFocused.focus();
        lastFocused.removeAttribute('data-last-focused');
      }
    }
  }

  focusPageTitle(pageId) {
    setTimeout(() => {
      const page = document.getElementById(`page-${pageId}`);
      const title = page?.querySelector('h1, h2, .page-title');
      
      if (title) {
        title.setAttribute('tabindex', '-1');
        title.focus();
        
        // Remove tabindex after focus
        setTimeout(() => {
          title.removeAttribute('tabindex');
        }, 100);
      }
    }, 300); // Wait for page transition
  }

  initializeLiveRegions() {
    // Create live region for quiz updates
    const liveRegion = document.createElement('div');
    liveRegion.id = 'quiz-announcements';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    // Create assertive live region for urgent announcements
    const urgentRegion = document.createElement('div');
    urgentRegion.id = 'urgent-announcements';
    urgentRegion.setAttribute('aria-live', 'assertive');
    urgentRegion.setAttribute('aria-atomic', 'true');
    urgentRegion.className = 'sr-only';
    document.body.appendChild(urgentRegion);
  }

  announceToScreenReader(message, urgent = false) {
    const regionId = urgent ? 'urgent-announcements' : 'quiz-announcements';
    const region = document.getElementById(regionId);
    
    if (region) {
      region.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  }

  addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = window.t('skip_to_content') || 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--accent-primary);
      color: var(--bg-base);
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1000;
      transition: top 0.2s;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add id to main content
    const main = document.querySelector('.main');
    if (main) {
      main.id = 'main-content';
    }
  }

  enhanceFormAccessibility() {
    // Add descriptions to form fields
    document.querySelectorAll('.form-group').forEach(group => {
      const label = group.querySelector('.form-label');
      const input = group.querySelector('.form-select, .form-input');
      const hint = group.querySelector('.form-hint');
      
      if (label && input) {
        // Connect label to input
        const inputId = input.id || this.generateId('input');
        input.id = inputId;
        label.setAttribute('for', inputId);
        
        // Connect hint to input
        if (hint) {
          const hintId = this.generateId('hint');
          hint.id = hintId;
          input.setAttribute('aria-describedby', hintId);
        }
      }
    });

    // Enhance radio groups
    document.querySelectorAll('.radio-group').forEach(group => {
      group.setAttribute('role', 'radiogroup');
      
      const firstRadio = group.querySelector('input[type="radio"]');
      if (firstRadio) {
        const groupLabel = document.querySelector(`label[for="${firstRadio.name}"]`);
        if (groupLabel) {
          const labelId = this.generateId('radio-group-label');
          groupLabel.id = labelId;
          group.setAttribute('aria-labelledby', labelId);
        }
      }
    });
  }

  generateId(prefix) {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // ===== Keyboard Navigation =====
  initializeKeyboardNavigation() {
    // Add keyboard support to custom elements
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('.option-button')) {
        this.handleOptionKeyboard(e);
      }
    });

    // Add visible focus indicators
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  handleOptionKeyboard(e) {
    const options = document.querySelectorAll('.option-button');
    const currentIndex = Array.from(options).indexOf(e.target);
    
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % options.length;
        options[nextIndex].focus();
        break;
        
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + options.length) % options.length;
        options[prevIndex].focus();
        break;
        
      case 'Enter':
      case ' ':
        e.preventDefault();
        e.target.click();
        break;
    }
  }

  // ===== Screen Reader Support =====
  initializeScreenReader() {
    // Add screen reader only styles
    const srOnlyStyle = document.createElement('style');
    srOnlyStyle.textContent = `
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
    `;
    document.head.appendChild(srOnlyStyle);

    // Add screen reader descriptions
    this.addScreenReaderDescriptions();
  }

  addScreenReaderDescriptions() {
    // Add description for quiz progress
    const progressContainer = document.querySelector('.quiz-progress-bar');
    if (progressContainer) {
      const description = document.createElement('div');
      description.className = 'sr-only';
      description.id = 'progress-description';
      description.textContent = window.t('aria_progress', { current: 1, total: 10 });
      progressContainer.appendChild(description);
    }

    // Add description for timer
    const timerContainer = document.querySelector('.timer-container');
    if (timerContainer) {
      const description = document.createElement('div');
      description.className = 'sr-only';
      description.id = 'timer-description';
      description.textContent = window.t('aria_timer', { time: 20 });
      timerContainer.appendChild(description);
    }
  }

  updateScreenReaderProgress(current, total) {
    const description = document.getElementById('progress-description');
    if (description) {
      description.textContent = window.t('aria_progress', { current, total });
    }
  }

  updateScreenReaderTimer(time) {
    const description = document.getElementById('timer-description');
    if (description) {
      description.textContent = window.t('aria_timer', { time });
    }
  }

  // ===== Reduced Motion Support =====
  initializeReducedMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    this.handleReducedMotion(prefersReducedMotion.matches);
    
    prefersReducedMotion.addEventListener('change', (e) => {
      this.handleReducedMotion(e.matches);
    });
  }

  handleReducedMotion(reducedMotion) {
    document.body.classList.toggle('reduced-motion', reducedMotion);
    
    if (reducedMotion) {
      // Disable auto-hiding modals for better accessibility
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('manual-close');
      });
    } else {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('manual-close');
      });
    }
  }

  // ===== Performance Optimizations =====
  initializePerformanceOptimizations() {
    // Intersection Observer for lazy loading
    this.setupIntersectionObserver();
    
    // Debounce resize events
    this.setupResizeOptimization();
    
    // Preload critical resources
    this.preloadCriticalResources();
    
    // Optimize scroll performance
    this.optimizeScrollPerformance();
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.1
    });

    // Observe elements that can benefit from intersection detection
    document.querySelectorAll('.stat-card, .breakdown-card').forEach(el => {
      observer.observe(el);
    });
  }

  setupResizeOptimization() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('optimizedResize'));
      }, 150);
    }, { passive: true });
  }

  preloadCriticalResources() {
    // Preload API endpoints
    if (navigator.onLine) {
      // Preload categories (but don't block)
      window.quizAPI?.getCategories().catch(() => {
        // Ignore errors for preloading
      });
    }
  }

  optimizeScrollPerformance() {
    // Use passive listeners for better scroll performance
    document.addEventListener('scroll', () => {
      // Handle scroll events if needed
    }, { passive: true });

    document.addEventListener('touchstart', () => {
      // Handle touch events if needed
    }, { passive: true });
  }

  // ===== Event Listeners =====
  initializeEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Network status
    window.addEventListener('online', () => {
      this.handleNetworkStatusChange(true);
    });

    window.addEventListener('offline', () => {
      this.handleNetworkStatusChange(false);
    });

    // Quiz state integration
    window.addEventListener('quizStateChanged', (e) => {
      this.handleQuizStateChange(e.detail);
    });

    // Error handling
    window.addEventListener('error', (e) => {
      this.handleGlobalError(e);
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.handleUnhandledRejection(e);
    });
  }

  setupQuizStateIntegration() {
    // Listen for quiz events and update accessibility features
    window.addEventListener('questionChanged', (e) => {
      const { current, total } = e.detail;
      this.updateScreenReaderProgress(current, total);
      this.announceToScreenReader(window.t('question_of', { current, total }));
    });

    window.addEventListener('timerUpdate', (e) => {
      const { timeLeft } = e.detail;
      this.updateScreenReaderTimer(timeLeft);
      
      if (timeLeft <= 5) {
        this.announceToScreenReader(window.t('timer_warning'), true);
      }
    });

    window.addEventListener('answerSelected', (e) => {
      const { isCorrect } = e.detail;
      const message = isCorrect ? window.t('correct') : window.t('incorrect');
      this.announceToScreenReader(message);
    });
  }

  // ===== Theme Management =====
  toggleTheme() {
    // For now, this is a placeholder as we only have dark theme
    // In the future, this could switch between dark/light modes
    console.log('Theme toggle clicked - only dark theme available currently');
  }

  // ===== Network Handling =====
  handleNetworkStatusChange(isOnline) {
    const status = isOnline ? 'Online' : 'Offline';
    this.announceToScreenReader(`Network status: ${status}`);
    
    if (!isOnline) {
      window.quizState?.showToast(window.t('error_offline'), 'warning');
    }
  }

  // ===== Error Handling =====
  handleGlobalError(error) {
    console.error('Global error:', error);
    
    // Don't show error toasts for minor issues
    if (error.filename && error.filename.includes('extensions')) {
      return; // Ignore browser extension errors
    }
    
    window.quizState?.showToast(window.t('error_unknown'), 'error');
  }

  handleUnhandledRejection(event) {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Prevent the default handling (console error)
    event.preventDefault();
    
    window.quizState?.showToast(window.t('error_unknown'), 'error');
  }

  handleQuizStateChange(state) {
    // Update ARIA labels based on quiz state
    if (state.page === 'quiz') {
      this.announceToScreenReader(window.t('quiz_started'));
    } else if (state.page === 'results') {
      this.announceToScreenReader(window.t('quiz_completed'));
    }
  }

  // ===== Performance Metrics =====
  logPerformanceMetrics() {
    const metrics = {
      domReady: this.performance.domReady - this.performance.navigationStart,
      appReady: this.performance.appReady - this.performance.navigationStart,
      totalInit: this.performance.appReady - this.performance.domReady
    };

    console.log('📊 Performance Metrics:', {
      'DOM Ready': `${metrics.domReady.toFixed(2)}ms`,
      'App Ready': `${metrics.appReady.toFixed(2)}ms`,
      'Init Time': `${metrics.totalInit.toFixed(2)}ms`
    });

    // Check if we meet performance targets
    if (metrics.appReady > 2500) {
      console.warn('⚠️ App initialization time exceeds 2.5s target');
    }
  }

  // ===== Utility Methods =====
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

// ===== Initialize Application =====
window.addEventListener('DOMContentLoaded', () => {
  window.neonQuestApp = new NeonQuestApp();
});

// ===== Service Worker Registration =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered successfully:', registration.scope);
    } catch (error) {
      console.warn('❌ Service Worker registration failed:', error);
    }
  });
}

// ===== Progressive Web App Support =====
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('💾 App install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // Show install button if desired
  const installBtn = document.getElementById('install-app');
  if (installBtn) {
    installBtn.style.display = 'block';
    installBtn.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`👤 User ${outcome} the install prompt`);
        deferredPrompt = null;
      }
    });
  }
});

window.addEventListener('appinstalled', () => {
  console.log('🎉 NeonQuest Quiz installed as PWA!');
  deferredPrompt = null;
});

// ===== Export for modules =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NeonQuestApp;
}