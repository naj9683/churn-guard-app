import { SignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LoginPage() {
  const { userId } = await auth();
  if (userId) redirect('/dashboard');

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn forceRedirectUrl="/dashboard" />
    </div>
  );
}
