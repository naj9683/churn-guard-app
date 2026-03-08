import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// VIP Threshold - customers with MRR > $500
const VIP_MRR_THRESHOLD = 500;
// RaR Alert Threshold - alert when RaR exceeds $5000
const RAR_ALERT_THRESHOLD = 5000;

export async function POST(req: Request) {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      include: {
        customers: true
      }
    });
    
    for (const user of users) {
      // Skip if no Slack webhook configured (stored directly on User)
      if (!user.slackWebhookUrl) continue;
      
      // Calculate RaR
      let totalMRR = 0;
      let atRiskMRR = 0;
      const highRiskCustomers: any[] = [];
      const vipAtRisk: any[] = [];
      
      user.customers.forEach((customer: any) => {
        const mrr = customer.mrr || 0;
        const riskScore = customer.riskScore || 0;
        totalMRR += mrr;
        
        if (riskScore >= 70) {
          atRiskMRR += mrr * (riskScore / 100);
          highRiskCustomers.push(customer);
          
          // Check if VIP (high MRR + high risk)
          if (mrr >= VIP_MRR_THRESHOLD) {
            vipAtRisk.push(customer);
          }
        }
      });
      
      // Send RaR Threshold Alert
      if (atRiskMRR >= RAR_ALERT_THRESHOLD) {
        await fetch('https://churn-guard-app.vercel.app/api/slack/enhanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'rar_threshold',
            rarAmount: Math.round(atRiskMRR)
          })
        });
      }
      
      // Send VIP Alerts
      for (const vip of vipAtRisk) {
        await fetch('https://churn-guard-app.vercel.app/api/slack/enhanced', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'vip_alert',
            customerId: vip.id,
            riskScore: vip.riskScore
          })
        });
      }
    }
    
    return NextResponse.json({ success: true, message: 'Monitoring complete' });
    
  } catch (error) {
    console.error('Monitor error:', error);
    return NextResponse.json({ error: 'Monitoring failed' }, { status: 500 });
  }
}
