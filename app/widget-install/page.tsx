'use client';

import Link from 'next/link';

export default function WidgetInstallPage() {
  const installCode = `<script src="https://churn-guard-app.vercel.app/widget.js"></script>
<script>
  ChurnGuard.init({
    apiKey: 'YOUR_API_KEY',
    customerId: 'USER_ID'
  });
</script>`;

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', padding: '2rem'}}>
      <Link href="/widget-messages" style={{color: '#94a3b8'}}>← Back</Link>
      <h1 style={{marginTop: '2rem'}}>Install Widget</h1>
      <p style={{color: '#94a3b8'}}>Add this code to your website:</p>
      <pre style={{background: '#1e293b', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto'}}>
        <code>{installCode}</code>
      </pre>
    </div>
  );
}
