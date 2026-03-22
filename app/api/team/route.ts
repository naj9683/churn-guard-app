import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/resend';

// GET - List team members
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const teamMembers = await prisma.teamMember.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ teamMembers });

  } catch (error) {
    console.error('List team error:', error);
    return NextResponse.json({ error: 'Failed to list team members' }, { status: 500 });
  }
}

// POST - Invite team member
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true, email: true, company: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const { email, name, role = 'viewer' } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Validate role
    const validRoles = ['admin', 'manager', 'viewer'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if already invited
    const existing = await prisma.teamMember.findFirst({
      where: { userId: user.id, email }
    });

    if (existing) {
      return NextResponse.json({ error: 'Team member already invited' }, { status: 400 });
    }

    // Create team member
    const teamMember = await prisma.teamMember.create({
      data: {
        userId: user.id,
        email,
        name: name || '',
        role,
        status: 'pending'
      }
    });

    // Send invitation email via Resend
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://churnguardapp.com';
    const inviteUrl = `${appUrl}/signup`;
    const companyName = user.company ?? 'ChurnGuard';
    const inviterEmail = user.email;

    await sendEmail(
      email,
      `You've been invited to join ${companyName} on ChurnGuard`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
        <h2 style="color:#6366f1;margin:0 0 16px">You're invited to ChurnGuard</h2>
        <p>Hi${name ? ` ${name}` : ''},</p>
        <p><strong>${inviterEmail}</strong> has invited you to join <strong>${companyName}</strong> on ChurnGuard as a <strong>${role}</strong>.</p>
        <p>ChurnGuard helps SaaS teams monitor customer health, prevent churn, and automate retention — all in one place.</p>
        <p style="text-align:center;margin:32px 0">
          <a href="${inviteUrl}" style="background:#6366f1;color:#fff;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;display:inline-block">
            Accept Invitation
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px">Sign up with this email address (${email}) to automatically join the team.</p>
        <p style="color:#6b7280;font-size:13px">If you weren't expecting this invitation, you can ignore this email.</p>
        <p>Best,<br>The ChurnGuard Team</p>
      </div>`
    );
    console.log(`📧 Invitation email sent to ${email} (role: ${role})`);

    return NextResponse.json({ 
      success: true, 
      teamMember,
      message: `Invitation sent to ${email}`
    });

  } catch (error) {
    console.error('Invite team error:', error);
    return NextResponse.json({ error: 'Failed to invite team member' }, { status: 500 });
  }
}

// DELETE - Remove team member
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('id');

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    await prisma.teamMember.deleteMany({
      where: { id: memberId, userId: user.id }
    });

    return NextResponse.json({ success: true, message: 'Team member removed' });

  } catch (error) {
    console.error('Remove team error:', error);
    return NextResponse.json({ error: 'Failed to remove team member' }, { status: 500 });
  }
}

// PATCH - Update team member role/status
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const { memberId, role, status } = body;

    if (!memberId) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    const updateData: any = {};
    if (role) updateData.role = role;
    if (status) updateData.status = status;

    const teamMember = await prisma.teamMember.updateMany({
      where: { id: memberId, userId: user.id },
      data: updateData
    });

    return NextResponse.json({ success: true, teamMember });

  } catch (error) {
    console.error('Update team error:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}
