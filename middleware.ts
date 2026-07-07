import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Clerk auth required — unauthenticated users redirect to /sign-in
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/customers(.*)",
  "/playbooks(.*)",
  "/analytics(.*)",
  "/settings(.*)",
  "/automations(.*)",
  "/interventions(.*)",
  "/widget(.*)",
  "/email-campaigns(.*)",
  "/team(.*)",
  "/export(.*)",
]);

// Page routes that require an active trial or paid subscription
// Expired → redirect to /upgrade
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
  "/team(.*)",
  "/export(.*)",
]);

// API routes that require an active trial or paid subscription
// Expired → return 402 JSON (not a redirect)
const isPaywalledApiRoute = createRouteMatcher([
  "/api/dashboard(.*)",
  "/api/customers(.*)",
  "/api/playbooks(.*)",
  "/api/analytics(.*)",
  "/api/settings(.*)",
  "/api/automation(.*)",
  "/api/interventions(.*)",
  "/api/email-campaigns(.*)",
  "/api/email-templates(.*)",
  "/api/team(.*)",
  "/api/export(.*)",
  "/api/revenue-impact(.*)",
  "/api/ai-recommendations(.*)",
  "/api/risk(.*)",
  "/api/sequences(.*)",
  "/api/integrations(.*)",
  "/api/alerts(.*)",
  "/api/digest(.*)",
  "/api/widget-messages(.*)",
]);

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export default clerkMiddleware(async (auth, req) => {
  // 1. Clerk auth gate — redirect to /sign-in if not logged in
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // 2. Paywall gate — cookie set by /api/subscription/status on every page load
  //    Cookie values: 'active' | 'grace' | 'blocked'
  //    Only 'blocked' triggers the gate; missing/unknown cookie = fail open
  if (isPaywalledRoute(req) || isPaywalledApiRoute(req)) {
    const { userId } = await auth();
    if (userId) {
      const paywallStatus = req.cookies.get('cg_paywall')?.value;
      if (paywallStatus === 'blocked') {
        // API consumers get JSON 402; browser page requests get a redirect
        if (isPaywalledApiRoute(req)) {
          return NextResponse.json(
            { error: 'Your free trial has expired. Upgrade to continue.', upgrade: '/upgrade' },
            { status: 402 }
          );
        }
        return NextResponse.redirect(new URL('/upgrade?expired=true', req.url));
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
