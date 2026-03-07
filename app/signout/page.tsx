'use client';

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    signOut().then(() => {
      router.push('/');
    });
  }, [signOut, router]);

  return (
    <div style={{minHeight: '100vh', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui'}}>
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: '2rem', marginBottom: '1rem'}}>👋</div>
        <h2>Signing you out...</h2>
        <p style={{color: '#94a3b8'}}>Please wait</p>
      </div>
    </div>
  );
}
