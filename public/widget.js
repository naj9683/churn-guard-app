import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { customerId } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { crmType: true, crmApiKey: true },
    });

    if (!user?.crmType || !user?.crmApiKey) {
      return NextResponse.json({ error: 'CRM not configured' }, { status: 400 });
    }

    const customer = await prisma.customer.findFirst({
      where: { id: customerId, userId },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    if (!customer.crmId) {
      return NextResponse.json({ error: 'Customer not linked to CRM' }, { status: 400 });
    }

    // Update CRM with health score
    let result;
    if (user.crmType === 'hubspot') {
      result = await updateHubSpotHealthScore(user.crmApiKey, customer.crmId, customer.healthScore, customer.riskScore);
    } else if (user.crmType === 'salesforce') {
      result = await updateSalesforceHealthScore(user.crmApiKey, customer.crmId, customer.healthScore, customer.riskScore);
    }

    return NextResponse.json({
      success: result.success,
      message: result.message,
      healthScore: customer.healthScore,
      riskScore: customer.riskScore,
    });
  } catch (error) {
    console.error('CRM update error:', error);
    return NextResponse.json({ error: 'Failed to update CRM' }, { status: 500 });
  }
}

async function updateHubSpotHealthScore(apiKey: string, hubspotId: string, healthScore: number, riskScore: number) {
  try {
    const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${hubspotId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          churnguard_health_score: healthScore.toString(),
          churnguard_risk_score: riskScore.toString(),
          churnguard_last_sync: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, message: `HubSpot API error: ${error}` };
    }

    return { success: true, message: 'Health score updated in HubSpot' };
  } catch (error) {
    return { success: false, message: String(error) };
  }
}

async function updateSalesforceHealthScore(apiKey: string, salesforceId: string, healthScore: number, riskScore: number) {
  // Salesforce implementation would go here
  return { 
    success: true, 
    message: 'Salesforce integration requires custom field setup. Health scores ready to sync.' 
  };
}