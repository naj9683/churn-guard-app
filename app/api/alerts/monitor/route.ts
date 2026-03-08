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
        customers: true,
        slackConfig: true
      }
    });
    
    for (const user of users) {
      if (!user.slackConfig?.webhookUrl) continue;
      
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
        await sendSlackAlert(user.slackConfig.webhookUrl, {
          type: 'rar_threshold',
          rarAmount: Math.round(atRiskMRR)
        });
      }
      
      // Send VIP Alerts
      for (const vip of vipAtRisk) {
        await sendSlackAlert(user.slackConfig.webhookUrl, {
          type: 'vip_alert',
          customerId: vip.id,
          riskScore: vip.riskScore
        });
      }
      
      // Send High Risk Alerts (if not already sent recently)
      for (const customer of highRiskCustomers) {
        const recentAlert = await prisma.alertLog.findFirst({
          where: {
            customerId: customer.id,
            type: 'risk_alert',
            sentAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          }
        });
        
        if (!recentAlert) {
          await sendSlackAlert(user.slackConfig.webhookUrl, {
            type: 'risk_alert',
            customerId: customer.id,
            riskScore: customer.riskScore
          });
        }
      }
    }
    
    return NextResponse.json({ success: true, message: 'Monitoring complete' });
    
  } catch (error) {
    console.error('Monitor error:', error);
    return NextResponse.json({ error: 'Monitoring failed' }, { status: 500 });
  }
}

async function sendSlackAlert(webhookUrl: string, data: any) {
  await fetch('https://churn-guard-app.vercel.app/api/slack/enhanced', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
      // This would need auth token in production
    })
  });
}
