import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function ActivityPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findFirst({
    where: { email: 'test@example.com' },
    include: { 
      events: {
        orderBy: { createdAt: 'desc' },
        take: 50
      }
    }
  });

  if (!user) {
    return <div>User not found</div>;
  }

  const events = user.events || [];

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'system-ui'}}>
      {/* Header */}
      <div style={{borderBottom: '1px solid #1e293b', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h1 style={{fontSize: '1.5rem', fontWeight: 'bold', margin: 0}}>ChurnGuard</h1>
          <p style={{color: '#94a3b8', margin: '0.25rem 0 0 0', fontSize: '0.875rem'}}>Activity Log</p>
        </div>
        <Link href="/dashboard" style={{color: '#94a3b8', textDecoration: 'none'}}>← Back to Dashboard</Link>
      </div>

      <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
        <h2 style={{marginBottom: '1.5rem'}}>Recent Playbook Activity</h2>
        
        {events.length === 0 ? (
          <div style={{background: '#1e293b', padding: '3rem', borderRadius: '0.75rem', textAlign: 'center', color: '#94a3b8'}}>
            <p>No playbook events yet.</p>
            <p style={{fontSize: '0.875rem', marginTop: '0.5rem'}}>Events will appear here when playbooks trigger.</p>
          </div>
        ) : (
          <div style={{background: '#1e293b', borderRadius: '0.75rem', border: '1px solid #334155', overflow: 'hidden'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead style={{background: '#0f172a'}}>
                <tr>
                  <th style={{textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Time</th>
                  <th style={{textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Playbook</th>
                  <th style={{textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Status</th>
                  <th style={{textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Customer</th>
                  <th style={{textAlign: 'left', padding: '1rem', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase'}}>Details</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} style={{borderTop: '1px solid #334155'}}>
                    <td style={{padding: '1rem', fontSize: '0.875rem', color: '#94a3b8'}}>
                      {new Date(event.createdAt).toLocaleString()}
                    </td>
                    <td style={{padding: '1rem'}}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: event.playbookType === 'ONBOARDING_RESCUE' ? '#3b82f6' : 
                                    event.playbookType === 'SILENT_QUITTER' ? '#f59e0b' : '#10b981',
                        color: 'white'
                      }}>
                        {event.playbookType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{padding: '1rem'}}>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        background: event.status === 'action_sent' ? '#059669' : 
                                    event.status === 'triggered' ? '#d97706' : '#dc2626',
                        color: 'white'
                      }}>
                        {event.status}
                      </span>
                    </td>
                    <td style={{padding: '1rem', fontSize: '0.875rem'}}>
                      {event.customerId ? event.customerId.slice(0, 8) + '...' : 'N/A'}
                    </td>
                    <td style={{padding: '1rem', fontSize: '0.875rem', color: '#94a3b8'}}>
                      {event.message || '-'}
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