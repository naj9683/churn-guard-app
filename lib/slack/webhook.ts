// Slack webhook integration for playbook alerts
export async function sendSlackAlert(channel: string, message: string, details?: any) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log('SLACK ALERT WOULD BE SENT:');
    console.log('Channel:', channel);
    console.log('Message:', message);
    console.log('Details:', details);
    return { success: true };
  }

  try {
    const payload = {
      channel: channel || '#retention',
      username: 'ChurnGuard Bot',
      icon_emoji: ':warning:',
      text: message,
      attachments: details ? [{
        color: details.riskScore > 70 ? 'danger' : 'warning',
        fields: [
          {
            title: 'Customer',
            value: details.customerEmail || 'Unknown',
            short: true
          },
          {
            title: 'Risk Score',
            value: details.riskScore || 'N/A',
            short: true
          },
          {
            title: 'MRR',
            value: `$${details.mrr || 0}`,
            short: true
          }
        ]
      }] : undefined
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Slack alert failed:', error);
    return { success: false, error };
  }
}

export const slackAlerts = {
  silentQuitter: (customer: any, days: number) => ({
    channel: '#retention',
    message: `Silent Quitter Alert - User hasn't logged in for ${days} days!`,
    details: {
      customerEmail: customer.email,
      customerName: customer.name,
      riskScore: customer.riskScore,
      mrr: customer.mrr
    }
  }),
  
  onboardingRescue: (customer: any) => ({
    channel: '#onboarding',
    message: `Onboarding Rescue - Day 3 user needs help!`,
    details: {
      customerEmail: customer.email,
      customerName: customer.name,
      riskScore: customer.riskScore,
      mrr: customer.mrr
    }
  })
};