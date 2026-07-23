import { SignIn } from "@clerk/nextjs";
import { PAGE_BG } from "@/app/lib/design-tokens";

export default function Page() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: PAGE_BG }}>
      <SignIn />
    </div>
  );
}