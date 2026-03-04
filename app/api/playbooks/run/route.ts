import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export default async function DashboardPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findFirst({
    where: { email: 'test@example.com' },
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

  async function togglePlaybook(formData: FormData) {
    'use server';
    const playbookId = formData.get('playbookId') as string;
    const currentStatus = formData.get('currentStatus') === 'true';
    
    await prisma.playbookConfig.update({
      where: { id: playbookId },
      data: { active: !currentStatus }
    });
    
    revalidatePath('/dashboard');
  }

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      {/* Header */}
      <div style={{borderBottom: '1px solid #1e293b', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', margin: 0}}>ChurnGuard</h1>
          <p style={{color: '#94a3b8', margin: '0.25rem 0 0 0', fontSize: '0.875rem'}}>Retention Playbook System</p>
        </div>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <Link href="/activity" style={{color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem'}}>View Activity Log →</Link>
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

        {/* Playbooks Control Center */}
        <div style={{background: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #334155', marginBottom: '2rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h2 style={{margin: 0, fontSize: '1.25rem'}}>Playbook Control Center</h2>
            <span style={{color: '#94a3b8', fontSize: '0.875rem'}}>Toggle to enable/disable</span>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem'}}>
            {user.playbooks?.length > 0 ? user.playbooks.map((playbook) => (
              <div key={playbook.id} style={{
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                background: playbook.active ? '#064e3b' : '#1f2937',
                border: '2px solid',
                borderColor: playbook.active ? '#10b981' : '#374151'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                  <div>
                    <h3 style={{margin: '0 0 0.5rem 0', fontSize: '1.1rem'}}>{playbook.type.replace(/_/g, ' ')}</h3>
                    <p style={{margin: 0, color: '#9ca3af', fontSize: '0.875rem'}}>
                      {playbook.type === 'ONBOARDING_RESCUE' && 'Day 3 no activity → Email'}
                      {playbook.type === 'SILENT_QUITTER' && '5 days absent → Email + Slack'}
                      {playbook.type === 'PAYMENT_SAVER' && 'Payment fails → Email + Slack'}
                    </p>
                  </div>
                  <form action={togglePlaybook}>
                    <input type="hidden" name="playbookId" value={playbook.id} />
                    <input type="hidden" name="currentStatus" value={playbook.active.toString()} />
                    <button 
                      type="submit"
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '9999px',
                        border: 'none',
                        background: playbook.active ? '#10b981' : '#6b7280',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {playbook.active ? 'ACTIVE' : 'OFF'}
                    </button>
                  </form>
                </div>

                <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem'}}>
                  <div style={{flex: 1}}>
                    <p style={{margin: '0 0 0.25rem 0', color: '#9ca3af', fontSize: '0.75rem'}}>Last Run</p>
                    <p style={{margin: 0, fontSize: '0.875rem'}}>
                      {playbook.lastRunAt ? new Date(playbook.lastRunAt).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                  <div style={{flex: 1}}>
                    <p style={{margin: '0 0 0.25rem 0', color: '#9ca3af', fontSize: '0.75rem'}}>Total Runs</p>
                    <p style={{margin: 0, fontSize: '0.875rem'}}>{playbook.runCount}</p>
                  </div>
                </div>

                {/* Manual Trigger Form */}
                {playbook.active && customers.length > 0 && (
                  <form 
                    action={async (formData) => {
                      'use server';
                      const customerId = formData.get('customerId') as string;
                      const response = await fetch(`${process.env.VERCEL_URL || 'https://churn-guard-app.vercel.app'}/api/playbooks/run`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ playbookType: playbook.type, customerId })
                      });
                      revalidatePath('/dashboard');
                      revalidatePath('/activity');
                    }}
                    style={{marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #374151'}}
                  >
                    <p style={{margin: '0 0 0.5rem 0', color: '#9ca3af', fontSize: '0.75rem'}}>Test Manually:</p>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                      <select 
                        name="customerId" 
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '0.375rem',
                          border: '1px solid #4b5563',
                          background: '#1f2937',
                          color: 'white',
                          fontSize: '0.875rem'
                        }}
                      >
                        <option value="">Select customer...</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name || c.email}</option>
                        ))}
                      </select>
                      <button 
                        type="submit"
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          background: '#3b82f6',
                          color: 'white',
                          fontWeight: '600',
                          fontSize: '0.875rem',
                          cursor: 'pointer'
                        }}
                      >
                        Run Now
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )) : (
              <div style={{padding: '1rem', color: '#94a3b8'}}>No playbooks configured.</div>
            )}
          </div>
        </div>

        {/* Customers Table */}
        <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', overflow: 'hidden'}}>
          <div style={{padding: '1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{margin: 0, fontSize: '1.25rem'}}>Customers</h2>
            <Link 
              href="/customers/add" 
              style={{
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: 'white',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              + Add Customer
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
                {customers.length > 0 ? customers.map((customer) => (
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
                )) : (
                  <tr>
                    <td colSpan={5} style={{padding: '2rem', textAlign: 'center', color: '#94a3b8'}}>
                      No customers yet. <Link href="/customers/add" style={{color: '#3b82f6'}}>Add your first customer</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}