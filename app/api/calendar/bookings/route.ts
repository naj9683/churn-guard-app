import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// POST - Create new booking
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, email: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const { customerId, meetingType, scheduledAt, notes } = body;

    if (!customerId || !meetingType || !scheduledAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify customer belongs to user
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, userId: user.id }
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Create booking
    const booking = await prisma.$queryRaw`
      INSERT INTO "Booking" ("id", "userId", "customerId", "meetingType", "scheduledAt", "status", "notes", "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${user.id}, ${customerId}, ${meetingType}, ${new Date(scheduledAt)}, 'scheduled', ${notes || ''}, NOW(), NOW())
      RETURNING *
    `.catch(async () => {
      // If Booking table doesn't exist, create it via migration or use ActivityLog
      console.log('Booking table may not exist, logging to ActivityLog');
      
      await prisma.activityLog.create({
        data: {
          customerId,
          type: 'meeting_scheduled',
          description: `${meetingType} scheduled for ${scheduledAt}`,
          createdAt: new Date()
        }
      });
      
      return { 
        id: 'temp-' + Date.now(),
        userId: user.id,
        customerId,
        meetingType,
        scheduledAt: new Date(scheduledAt),
        status: 'scheduled'
      };
    });

    // Send notification (optional)
    console.log(`📅 Meeting scheduled: ${meetingType} with ${customer.email} at ${scheduledAt}`);

    return NextResponse.json({
      success: true,
      booking,
      message: 'Meeting scheduled successfully',
      calendlyLink: generateCalendlyLink(meetingType, user.email, customer.email)
    });

  } catch (error: any) {
    console.error('Calendar booking error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET - List bookings
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');
    const upcoming = searchParams.get('upcoming') === 'true';

    // Get bookings from ActivityLog (since Booking table may not exist yet)
    let whereClause: any = {
      type: 'meeting_scheduled'
    };

    if (customerId) {
      whereClause.customerId = customerId;
    }

    const activities = await prisma.activityLog.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Parse meetings from activity log
    const bookings = activities.map((activity: any) => ({
      id: activity.id,
      customerId: activity.customerId,
      meetingType: activity.description?.split(' ')[0] || 'meeting',
      scheduledAt: activity.createdAt,
      status: 'scheduled',
      description: activity.description
    }));

    // Filter upcoming if requested
    const filteredBookings = upcoming 
      ? bookings.filter((b: any) => new Date(b.scheduledAt) > new Date())
      : bookings;

    return NextResponse.json({
      bookings: filteredBookings,
      count: filteredBookings.length
    });

  } catch (error: any) {
    console.error('Calendar list error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper to generate Calendly link
function generateCalendlyLink(meetingType: string, userEmail: string, customerEmail: string): string {
  const baseUrl = 'https://calendly.com/your-link';
  const duration = meetingType === 'ceo_call' ? '30min' : '15min';
  
  // You would replace 'your-link' with your actual Calendly username
  // Format: https://calendly.com/username/meeting-type?email=customer@example.com
  return `${baseUrl}/${meetingType}?duration=${duration}&email=${encodeURIComponent(customerEmail)}`;
}
