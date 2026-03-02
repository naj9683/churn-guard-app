import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();
  
  const chartData = [40, 30, 45, 35, 50, 45, 60]
  
  return (
    <div style={{padding: '2rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <h1 style={{fontSize: '1.875rem', fontWeight: 'bold', color: 'white'}}>Dashboard</h1>
          <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Welcome back, {user?.firstName || 'Admin'}</p>
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <button style={{padding: '0.5rem 1rem', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white', cursor: 'pointer'}}>Export Data</button>
          <button style={{padding: '0.5rem 1rem', backgroundColor: '#6366f1', border: 'none', borderRadius: '0.5rem', color: 'white', cursor: 'pointer'}}>+ Add Customer</button>
        </div>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem'}}>
        <div style={{backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
          <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Total Customers</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold'}}>1,247</p>
          <p style={{fontSize: '0.75rem', color: '#4ade80'}}>+12 this week</p>
        </div>
        <div style={{backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
          <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>At Risk</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#f87171'}}>12</p>
          <p style={{fontSize: '0.75rem', color: '#f87171'}}>Needs attention</p>
        </div>
        <div style={{backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
          <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Revenue Saved</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#4ade80'}}>$4,250</p>
          <p style={{fontSize: '0.75rem', color: '#4ade80'}}>+18% vs last month</p>
        </div>
        <div style={{backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
          <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Active Playbooks</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#818cf8'}}>3/3</p>
          <p style={{fontSize: '0.75rem', color: '#818cf8'}}>All running</p>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem'}}>
        <div style={{backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
          <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem'}}>Churn Risk Trend</h3>
          <div style={{display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: '150px', paddingTop: '1rem'}}>
            {chartData.map((value, index) => (
              <div key={index} style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{
                  width: '100%', 
                  height: `${value * 2}px`, 
                  backgroundColor: index === chartData.length - 1 ? '#f87171' : '#6366f1',
                  borderRadius: '4px 4px 0 0'
                }}></div>
                <span style={{fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem'}}>{['M','T','W','T','F','S','S'][index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
          <h3 style={{fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem'}}>Active Playbooks</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {[
              {name: 'Onboarding Rescue', active: true, count: '5 rescued'},
              {name: 'Silent Quitter', active: true, count: '3 re-engaged'},
              {name: 'Payment Savior', active: true, count: '$1,200 saved'}
            ].map((playbook) => (
              <div key={playbook.name} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#334155', borderRadius: '0.5rem'}}>
                <div>
                  <p style={{fontWeight: '500', fontSize: '0.875rem'}}>{playbook.name}</p>
                  <p style={{fontSize: '0.75rem', color: '#94a3b8'}}>{playbook.count}</p>
                </div>
                <div style={{
                  width: '40px', 
                  height: '20px', 
                  backgroundColor: playbook.active ? '#22c55e' : '#334155',
                  borderRadius: '10px',
                  position: 'relative',
                  cursor: 'pointer'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '2px',
                    left: playbook.active ? '22px' : '2px',
                    width: '16px',
                    height: '16px',
                    backgroundColor: 'white',
                    borderRadius: '50%'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h3 style={{fontSize: '1.125rem', fontWeight: '600'}}>At Risk Customers</h3>
          <a href="/dashboard/customers" style={{color: '#6366f1', fontSize: '0.875rem', textDecoration: 'none'}}>View All</a>
        </div>
        <div style={{overflow: 'auto'}}>
          <table style={{width: '100%', borderCollapse: 'collapse'}}>
            <thead>
              <tr style={{borderBottom: '1px solid #334155', textAlign: 'left'}}>
                <th style={{padding: '0.75rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500'}}>Customer</th>
                <th style={{padding: '0.75rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500'}}>Risk Score</th>
                <th style={{padding: '0.75rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500'}}>Last Active</th>
                <th style={{padding: '0.75rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500'}}>MRR</th>
                <th style={{padding: '0.75rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                {name: 'Acme Corp', email: 'john@acme.com', risk: 85, lastActive: '2 days ago', mrr: '$299'},
                {name: 'TechStart Inc', email: 'sarah@techstart.com', risk: 72, lastActive: '5 days ago', mrr: '$149'},
                {name: 'Global Solutions', email: 'mike@global.com', risk: 68, lastActive: '1 week ago', mrr: '$499'},
                {name: 'StartupXYZ', email: 'lisa@startupxyz.com', risk: 45, lastActive: '3 days ago', mrr: '$99'},
              ].map((customer) => (
                <tr key={customer.email} style={{borderBottom: '1px solid #334155'}}>
                  <td style={{padding: '0.75rem'}}>
                    <div>
                      <p style={{fontWeight: '500'}}>{customer.name}</p>
                      <p style={{fontSize: '0.75rem', color: '#64748b'}}>{customer.email}</p>
                    </div>
                  </td>
                  <td style={{padding: '0.75rem'}}>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: customer.risk > 70 ? '#f8717133' : '#fbbf2433',
                      color: customer.risk > 70 ? '#f87171' : '#fbbf24',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>{customer.risk}%</span>
                  </td>
                  <td style={{padding: '0.75rem', color: '#94a3b8', fontSize: '0.875rem'}}>{customer.lastActive}</td>
                  <td style={{padding: '0.75rem', fontWeight: '500'}}>{customer.mrr}</td>
                  <td style={{padding: '0.75rem'}}>
                    <button style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#6366f1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}>Take Action</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}