(function() {
  'use strict';
  
  // ChurnGuard Widget
  window.ChurnGuard = window.ChurnGuard || {};
  
  const CONFIG = {
    apiUrl: 'https://churnguardapp.com',
    debug: false
  };
  
  let customerId = null;
  let apiKey = null;
  let widgetLoaded = false;
  
  // Initialize widget
  window.ChurnGuard.init = function(config) {
    apiKey = config.apiKey;
    customerId = config.customerId || generateCustomerId();
    
    if (!apiKey) {
      console.error('ChurnGuard: API key required');
      return;
    }
    
    log('Widget initialized for customer:', customerId);
    
    // Track page view
    trackEvent('page_view', {
      url: window.location.href,
      title: document.title
    });
    
    // Check for messages to display
    checkMessages();
    
    // Check periodically (every 30 seconds)
    setInterval(checkMessages, 30000);
    
    // Track heartbeat (user active)
    let lastActivity = Date.now();
    document.addEventListener('mousemove', () => {
      if (Date.now() - lastActivity > 60000) {
        trackEvent('heartbeat', {});
        lastActivity = Date.now();
      }
    });
  };
  
  // Generate anonymous customer ID if not provided
  function generateCustomerId() {
    let id = localStorage.getItem('churnguard_customer_id');
    if (!id) {
      id = 'cg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('churnguard_customer_id', id);
    }
    return id;
  }
  
  // Track event
  function trackEvent(event, metadata) {
    fetch(`${CONFIG.apiUrl}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: apiKey,
        customerId: customerId,
        event: event,
        metadata: {
          ...metadata,
          url: window.location.href,
          userAgent: navigator.userAgent
        },
        timestamp: Date.now()
      })
    }).catch(err => log('Track error:', err));
  }
  
  // Check for widget messages
  async function checkMessages() {
    try {
      const response = await fetch(`${CONFIG.apiUrl}/api/widget/messages?apiKey=${apiKey}&customerId=${customerId}`);
      if (!response.ok) return;
      
      const data = await response.json();
      if (data.messages && data.messages.length > 0) {
        showWidget(data.messages[0]);
      }
    } catch (err) {
      log('Check messages error:', err);
    }
  }
  
  // Show widget popup
  function showWidget(message) {
    if (widgetLoaded) return; // Don't show multiple
    
    widgetLoaded = true;
    
    // Create widget HTML
    const widget = document.createElement('div');
    widget.id = 'churnguard-widget';
    widget.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 380px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        color: white;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 999999;
        animation: slideIn 0.3s ease-out;
      ">
        <button onclick="window.ChurnGuard.closeWidget()" style="
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">×</button>
        
        <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">
          ${message.title || 'We miss you!'}
        </h3>
        
        <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.5; opacity: 0.95;">
          ${message.content || 'You\'ve been inactive. Here\'s a special offer to help you get the most out of our service.'}
        </p>
        
        <div style="display: flex; gap: 12px;">
          <button onclick="window.ChurnGuard.acceptOffer()" style="
            flex: 1;
            padding: 12px 20px;
            background: white;
            color: #6366f1;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            font-size: 15px;
          ">
            ${message.cta || 'Claim Offer'}
          </button>
          
          <button onclick="window.ChurnGuard.closeWidget()" style="
            padding: 12px 20px;
            background: rgba(255,255,255,0.2);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 15px;
          ">
            Maybe later
          </button>
        </div>
      </div>
      
      <style>
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      </style>
    `;
    
    document.body.appendChild(widget);
    
    // Track impression
    trackEvent('widget_shown', {
      messageId: message.id,
      title: message.title
    });
  }
  
  // Close widget
  window.ChurnGuard.closeWidget = function() {
    const widget = document.getElementById('churnguard-widget');
    if (widget) {
      widget.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => widget.remove(), 300);
      widgetLoaded = false;
      
      trackEvent('widget_dismissed', {});
    }
  };
  
  // Accept offer
  window.ChurnGuard.acceptOffer = function() {
    trackEvent('widget_accepted', {});
    window.ChurnGuard.closeWidget();
    
    // Redirect to dashboard or show success
    alert('Thanks! Redirecting you to claim your offer...');
    window.location.href = 'https://churnguardapp.com/dashboard';
  };
  
  // Log helper
  function log(...args) {
    if (CONFIG.debug) console.log('[ChurnGuard]', ...args);
  }
  
  // Auto-init if config exists
  if (window.churnGuardConfig) {
    window.ChurnGuard.init(window.churnGuardConfig);
  }
})();
