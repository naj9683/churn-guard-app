import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface RiskAnalysisResult {
  churnProbability: number; // 0–100
  riskFactors: string[];
  recommendedAction: string;
  summary: string; // one-sentence risk explanation for the dashboard
}

export interface CustomerRiskInput {
  email: string;
  mrr: number;
  plan: string | null;
  healthScore: number | null;
  currentRiskScore: number;
  lastLoginAt: Date | null;
  loginCountThisMonth: number;
  featuresUsed: string[];
  recentEvents: Array<{ event: string; timestamp: number }>;
  activeInterventions: number;
}

function daysSince(date: Date | null): number | null {
  if (!date) return null;
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export async function analyzeCustomerRisk(
  input: CustomerRiskInput
): Promise<RiskAnalysisResult> {
  const daysSinceLogin = daysSince(input.lastLoginAt);

  const dataBlock = JSON.stringify({
    mrr_usd_per_month: input.mrr,
    plan: input.plan ?? 'unknown',
    health_score: input.healthScore ?? 100,
    days_since_last_login: daysSinceLogin ?? 'never logged in',
    logins_this_month: input.loginCountThisMonth,
    features_used: input.featuresUsed.length ? input.featuresUsed : ['none recorded'],
    recent_events: input.recentEvents.slice(0, 10).map(e => e.event),
    active_interventions: input.activeInterventions,
  });

  const prompt = `You are a customer churn analyst for a B2B SaaS company.
Analyze the following customer data and return ONLY a valid JSON object — no markdown, no explanation.

Customer data:
${dataBlock}

Return exactly this JSON shape:
{
  "churnProbability": <integer 0-100>,
  "riskFactors": [<up to 4 concise strings>],
  "recommendedAction": <single most important action as a string>,
  "summary": <one sentence starting with "Risk: " explaining the main driver, e.g. "Risk: High because last login was 14 days ago and MRR dropped 20%">
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 300,
  });

  const raw = completion.choices[0]?.message?.content ?? '';

  // Strip possible markdown fences
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let parsed: RiskAnalysisResult;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Fallback if OpenAI returns unexpected format
    parsed = {
      churnProbability: input.currentRiskScore,
      riskFactors: ['Unable to parse AI response'],
      recommendedAction: 'Manual review recommended',
      summary: `Risk: Score ${input.currentRiskScore} — AI analysis unavailable`,
    };
  }

  // Clamp churnProbability to valid range
  parsed.churnProbability = Math.max(0, Math.min(100, Math.round(parsed.churnProbability ?? input.currentRiskScore)));

  return parsed;
}
