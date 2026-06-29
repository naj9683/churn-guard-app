import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// All routes that require an active trial or paid subscription
const isPaywalledRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/customers(.*)",
  "/playbooks(.*)",
  "/analytics(.*)",
  "/settings(.*)",
  "/automations(.*)",
  "/interventions(.*)",
  "/widget(.*)",
  "/email-campaigns(.*)",
]);

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Hard paywall: block expired trial users from all product routes
  if (isPaywalledRoute(req)) {
    const { userId } = await auth();
    if (userId) {
      const paywallStatus = req.cookies.get('cg_paywall')?.value;
      if (paywallStatus === 'blocked') {
        const upgradeUrl = new URL('/upgrade?expired=true', req.url);
        return NextResponse.redirect(upgradeUrl);
      }
    }
  }

  const res = NextResponse.next();
  Object.entries(NO_CACHE_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
