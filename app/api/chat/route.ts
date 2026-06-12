import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key missing' }, { status: 500 });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: 'You are ChurnGuard AI support. Help SaaS founders reduce churn. Answer about pricing ($49/$149/$499), features (predictions, alerts, SMS, email, workflows, dunning, cancellation flows), setup (Stripe integration, 5 minutes), security (encryption, data privacy). Be concise. If you cannot answer, ask for their email.',
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[chat] Anthropic error:', response.status, errorText);
      return NextResponse.json({ error: 'AI temporarily unavailable' }, { status: 503 });
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || 'I could not generate a response.';

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[chat] Route error:', err);
    return NextResponse.json({ error: 'Service error' }, { status: 500 });
  }
}
