import { prisma } from "./prisma";

export async function checkAndRunPlaybooks(userId: string, customer: any) {
  try {
    // Only run if risk is high
    if (customer.riskScore < 70) return;

    console.log("High risk detected, checking playbooks for user:", userId);

    // Find active playbooks for this user with "high_risk" trigger
    const playbooks = await prisma.playbook.findMany({
      where: {
        userId: userId,
        isActive: true,
        trigger: "high_risk"
      }
    });

    console.log(`Found ${playbooks.length} playbooks to run`);

    for (const playbook of playbooks) {
      try {
        // Run the playbook actions
        const actions = playbook.actions as any;
        
        if (actions?.type === "slack_alert") {
          await sendSlackAlert(userId, customer, actions.webhookUrl);
        }
        
        if (actions?.type === "email") {
          console.log("Would send email to:", customer.email);
          // Email logic here
        }

        if (actions?.type === "webhook") {
          console.log("Would call webhook:", actions.url);
          // Webhook logic here
        }

        // Update last run time
        await prisma.playbook.update({
          where: { id: playbook.id },
          data: { lastRun: new Date() }
        });

        console.log(`Playbook "${playbook.name}" executed`);
      } catch (error) {
        console.error(`Failed to run playbook ${playbook.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Auto-playbook error:", error);
  }
}

async function sendSlackAlert(userId: string, customer: any, webhookUrl?: string) {
  try {
    // Get user's slack webhook from database if not provided in action
    if (!webhookUrl) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { slackWebhookUrl: true }
      });
      webhookUrl = user?.slackWebhookUrl || undefined;
    }

    if (!webhookUrl) {
      console.log("No Slack webhook configured");
      return;
    }

    const message = {
      text: `🚨 High Risk Customer Alert`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*High Risk Customer Detected!*\n\n• Customer: ${customer.name || customer.email}\n• Risk Score: ${customer.riskScore}/100\n• Email: ${customer.email}\n• MRR: $${customer.mrr || 0}`
          }
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "View in Dashboard"
              },
              url: `https://churn-guard-app.vercel.app/customers`,
              style: "danger"
            }
          ]
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    if (response.ok) {
      console.log("Slack alert sent successfully");
      
      // Log the alert
      await prisma.slackAlert.create({
        data: {
          userId: userId,
          customerId: customer.id,
          alertType: "high_risk",
          messageSent: true,
          message: JSON.stringify(message),
          riskScore: customer.riskScore,
          sentAt: new Date()
        }
      });
    } else {
      console.error("Failed to send Slack alert:", await response.text());
    }
  } catch (error) {
    console.error("Slack alert error:", error);
  }
}
