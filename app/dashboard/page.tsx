
   import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface PlaybookRun {
  id: string;
  userId: string;
  playbookType: string;
  status: string;
  createdAt: Date;
  user?: {
    email: string;
  };
}

export default async function Dashboard() {
  let activeUsers = 0;
  let atRiskUsers = 0;
  let churnedUsers = 0;
  let recentPlaybooks: PlaybookRun[] = [];

  try {
    const stats = await prisma.user.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    activeUsers = stats.find(s => s.status === 'ACTIVE')?._count.status || 0;
    atRiskUsers = stats.find(s => s.status === 'AT_RISK')?._count.status || 0;
    churnedUsers = stats.find(s => s.status === 'CHURNED')?._count.status || 0;

    recentPlaybooks = await prisma.playbookRun.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    }) as PlaybookRun[];
  } catch (error) {
    console.error('Database error:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Churn Guard Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Active Users</h3>
            <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">At Risk</h3>
            <p className="text-3xl font-bold text-yellow-600">{atRiskUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm font-medium">Churned</h3>
            <p className="text-3xl font-bold text-red-600">{churnedUsers}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Recent Playbook Runs</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Playbook</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentPlaybooks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No playbook runs yet</td>
                </tr>
              ) : (
                recentPlaybooks.map((run) => (
                  <tr key={run.id}>
                    <td className="px-6 py-4">{run.user?.email || 'Unknown'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        run.playbookType === 'ONBOARDING_RESCUE' ? 'bg-blue-100 text-blue-800' :
                        run.playbookType === 'SILENT_QUITTER' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {run.playbookType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        run.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        run.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {run.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(run.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Manual Playbook Test</h2>
          <form action="/api/cron/playbooks" method="GET">
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Run All Playbooks Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}