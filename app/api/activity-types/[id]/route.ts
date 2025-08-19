// In timetable-management-system/app/api/activity-types/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const cookieStore = cookies();
    const supabase = createClient(await cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, color, needs_subject } = await req.json();
    try {
        const updatedActivityType = await prisma.activity_types.update({
            where: { id: params.id, user_id: user.id },
            data: { name, color, needs_subject },
        });
        return NextResponse.json(updatedActivityType);
    } catch (error) {
        console.error("Failed to update activity type:", error);
        return NextResponse.json({ error: 'Failed to update activity type' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const cookieStore = cookies();
    const supabase = createClient(await cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.activity_types.delete({
            where: { id: params.id, user_id: user.id },
        });
        return NextResponse.json({ message: 'Activity type deleted' }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete activity type:", error);
        return NextResponse.json({ error: 'Failed to delete activity type' }, { status: 500 });
    }
}
