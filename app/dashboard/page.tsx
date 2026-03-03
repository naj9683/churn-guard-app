import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();
  
  if (!userId) {
    return null;
  }

  // Fetch real data from database
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const totalCustomers = await prisma.customer.count();
  const atRiskCustomers = await prisma.customer.count({
    where: { riskScore: { gt: 70 } },
  });
  
  // Calculate revenue saved (mock calculation for now)
  const revenueSaved = 4250;

  const chartData = [40, 30, 45, 35, 50, 45, 60];
  
  return (
    <div style={{padding: '2rem'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <div>
          <h1 style={{fontSize: '1.875rem', fontWeight: 'bold', color: 'white'}}>Dashboard</h1>
          <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Welcome back, {user?.firstName || 'Admin'}</p>
        </div>
        <div style={{display: 'flex', gap: '1rem'}}>
          <a href="/dashboard/customers/new" style={{padding: '0.5rem 1rem', backgroundColor: '#6366f1', color: 'white', textDecoration: 'none', borderRadius: '0.5rem'}}>+ Add Customer</a>
        </div>
      </div>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem'}}>
        <div style={{backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
          <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Total Customers</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold', color: 'white'}}>{totalCustomers}</p>
          <p style={{fontSize: '0.75rem', color: '#4ade80'}}>+{totalCustomers > 0 ? totalCustomers : 0} this week</p>
        </div>
        <div style={{backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
          <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>At Risk</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#f87171'}}>{atRiskCustomers}</p>
          <p style={{fontSize: '0.75rem', color: '#f87171'}}>{atRiskCustomers > 0 ? 'Needs attention' : 'All good'}</p>
        </div>
        <div style={{backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
          <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Revenue Saved</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#4ade80'}}>${revenueSaved.toLocaleString()}</p>
          <p style={{fontSize: '0.75rem', color: '#4ade80'}}>+18% vs last month</p>
        </div>
        <div style={{backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
          <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>Active Playbooks</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#818cf8'}}>3/3</p>
          <p style={{fontSize: '0.75rem', color: '#818cf8'}}>All running</p>
        </div>
      </div>

      {/* Customer Table with Real Data */}
      <div style={{backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '0.75rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h3 style={{fontSize: '1.125rem', fontWeight: '600', color: 'white'}}>Recent Customers</h3>
          <a href="/dashboard/customers" style={{color: '#6366f1', fontSize: '0.875rem', textDecoration: 'none'}}>View All</a>
        </div>
        
        {customers.length === 0 ? (
          <div style={{textAlign: 'center', padding: '3rem', color: '#94a3b8'}}>
            <p>No customers yet. Add your first customer to get started!</p>
            <a href="/dashboard/customers/new" style={{display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#6366f1', color: 'white', textDecoration: 'none', borderRadius: '0.5rem'}}>Add Customer</a>
          </div>
        ) : (
          <div style={{overflow: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '1px solid #334155', textAlign: 'left'}}>
                  <th style={{padding: '0.75rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500'}}>Customer</th>
                  <th style={{padding: '0.75rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500'}}>Risk Score</th>
                  <th style={{padding: '0.75rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500'}}>Last Active</th>
                  <th style={{padding: '0.75rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500'}}>MRR</th>
                  <th style={{padding: '0.75rem', fontSize: '0.875rem', color: '#94a3b8', fontWeight: '500'}}>Status</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} style={{borderBottom: '1px solid #334155'}}>
                    <td style={{padding: '0.75rem'}}>
                      <div>
                        <p style={{fontWeight: '500', color: 'white'}}>{customer.name}</p>
                        <p style={{fontSize: '0.75rem', color: '#64748b'}}>{customer.email}</p>
                      </div>
                    </td>
                    <td style={{padding: '0.75rem'}}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: customer.riskScore > 70 ? '#f8717133' : customer.riskScore > 40 ? '#fbbf2433' : '#22c55e33',
                        color: customer.riskScore > 70 ? '#f87171' : customer.riskScore > 40 ? '#fbbf24' : '#4ade80',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>{customer.riskScore}%</span>
                    </td>
                    <td style={{padding: '0.75rem', color: '#94a3b8', fontSize: '0.875rem'}}>
                      {new Date(customer.lastActive).toLocaleDateString()}
                    </td>
                    <td style={{padding: '0.75rem', fontWeight: '500', color: 'white'}}>${customer.mrr}</td>
                    <td style={{padding: '0.75rem'}}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: customer.status === 'active' ? '#22c55e33' : '#ef444433',
                        color: customer.status === 'active' ? '#4ade80' : '#f87171',
                        borderRadius: '9999px',
                        fontSize: '0.75rem'
                      }}>{customer.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}