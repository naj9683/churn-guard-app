import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { email: 'user@example.com' },
    include: { 
      customers: true,
      playbooks: true 
    }
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const customers = user.customers || [];
  const activePlaybooks = user.playbooks?.filter(p => p.active).length || 0;

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      {/* Header */}
      <div style={{borderBottom: '1px solid #1e293b', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', margin: 0}}>ChurnGuard</h1>
          <p style={{color: '#94a3b8', margin: '0.25rem 0 0 0', fontSize: '0.875rem'}}>Retention Playbook System</p>
        </div>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <span style={{color: '#94a3b8', fontSize: '0.875rem'}}>{activePlaybooks} Playbooks Active</span>
          <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {user.name?.[0] || 'U'}
          </div>
        </div>
      </div>

      <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
        {/* Stats */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem'}}>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <p style={{color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 0.5rem 0'}}>Total Customers</p>
            <p style={{fontSize: '2rem', fontWeight: 'bold', margin: 0}}>{customers.length}</p>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <p style={{color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 0.5rem 0'}}>At Risk</p>
            <p style={{fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#f59e0b'}}>
              {customers.filter(c => c.status === 'at_risk').length}
            </p>
          </div>
          <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155'}}>
            <p style={{color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 0.5rem 0'}}>Monthly Revenue</p>
            <p style={{fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#10b981'}}>
              ${customers.reduce((sum, c) => sum + c.mrr, 0).toFixed(0)}
            </p>
          </div>
        </div>

        {/* Playbooks Status */}
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155', marginBottom: '2rem'}}>
          <h2 style={{margin: '0 0 1rem 0', fontSize: '1.25rem'}}>Active Playbooks</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem'}}>
            {user.playbooks?.map((playbook) => (
              <div key={playbook.id} style={{
                padding: '1rem', 
                borderRadius: '0.5rem', 
                background: playbook.active ? '#059669' : '#374151',
                border: '1px solid',
                borderColor: playbook.active ? '#10b981' : '#4b5563'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span style={{fontWeight: '600'}}>{playbook.type.replace(/_/g, ' ')}</span>
                  <span style={{
                    fontSize: '0.75rem', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '9999px',
                    background: playbook.active ? '#10b981' : '#6b7280'
                  }}>
                    {playbook.active ? 'ACTIVE' : 'OFF'}
                  </span>
                </div>
                <p style={{fontSize: '0.875rem', color: '#d1d5db', margin: '0.5rem 0 0 0'}}>
                  Runs: {playbook.runCount} | Last: {playbook.lastRunAt ? new Date(playbook.lastRunAt).toLocaleDateString() : 'Never'}
                </p>
              </div>
            )) || <p>No playbooks configured</p>}
          </div>
        </div>

        {/* Customers Table */}
        <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', overflow: 'hidden'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{margin: 0, fontSize: '1.25rem'}}>Customers</h2>
            <Link href="/playbooks" style={{
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: 'white',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}>
              Configure Playbooks
            </Link>
          </div>
          
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead style={{background: '#0f172a'}}>
                <tr>
                  <th style={{textAlign: 'left', padding: '0.75rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Customer</th>
                  <th style={{textAlign: 'left', padding: '0.75rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Status</th>
                  <th style={{textAlign: 'left', padding: '0.75rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Last Login</th>
                  <th style={{textAlign: 'left', padding: '0.75rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>MRR</th>
                  <th style={{textAlign: 'left', padding: '0.75rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} style={{borderTop: '1px solid #334155'}}>
                    <td style={{padding: '0.75rem'}}>
                      <div style={{fontWeight: '500'}}>{customer.name || 'Unknown'}</div>
                      <div style={{fontSize: '0.875rem', color: '#94a3b8'}}>{customer.email}</div>
                    </td>
                    <td style={{padding: '0.75rem'}}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        background: customer.status === 'active' ? '#059669' : customer.status === 'at_risk' ? '#d97706' : '#dc2626',
                        color: 'white'
                      }}>
                        {customer.status}
                      </span>
                    </td>
                    <td style={{padding: '0.75rem', color: '#94a3b8', fontSize: '0.875rem'}}>
                      {customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td style={{padding: '0.75rem', fontWeight: '500', color: 'white'}}>${customer.mrr}</td>
                    <td style={{padding: '0.75rem'}}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        background: customer.riskScore > 70 ? '#dc2626' : customer.riskScore > 40 ? '#d97706' : '#059669'
                      }}>
                        {customer.riskScore}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}