// In timetable-management-system/app/api/time-slots/[id]/route.ts
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

    const { period, display_name } = await req.json();
    try {
        const updatedTimeSlot = await prisma.time_slots.update({
            where: { id: params.id, user_id: user.id },
            data: { period: Number(period), display_name },
        });
        return NextResponse.json(updatedTimeSlot);
    } catch (error) {
        console.error("Failed to update time slot:", error);
        return NextResponse.json({ error: 'Failed to update time slot' }, { status: 500 });
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
        await prisma.time_slots.delete({
            where: { id: params.id, user_id: user.id },
        });
        return NextResponse.json({ message: 'Time slot deleted' }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete time slot:", error);
        return NextResponse.json({ error: 'Failed to delete time slot' }, { status: 500 });
    }
}
