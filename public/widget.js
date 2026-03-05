(function() {
  'use strict';
  
  window.ChurnGuard = {
    config: {
      apiKey: null,
      apiUrl: 'https://churn-guard-app.vercel.app/api',
    },
    
    init: function(config) {
      this.config = { ...this.config, ...config };
      if (!this.config.apiKey) {
        console.error('ChurnGuard: API key required');
        return;
      }
      this.loadMessages();
    },
    
    loadMessages: function() {
      const email = this.getCustomerEmail();
      if (!email) {
        console.error('ChurnGuard: Customer email not found');
        return;
      }
      
      fetch(`${this.config.apiUrl}/widget/messages?apiKey=${this.config.apiKey}&email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.messages && data.messages.length > 0) {
            this.renderWidget(data.messages);
          }
        })
        .catch(err => console.error('ChurnGuard:', err));
    },
    
    getCustomerEmail: function() {
      if (window.user && window.user.email) return window.user.email;
      if (window.currentUser && window.currentUser.email) return window.currentUser.email;
      const el = document.querySelector('[data-churnguard-email]');
      if (el) return el.dataset.churnguardEmail;
      return null;
    },
    
    renderWidget: function(messages) {
      const existing = document.getElementById('churnguard-widget');
      if (existing) existing.remove();
      
      const widget = document.createElement('div');
      widget.id = 'churnguard-widget';
      widget.innerHTML = `
        <div id="cg-badge" style="
          position: fixed;
          right: 20px;
          bottom: 20px;
          width: 60px;
          height: 60px;
          background: #8b5cf6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
        ">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          ${messages.length > 1 ? `<span style="
            position: absolute;
            top: -5px;
            right: -5px;
            background: #ef4444;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
          ">${messages.length}</span>` : ''}
        </div>
        
        <div id="cg-panel" style="
          position: fixed;
          right: 20px;
          bottom: 90px;
          width: 380px;
          max-height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          z-index: 9999;
          display: none;
          overflow: hidden;
          font-family: system-ui, sans-serif;
        ">
          <div style="
            background: #8b5cf6;
            color: white;
            padding: 16px 20px;
            font-weight: 600;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span>🛡️ Important Updates</span>
            <span id="cg-close" style="cursor: pointer; font-size: 20px;">&times;</span>
          </div>
          <div style="padding: 0; max-height: 400px; overflow-y: auto;">
            ${messages.map(msg => `
              <div class="cg-message" data-id="${msg.id}" style="
                padding: 16px 20px;
                border-bottom: 1px solid #e5e7eb;
                cursor: pointer;
              ">
                <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${msg.title}</div>
                <div style="color: #6b7280; font-size: 14px;">${msg.content}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      
      document.body.appendChild(widget);
      
      document.getElementById('cg-badge').addEventListener('click', () => {
        const panel = document.getElementById('cg-panel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
      });
      
      document.getElementById('cg-close').addEventListener('click', () => {
        document.getElementById('cg-panel').style.display = 'none';
      });
    },
  };
})();