/**
 * ChurnGuard JS SDK - Track user behavior automatically
 * Your customers add this to their website/app
 */

(function() {
  'use strict';
  
  window.ChurnGuard = {
    config: {
      apiKey: null,
      apiUrl: 'https://churn-guard-app.vercel.app/api/tracking',
      debug: false
    },
    
    // Initialize with API key
    init: function(apiKey, options) {
      this.config.apiKey = apiKey;
      if (options) {
        Object.assign(this.config, options);
      }
      
      if (this.config.debug) {
        console.log('[ChurnGuard] Initialized');
      }
      
      // Auto-track page views (login detection)
      this.trackPageView();
      
      // Track session duration
      this.startSessionTracking();
      
      return this;
    },
    
    // Track any event
    track: function(eventName, metadata) {
      if (!this.config.apiKey) {
        console.error('[ChurnGuard] Error: API key not set. Call ChurnGuard.init() first');
        return;
      }
      
      const user = this.getUser();
      if (!user) {
        console.error('[ChurnGuard] Error: No user logged in');
        return;
      }
      
      const payload = {
        apiKey: this.config.apiKey,
        userId: user.id,
        userEmail: user.email,
        userName: user.name || user.email,
        event: eventName,
        metadata: {
          ...metadata,
          url: window.location.href,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      };
      
      fetch(this.config.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(response => {
        if (this.config.debug) {
          console.log('[ChurnGuard] Event tracked:', eventName, response.status);
        }
      })
      .catch(error => {
        console.error('[ChurnGuard] Track error:', error);
      });
    },
    
    // Get current user from your app's global variable or localStorage
    getUser: function() {
      // Try common patterns - your customers configure this
      if (window.currentUser) return window.currentUser;
      if (window.user) return window.user;
      
      // Try localStorage
      try {
        const user = localStorage.getItem('user');
        if (user) return JSON.parse(user);
      } catch(e) {}
      
      return null;
    },
    
    // Auto-track page views (detects logins)
    trackPageView: function() {
      this.track('page_view', {
        path: window.location.pathname,
        title: document.title
      });
    },
    
    // Track session duration
    startSessionTracking: function() {
      let lastActivity = Date.now();
      let inactiveTime = 0;
      
      // Update last activity on user actions
      ['click', 'scroll', 'keypress', 'mousemove'].forEach(event => {
        document.addEventListener(event, () => {
          lastActivity = Date.now();
          inactiveTime = 0;
        });
      });
      
      // Check inactivity every minute
      setInterval(() => {
        const now = Date.now();
        const timeSinceActivity = now - lastActivity;
        
        // If inactive for 5 minutes, track it
        if (timeSinceActivity > 5 * 60 * 1000 && inactiveTime === 0) {
          inactiveTime = timeSinceActivity;
          this.track('inactive', { 
            duration: Math.floor(timeSinceActivity / 1000),
            durationMinutes: Math.floor(timeSinceActivity / 60000)
          });
        }
      }, 60000);
    },
    
    // Track feature usage (your customers call this when users do important things)
    trackFeature: function(featureName, metadata) {
      this.track('core_action', {
        feature: featureName,
        ...metadata
      });
    },
    
    // Track login event
    trackLogin: function(userData) {
      // Store user for tracking
      if (userData) {
        try {
          localStorage.setItem('user', JSON.stringify(userData));
        } catch(e) {}
      }
      this.track('login');
    },
    
    // Track logout
    trackLogout: function() {
      this.track('logout');
      try {
        localStorage.removeItem('user');
      } catch(e) {}
    },
    
    // Track payment failure
    trackPaymentFailed: function(paymentDetails) {
      this.track('payment_failed', paymentDetails);
    },
    
    // Track churn signal (user clicked cancel, downgraded, etc.)
    trackChurnSignal: function(reason) {
      this.track('churn_signal', { reason });
    }
  };
  
  // Auto-init if API key is in data attribute
  document.addEventListener('DOMContentLoaded', function() {
    const script = document.querySelector('script[data-churnguard-key]');
    if (script) {
      const apiKey = script.getAttribute('data-churnguard-key');
      const debug = script.hasAttribute('data-debug');
      if (apiKey) {
        window.ChurnGuard.init(apiKey, { debug });
      }
    }
  });
})();