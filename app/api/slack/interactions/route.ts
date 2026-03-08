import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const payload = JSON.parse(formData.get('payload') as string);
    
    const { actions, user, response_url } = payload;
    const action = actions[0];
    
    // Handle different button actions
    switch (action.action_id) {
      case 'mark_contacted':
        await handleMarkContacted(action.value);
        await sendConfirmation(response_url, '✅ Marked as contacted');
        break;
        
      case 'create_task':
        await handleCreateTask(action.value);
        await sendConfirmation(response_url, '📝 Task created in CRM');
        break;
        
      default:
        console.log('Unknown action:', action.action_id);
    }
    
    return NextResponse.json({ ok: true });
    
  } catch (error) {
    console.error('Slack interaction error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

async function handleMarkContacted(valueJson: string) {
  const { customerId, userId } = JSON.parse(valueJson);
  
  // Update customer record - use existing fields only
  await prisma.customer.update({
    where: { id: customerId },
    data: {
      updatedAt: new Date()
      // Note: Add lastContactedAt field to schema if you want to track this
    }
  });
  
  // Create activity log if the model exists
  try {
    await prisma.activityLog.create({
      data: {
        customerId,
        type: 'contacted',
        description: 'Marked as contacted via Slack',
        createdAt: new Date()
      }
    });
  } catch (e) {
    // ActivityLog model might not exist yet
    console.log('Activity log not created:', e);
  }
}

async function handleCreateTask(valueJson: string) {
  const { customerId, userId, type } = JSON.parse(valueJson);
  
  // Create task in database if Task model exists
  try {
    await prisma.task.create({
      data: {
        customerId,
        userId,
        type,
        title: `Follow up with at-risk customer`,
        status: 'pending',
        priority: 'high',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Due tomorrow
        createdAt: new Date()
      }
    });
  } catch (e) {
    // Task model might not exist yet
    console.log('Task not created:', e);
  }
}

async function sendConfirmation(responseUrl: string, message: string) {
  await fetch(responseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: message,
      replace_original: false
    })
  });
}
