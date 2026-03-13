import Sidebar from '@/app/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{minHeight: '100vh', background: '#0f172a', display: 'flex'}}>
      <Sidebar />
      <main style={{marginLeft: '250px', flex: 1, padding: '2rem'}}>
        {children}
      </main>
    </div>
  );
}