export default function WidgetTest() {
  return (
    <div style={{padding: '50px', fontFamily: 'system-ui', background: '#0f172a', color: 'white', minHeight: '100vh'}}>
      <h1>🧪 ChurnGuard Widget Test</h1>
      <p>This page tests the in-app widget for high-risk customers.</p>
      
      <div style={{background: '#1e293b', padding: '20px', borderRadius: '10px', marginTop: '20px'}}>
        <h3>Testing with:</h3>
        <p>• Customer: <strong>test-customer-new</strong></p>
        <p>• Risk Score: <strong>85</strong> (High Risk)</p>
        <p>• Widget should appear in bottom-right corner</p>
      </div>

      <script src="https://churn-guard-app.vercel.app/widget.js"></script>
      <script dangerouslySetInnerHTML={{
        __html: `
          window.churnGuardConfig = {
            apiKey: 'cg_1772903392095_dkscv8',
            customerId: 'test-customer-new'
          };
        `
      }} />
    </div>
  );
}
