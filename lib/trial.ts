export const TRIAL_DAYS = 30;
export const GRACE_DAYS = 3;

export type TrialStatus = 'trial' | 'grace' | 'blocked' | 'active';

export interface TrialInfo {
  status: TrialStatus;
  trialDaysLeft: number;
  graceDaysLeft: number;
  blocked: boolean;
}

export function getTrialInfo(createdAt: Date, hasPaidSubscription: boolean): TrialInfo {
  if (hasPaidSubscription) {
    return { status: 'active', trialDaysLeft: 0, graceDaysLeft: 0, blocked: false };
  }

  const ageDays = (Date.now() - createdAt.getTime()) / 86_400_000;

  if (ageDays < TRIAL_DAYS) {
    return {
      status: 'trial',
      trialDaysLeft: Math.ceil(TRIAL_DAYS - ageDays),
      graceDaysLeft: 0,
      blocked: false,
    };
  }

  if (ageDays < TRIAL_DAYS + GRACE_DAYS) {
    return {
      status: 'grace',
      trialDaysLeft: 0,
      graceDaysLeft: Math.ceil(TRIAL_DAYS + GRACE_DAYS - ageDays),
      blocked: false,
    };
  }

  return { status: 'blocked', trialDaysLeft: 0, graceDaysLeft: 0, blocked: true };
}

export function paywallCookieValue(info: TrialInfo): string {
  if (info.blocked) return 'blocked';
  if (info.status === 'grace') return 'grace';
  return 'active';
}
