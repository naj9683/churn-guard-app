'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function WidgetTest() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    // Initialize widget after script loads
    const initWidget = () => {
      if (window.ChurnGuard) {
        window.ChurnGuard.init({
          apiKey: 'cg_1772903392095_dkscv8',
          customerId: 'test-customer-new'
        });
        setStatus('✅ Widget initialized - popup should appear in 5 seconds!');
      }
    };
    
    // Wait 2 seconds for script to load
    setTimeout(initWidget, 2000);
  }, []);

  return (
    <div style={{padding: '50px', fontFamily: 'system-ui', background: '#0f172a', color: 'white', minHeight: '100vh'}}>
      <h1>🧪 ChurnGuard Widget Test</h1>
      <p>{status}</p>
      
      <div style={{background: '#1e293b', padding: '20px', borderRadius: '10px', marginTop: '20px'}}>
        <h3>Testing with:</h3>
        <p>• Customer: <strong>test-customer-new</strong></p>
        <p>• Risk Score: <strong>85</strong> (High Risk)</p>
        <p>• Widget should appear in bottom-right corner</p>
      </div>

      <Script 
        src="https://churn-guard-app.vercel.app/widget.js" 
        strategy="afterInteractive"
      />
    </div>
  );
}
