// Risk calculation rules
export function calculateRiskScore(events: any[], currentScore: number = 50): number {
  let score = currentScore;
  
  // Get last 30 days of events
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
  const recentEvents = events.filter(e => e.timestamp > thirtyDaysAgo);
  
  // Last login check
  const logins = recentEvents.filter(e => e.event === 'login');
  if (logins.length === 0) {
    score += 25; // No logins in 30 days = high risk
  } else {
    const lastLogin = Math.max(...logins.map(e => e.timestamp));
    const daysSinceLogin = (now - lastLogin) / (1000 * 60 * 60 * 24);
    if (daysSinceLogin > 7) score += 15;
    if (daysSinceLogin > 3) score += 10;
  }
  
  // Payment failures
  const failedPayments = recentEvents.filter(e => e.event === 'payment_failed').length;
  score += failedPayments * 20;
  
  // Feature usage drop
  const featureUsage = recentEvents.filter(e => e.event === 'feature_used').length;
  if (featureUsage === 0) score += 10;
  if (featureUsage < 5) score += 5;
  
  // Support tickets (indicates frustration)
  const tickets = recentEvents.filter(e => e.event === 'support_ticket').length;
  score += tickets * 5;
  
  // Downgrade attempts
  const downgrades = recentEvents.filter(e => e.event === 'downgrade_initiated').length;
  if (downgrades > 0) score += 30;
  
  // Clamp between 0-100
  return Math.min(100, Math.max(0, score));
}

export function getRiskLevel(score: number): string {
  if (score >= 70) return 'CRITICAL';
  if (score >= 40) return 'HIGH';
  if (score >= 20) return 'MEDIUM';
  return 'LOW';
}
