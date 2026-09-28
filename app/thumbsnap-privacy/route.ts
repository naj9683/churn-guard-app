import { NextResponse } from 'next/server';

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Privacy Policy — ThumbSnap AI</title>
<meta name="description" content="Privacy policy for ThumbSnap AI, the AI YouTube thumbnail maker by SAADI LLC.">
<style>
  :root { color-scheme: light dark; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0 auto;
    padding: 24px 20px 56px;
    max-width: 720px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: #1a1a1a;
    background: #ffffff;
    overflow-wrap: break-word;
  }
  h1 { font-size: 1.55rem; line-height: 1.25; margin: 0 0 8px; }
  h2 { font-size: 1.12rem; line-height: 1.3; margin: 32px 0 8px; }
  p, li { margin: 0 0 12px; }
  ul { margin: 0 0 12px; padding-left: 22px; }
  li { margin-bottom: 6px; }
  a { color: #1052c8; }
  .updated { margin: 0 0 24px; color: #444; }
  .copyright { margin-top: 40px; color: #444; }
</style>
</head>
<body>

<h1>Privacy Policy — ThumbSnap AI</h1>

<p class="updated">Last updated: September 28, 2026</p>

<h2>1. About ThumbSnap AI</h2>
<p>ThumbSnap AI is an AI-powered YouTube thumbnail maker for Android, developed and operated by SAADI LLC. This privacy policy explains how the app handles your data. If you have questions, contact us at <a href="mailto:najwasaadi1@gmail.com">najwasaadi1@gmail.com</a>.</p>

<h2>2. No Accounts Required</h2>
<p>ThumbSnap AI does not require you to create an account or sign up. You can use the app without providing any personal information such as your name, email address, or phone number.</p>

<h2>3. Data We Do Not Collect</h2>
<p>We do not collect personal information such as your name, email address, or phone number, and we do not track how you use the app. Specifically:</p>
<ul>
  <li>No name, email, or contact information</li>
  <li>No advertising IDs or device identifiers used for advertising or tracking</li>
  <li>No location data</li>
  <li>No usage analytics or behavioral tracking</li>
  <li>No crash reports sent to our servers</li>
</ul>

<h2>4. Photo and Camera Access</h2>
<p>ThumbSnap AI may request access to your device's photo library or camera solely to allow you to import images you choose to use in a thumbnail, or to save a completed thumbnail to your device. Photos are accessed only when you explicitly initiate an import or save action. The images you choose are sent over HTTPS to a server operated by SAADI LLC, which forwards them to Google Gemini for AI generation and to remove.bg for background removal so that they can be processed. Processing is ephemeral: the result is returned to your device, and neither that server nor SAADI LLC retains your prompts or images. The only copy of a thumbnail that is saved is the one on your own device.</p>

<h2>5. AI Generation — Google Gemini API</h2>
<p>Thumbnail generation is powered by the Google Gemini API, and background removal is provided by remove.bg. When you generate or edit a thumbnail, the prompt and the image you selected are sent over HTTPS to a server operated by SAADI LLC. That server forwards them to Google Gemini for generation and to remove.bg for background removal; both process the data on our behalf as service providers, and the result is returned to your device. Data sent for processing is ephemeral and is handled in accordance with <a href="https://policies.google.com/privacy">Google's Privacy Policy</a> and <a href="https://www.remove.bg/privacy">remove.bg's Privacy Policy</a>. SAADI LLC does not retain or store any prompts or images sent for processing.</p>

<h2>6. Payments — Google Play Billing &amp; RevenueCat</h2>
<p>In-app purchases and subscriptions are processed through Google Play Billing. Purchase management and entitlement verification are handled by RevenueCat. Neither SAADI LLC nor ThumbSnap AI directly collects or stores your payment card details. Any billing data is governed by Google Play's and RevenueCat's respective privacy policies. RevenueCat may collect a pseudonymous user identifier for the purpose of tracking subscription status; this identifier is not linked to any personal information on our end.</p>

<h2>7. Third-Party Services</h2>
<p>ThumbSnap AI integrates with the following third-party services, each governed by their own privacy policies:</p>
<ul>
  <li><strong>Google Gemini API</strong> — AI generation. <a href="https://policies.google.com/privacy">Google Privacy Policy</a></li>
  <li><strong>remove.bg</strong> — background removal. <a href="https://www.remove.bg/privacy">remove.bg Privacy Policy</a></li>
  <li><strong>Google Play Billing</strong> — payments. <a href="https://payments.google.com/payments/apis-secure/u/0/get_legal_document?ldo=0&amp;ldt=privacynotice">Google Payments Privacy Notice</a></li>
  <li><strong>RevenueCat</strong> — subscription management. <a href="https://www.revenuecat.com/privacy">RevenueCat Privacy Policy</a></li>
</ul>

<h2>8. Children's Privacy</h2>
<p>ThumbSnap AI is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided personal information through the app, please contact us and we will promptly address it.</p>

<h2>9. Changes to This Policy</h2>
<p>We may update this privacy policy from time to time. Changes will be reflected by an updated date at the top of this page. Continued use of ThumbSnap AI after any changes constitutes acceptance of the revised policy.</p>

<h2>10. Data Deletion</h2>
<p>ThumbSnap AI has no accounts. Everything you make in the app lives on your device, and uninstalling the app removes it. Purchases sit under an anonymous identifier held through Google Play Billing and RevenueCat. To request deletion of data associated with your use of the app, email <a href="mailto:najwasaadi1@gmail.com">najwasaadi1@gmail.com</a>. Data is encrypted in transit using HTTPS.</p>

<h2>11. Contact</h2>
<p>For any questions or concerns about this privacy policy, contact SAADI LLC at: <a href="mailto:najwasaadi1@gmail.com">najwasaadi1@gmail.com</a></p>

<p class="copyright">© 2026 SAADI LLC</p>

</body>
</html>`;

export async function GET() {
  return new NextResponse(HTML, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
