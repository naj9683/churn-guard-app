import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/tracking - Customers send user activity to ChurnGuard
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      apiKey,           // Customer's API key (you'll generate this)
      userId,           // End user's ID in customer's app
      userEmail,        // End user's email
      userName,         // End user's name
      event,            // Event type: login, logout, feature_used, payment_failed, etc.
      metadata = {}     // Additional data
    } = body;

    // TODO: Verify API key belongs to a valid user
    // For now, find user by API key (you should store this in database)
    const user = await prisma.user.findFirst({
      where: { id: apiKey }, // Simplified - use proper API key validation
      include: { customers: true }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: { 
        userId: user.id,
        email: userEmail 
      }
    });

    if (!customer) {
      // Create new customer
      customer = await prisma.customer.create({
        data: {
          userId: user.id,
          email: userEmail,
          name: userName || userEmail.split('@')[0],
        
          riskScore: 0,
          mrr: 0,
          
          
        }
      });
    } else {
      // Update existing customer based on event
      const updateData: any = {};
      
      if (event === 'login') {
        updateData.lastLoginAt = new Date();
        updateData.status = 'active';
        // Reduce risk score on login
        updateData.riskScore = Math.max(0, customer.riskScore - 10);
      }
      
      if (event === 'logout') {
        // Could track session duration
      }
      
      if (event === 'payment_failed') {
        updateData.status = 'payment_failed';
        updateData.riskScore = Math.min(100, customer.riskScore + 30);
      }
      
      if (event === 'core_action') {
        // User did something important (onboarding complete, key feature used)
        updateData.riskScore = Math.max(0, customer.riskScore - 20);
      }
      
      if (event === 'churn_signal') {
        // User showed intent to cancel
        updateData.riskScore = Math.min(100, customer.riskScore + 40);
      }

      if (Object.keys(updateData).length > 0) {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: updateData
        });
      }
    }

    // Log the activity
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        type: event,
        metadata: {
          customerId: customer.id,
          customerEmail: customer.email,
          ...metadata
        }
      }
    });

    // Auto-trigger playbooks based on risk
    // If risk score > 70, could trigger immediate email
    if (customer.riskScore > 70 && event === 'churn_signal') {
      // Could trigger immediate playbook here
      console.log(`High risk customer detected: ${customer.email}`);
    }

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        riskScore: customer.riskScore,
        status: customer.status
      },
      message: "Activity tracked successfully"
    });

  } catch (error) {
    console.error('Tracking error:', error);
    return NextResponse.json({ 
      error: "Failed to track activity",
      details: String(error)
    }, { status: 500 });
  }
}

// GET /api/tracking - Documentation
export async function GET() {
  return NextResponse.json({
    message: "ChurnGuard Activity Tracking API",
    usage: {
      endpoint: "POST /api/tracking",
      headers: { "Content-Type": "application/json" },
      body: {
        apiKey: "your_churnguard_api_key",
        userId: "user_id_in_your_app",
        userEmail: "user@example.com",
        userName: "User Name",
        event: "login | logout | payment_failed | core_action | churn_signal",
        metadata: { optional: "additional_data" }
      }
    },
    events: {
      login: "User logged in - reduces risk score",
      logout: "User logged out",
      payment_failed: "Payment failed - increases risk score",
      core_action: "User completed key action - reduces risk score",
      churn_signal: "User showed churn intent - high risk increase"
    }
  });
}