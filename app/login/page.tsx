import { SignIn } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn redirectUrl="/api/auth/callback" />
    </div>
  );
}
