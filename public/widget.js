(function() {
  // ChurnGuard Widget
  window.ChurnGuard = {
    apiKey: null,
    customerId: null,
    
    init: function(config) {
      this.apiKey = config.apiKey;
      this.customerId = config.customerId;
      
      // Auto-track page views
      this.track('page_view', { url: window.location.href });
      
      // Check for risk and show messages
      this.checkRisk();
    },
    
    track: function(event, metadata) {
      fetch('https://churn-guard-app.vercel.app/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: this.apiKey,
          customerId: this.customerId,
          event: event,
          metadata: metadata,
          timestamp: Date.now()
        })
      });
    },
    
    checkRisk: function() {
      // Poll for risk score every 5 minutes
      setInterval(() => {
        this.track('heartbeat', { timeOnSite: Date.now() });
      }, 300000);
    },
    
    showMessage: function(message, type = 'info') {
      const div = document.createElement('div');
      div.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'danger' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#6366f1'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        max-width: 400px;
        font-family: system-ui, sans-serif;
        animation: slideIn 0.3s ease;
      `;
      div.innerHTML = message;
      document.body.appendChild(div);
      
      setTimeout(() => {
        div.remove();
      }, 10000);
    }
  };
  
  // CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
})();
