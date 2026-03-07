import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateRiskScore } from '@/lib/risk-calculator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, event, metadata, timestamp, apiKey } = body;
    
    // Validate API key (find user by API key)
    const user = await prisma.user.findFirst({
      where: { apiKey: apiKey }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }
    
    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: { 
        userId: user.id,
        externalId: customerId 
      },
      include: { events: true }
    });
    
    if (!customer) {
      // Create new customer
      customer = await prisma.customer.create({
        data: {
          userId: user.id,
          externalId: customerId,
          email: metadata?.email || `${customerId}@customer.com`,
          name: metadata?.name || customerId,
          mrr: metadata?.mrr || 0,
          riskScore: 50, // Default middle score
          createdAt: new Date()
        },
        include: { events: true }
      });
    }
    
    // Store the event
    await prisma.event.create({
      data: {
        customerId: customer.id,
        event: event,
        metadata: metadata || {},
        timestamp: timestamp || Date.now()
      }
    });
    
    // Recalculate risk score
    const updatedEvents = [...customer.events, { event, timestamp: timestamp || Date.now() }];
    const newRiskScore = calculateRiskScore(updatedEvents, customer.riskScore);
    
    // Update customer risk score
    await prisma.customer.update({
      where: { id: customer.id },
      data: { riskScore: newRiskScore }
    });
    
    // Check if we should trigger Slack alert (risk >= 70)
    if (newRiskScore >= 70 && customer.riskScore < 70) {
      // Trigger Slack alert
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/slack/alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: customer.name || customer.email,
          riskScore: newRiskScore,
          mrr: customer.mrr,
          reason: event
        })
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      riskScore: newRiskScore,
      customerId: customer.id
    });
    
  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
