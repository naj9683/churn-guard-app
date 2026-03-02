export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{display: 'flex', minHeight: '100vh', backgroundColor: '#020617'}}>
      <div style={{width: '250px', backgroundColor: '#0f172a', borderRight: '1px solid #1e293b', padding: '1.5rem'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem'}}>
          <div style={{width: '32px', height: '32px', backgroundColor: '#6366f1', borderRadius: '8px'}}></div>
          <span style={{fontWeight: 'bold', fontSize: '1.25rem', color: 'white'}}>ChurnGuard</span>
        </div>
        <nav style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <a href="/dashboard" style={{padding: '0.75rem', backgroundColor: '#1e293b', borderRadius: '0.5rem', color: 'white', textDecoration: 'none'}}>Overview</a>
          <a href="/dashboard/customers" style={{padding: '0.75rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>Customers</a>
          <a href="/dashboard/playbooks" style={{padding: '0.75rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>Playbooks</a>
          <a href="/dashboard/analytics" style={{padding: '0.75rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>Analytics</a>
          <a href="/dashboard/settings" style={{padding: '0.75rem', borderRadius: '0.5rem', color: '#94a3b8', textDecoration: 'none'}}>Settings</a>
        </nav>
        <div style={{marginTop: 'auto', paddingTop: '2rem'}}>
          <div style={{padding: '1rem', backgroundColor: '#1e293b', borderRadius: '0.5rem'}}>
            <p style={{fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem'}}>Free Plan</p>
            <div style={{height: '4px', backgroundColor: '#334155', borderRadius: '2px'}}>
              <div style={{width: '60%', height: '100%', backgroundColor: '#6366f1', borderRadius: '2px'}}></div>
            </div>
            <p style={{fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem'}}>60/100 customers</p>
          </div>
        </div>
      </div>
      <div style={{flex: 1, overflow: 'auto'}}>
        {children}
      </div>
    </div>
  )
}