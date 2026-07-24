import OpenAI from 'openai';
import { computeRiskScore } from './risk-formula';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface RiskAnalysisResult {
  churnProbability: number; // 0–100, always the deterministic formula score
  riskFactors: string[];
  recommendedAction: string;
  summary: string;
}

export interface CustomerRiskInput {
  email: string;
  mrr: number;
  plan: string | null;
  currentRiskScore: number;
  lastLoginAt: Date | null;
  loginCountThisMonth: number;
  featuresUsed: string[];
  recentEvents: Array<{ event: string; timestamp: number }>;
  activeInterventions: number;
}

export async function analyzeCustomerRisk(
  input: CustomerRiskInput
): Promise<RiskAnalysisResult> {
  // ── Step 1: compute the authoritative score deterministically ──────────────
  const {
    score: baselineScore,
    daysSinceLogin,
    failedPayments30d,
    hasEngagementData,
  } = computeRiskScore({
    lastLoginAt: input.lastLoginAt,
    loginCountThisMonth: input.loginCountThisMonth,
    recentEvents: input.recentEvents,
  });

  // ── Step 2: ask AI for qualitative analysis only (no number) ───────────────
  const dataBlock = JSON.stringify({
    mrr_usd_per_month: input.mrr,
    plan: input.plan ?? 'unknown',
    days_since_last_login: hasEngagementData ? (daysSinceLogin ?? 'never logged in') : 'no widget data',
    logins_this_month: hasEngagementData ? input.loginCountThisMonth : 'no widget data',
    failed_payments_last_30_days: failedPayments30d,
    features_used: input.featuresUsed.length ? input.featuresUsed : ['none recorded'],
    recent_events: input.recentEvents.slice(0, 10).map(e => e.event),
    active_interventions: input.activeInterventions,
    engagement_data_missing: !hasEngagementData,
  });

  const prompt = `You are a customer churn analyst for a B2B SaaS company.
The rule-based risk score for this customer is ${baselineScore}/100 (based on login recency, login frequency, and billing failures in the last 30 days).

Analyze the following customer data and explain the risk. Return ONLY a valid JSON object — no markdown, no explanation.

Customer data:
${dataBlock}

Return exactly this JSON shape (do NOT include a churnProbability field — the score is already determined):
{
  "riskFactors": [<up to 4 concise strings explaining what is driving the risk>],
  "recommendedAction": <single most important action as a string>,
  "summary": <one sentence starting with "Risk: " explaining the main driver>
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 300,
  });

  const raw = completion.choices[0]?.message?.content ?? '';
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  let qualitative: Pick<RiskAnalysisResult, 'riskFactors' | 'recommendedAction' | 'summary'>;
  try {
    qualitative = JSON.parse(cleaned);
  } catch {
    qualitative = {
      riskFactors: ['AI analysis unavailable'],
      recommendedAction: 'Manual review recommended',
      summary: `Risk: Score ${baselineScore} — AI explanation unavailable`,
    };
  }

  return {
    churnProbability: baselineScore, // always the formula — never the AI's guess
    riskFactors: qualitative.riskFactors ?? [],
    recommendedAction: qualitative.recommendedAction ?? 'Review customer',
    summary: qualitative.summary ?? `Risk: Score ${baselineScore}`,
  };
}
