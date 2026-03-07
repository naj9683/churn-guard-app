'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function WidgetTest() {
  const [status, setStatus] = useState('Loading widget...');

  useEffect(() => {
    // Initialize widget after script loads
    const initWidget = () => {
      const win = window as any;
      if (win.ChurnGuard) {
        win.ChurnGuard.init({
          apiKey: 'cg_1772903392095_dkscv8',
          customerId: 'test-customer-new'
        });
        setStatus('✅ Widget initialized - check bottom-right corner!');
      } else {
        setStatus('❌ Widget not loaded yet, retrying...');
      }
    };
    
    // Try multiple times
    setTimeout(initWidget, 1000);
    setTimeout(initWidget, 3000);
    setTimeout(initWidget, 5000);
  }, []);

  return (
    <div style={{padding: '50px', fontFamily: 'system-ui', background: '#0f172a', color: 'white', minHeight: '100vh'}}>
      <h1>🧪 ChurnGuard Widget Test</h1>
      <p style={{color: '#10b981', fontSize: '18px'}}>{status}</p>
      
      <div style={{background: '#1e293b', padding: '20px', borderRadius: '10px', marginTop: '20px'}}>
        <h3>Testing with:</h3>
        <p>• Customer: <strong>test-customer-new</strong></p>
        <p>• Risk Score: <strong>85</strong> (High Risk)</p>
        <p>• Look at the bottom-right corner of your screen!</p>
      </div>

      <Script 
        src="https://churn-guard-app.vercel.app/widget.js" 
        strategy="afterInteractive"
      />
    </div>
  );
}
