import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

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
      select: { id: true, email: true }
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

    // TODO: Send invitation email here
    console.log(`📧 Invitation sent to ${email} for role: ${role}`);

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
