const GA4_ENDPOINT = 'https://www.google-analytics.com/mp/collect';

export function sendGA4Event(
  userId: string,
  gaClientId: string | null,
  eventName: string,
  params: Record<string, unknown>,
): void {
  const measurementId = process.env.GA4_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_MP_API_SECRET;
  if (!measurementId || !apiSecret) return;

  const body: Record<string, unknown> = {
    user_id: userId,
    events: [{ name: eventName, params }],
  };
  if (gaClientId) body.client_id = gaClientId;

  fetch(`${GA4_ENDPOINT}?measurement_id=${measurementId}&api_secret=${apiSecret}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch((err) => {
    console.error(`[ga4] failed to send ${eventName}:`, err);
  });
}
