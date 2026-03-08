import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { 
      type,
      customerId,
      riskScore,
      rarAmount,
      message 
    } = body;

    // Get user's Slack webhook from settings
    const userData = await prisma.user.findUnique({
      where: { clerkId: user.id },
      include: { settings: true }
    });

    // Check if Slack is configured
    const slackWebhookUrl = userData?.settings?.slackWebhookUrl;
    if (!slackWebhookUrl) {
      return NextResponse.json({ error: 'Slack not configured' }, { status: 400 });
    }

    // Get customer details if provided
    let customer = null;
    if (customerId) {
      customer = await prisma.customer.findUnique({
        where: { id: customerId }
      });
    }

    // Build enhanced Slack message
    const slackMessage = buildSlackMessage({
      type,
      customer,
      riskScore,
      rarAmount,
      message,
      userId: user.id
    });

    // Send to Slack
    const response = await fetch(slackWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage)
    });

    if (!response.ok) {
      throw new Error('Failed to send Slack message');
    }

    return NextResponse.json({ success: true, message: 'Alert sent' });

  } catch (error) {
    console.error('Slack alert error:', error);
    return NextResponse.json({ error: 'Failed to send alert' }, { status: 500 });
  }
}

// Build different Slack message types
function buildSlackMessage({ type, customer, riskScore, rarAmount, message, userId }: any) {
  const blocks: any[] = [];
  
  switch (type) {
    case 'risk_alert':
      blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚨 High Risk Customer Alert',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Customer:*\n${customer?.externalId || 'Unknown'}`
            },
            {
              type: 'mrkdwn',
              text: `*Risk Score:*\n🔥 ${riskScore}/100`
            },
            {
              type: 'mrkdwn',
              text: `*MRR:*\n$${customer?.mrr || 0}`
            },
            {
              type: 'mrkdwn',
              text: `*Revenue at Risk:*\n$${Math.round((customer?.mrr || 0) * (riskScore / 100))}`
            }
          ]
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '👁️ View Account',
                emoji: true
              },
              url: `https://churn-guard-app.vercel.app/customers?id=${customer?.id}`,
              action_id: 'view_account'
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '✅ Mark Contacted',
                emoji: true
              },
              style: 'primary',
              action_id: 'mark_contacted',
              value: JSON.stringify({ customerId: customer?.id, userId })
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📝 Create Task',
                emoji: true
              },
              action_id: 'create_task',
              value: JSON.stringify({ customerId: customer?.id, userId, type: 'retention' })
            }
          ]
        }
      );
      break;

    case 'rar_threshold':
      blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '💰 Revenue at Risk Alert',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*⚠️ Alert:* Your Revenue at Risk has exceeded the threshold!\n\n*Current RaR:* $${rarAmount?.toLocaleString() || '0'}/month`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Immediate action recommended to prevent churn.'
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📊 View Analytics',
                emoji: true
              },
              url: 'https://churn-guard-app.vercel.app/analytics',
              style: 'danger'
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '⚡ Run Playbooks',
                emoji: true
              },
              url: 'https://churn-guard-app.vercel.app/playbooks'
            }
          ]
        }
      );
      break;

    case 'vip_alert':
      blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '⭐ VIP Customer at Risk',
            emoji: true
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*🚨 URGENT:* A high-value customer is showing churn risk!\n\n*Customer:* ${customer?.externalId}\n*MRR:* $${customer?.mrr || 0}\n*Risk Score:* ${riskScore}/100\n*Revenue at Risk:* $${Math.round((customer?.mrr || 0) * (riskScore / 100))}`
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*💡 Recommended Actions:*\n• Personal outreach from founder\n• Offer retention discount\n• Schedule check-in call'
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '👁️ View Account',
                emoji: true
              },
              url: `https://churn-guard-app.vercel.app/customers?id=${customer?.id}`,
              style: 'danger'
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📧 Send Email',
                emoji: true
              },
              url: `https://churn-guard-app.vercel.app/email-campaigns`
            }
          ]
        }
      );
      break;

    case 'digest':
      blocks.push(
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📊 ChurnGuard 30-Day Summary',
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*New High-Risk Customers:*\n${message?.newHighRisk || 0}`
            },
            {
              type: 'mrkdwn',
              text: `*Churn Prevented:*\n$${message?.churnPrevented || 0}`
            },
            {
              type: 'mrkdwn',
              text: `*Playbooks Executed:*\n${message?.playbooksRun || 0}`
            },
            {
              type: 'mrkdwn',
              text: `*Avg Risk Score:*\n${message?.avgRisk || 0}`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*💰 Current Revenue at Risk:* $${message?.currentRaR || 0}/month`
          }
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '📈 Full Report',
                emoji: true
              },
              url: 'https://churn-guard-app.vercel.app/analytics'
            }
          ]
        }
      );
      break;
  }

  return {
    text: 'ChurnGuard Alert',
    blocks
  };
}
