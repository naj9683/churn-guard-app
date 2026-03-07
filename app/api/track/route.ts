import { prisma } from "@/lib/prisma";
import { checkAndRunPlaybooks } from "@/lib/auto-playbook";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, customerId, event, metadata, timestamp } = body;

    console.log("Track request:", { apiKey, customerId, event });

    if (!apiKey || !customerId || !event) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { apiKey: apiKey }
    });

    console.log("User found:", user ? "Yes - " + user.id : "No");

    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    let customer = await prisma.customer.findFirst({
      where: { userId: user.id, externalId: customerId }
    });

    const oldRiskScore = customer?.riskScore || 50;

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          userId: user.id,
          externalId: customerId,
          email: metadata?.email || `${customerId}@unknown.com`,
          name: metadata?.name || customerId,
          mrr: metadata?.mrr || 0,
          riskScore: 50
        }
      });
    }

    await prisma.event.create({
      data: {
        customerId: customer.id,
        event: event,
        metadata: metadata || {},
        timestamp: timestamp || Date.now()
      }
    });

    let riskChange = 0;
    if (event === 'payment_failed') riskChange = 20;
    else if (event === 'no_login_7_days') riskChange = 15;
    else if (event === 'downgrade_attempt') riskChange = 30;
    else if (event === 'login') riskChange = -5;
    else if (event === 'payment_success') riskChange = -10;

    const newRiskScore = Math.max(0, Math.min(100, oldRiskScore + riskChange));

    const updatedCustomer = await prisma.customer.update({
      where: { id: customer.id },
      data: { 
        riskScore: newRiskScore, 
        updatedAt: new Date(),
        mrr: metadata?.mrr || customer.mrr
      }
    });

    console.log(`Risk updated: ${oldRiskScore} -> ${newRiskScore}`);

    let playbookTriggered = false;

    if (newRiskScore >= 70 && oldRiskScore < 70) {
      console.log("Threshold crossed! Triggering playbooks...");
      playbookTriggered = true;
      
      try {
        await checkAndRunPlaybooks(user.id, updatedCustomer);
      } catch (err) {
        console.error("Playbook execution error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      customerId: customerId,
      riskScore: newRiskScore,
      oldRiskScore: oldRiskScore,
      playbookTriggered: playbookTriggered
    });

  } catch (error) {
    console.error("Track error:", error);
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
