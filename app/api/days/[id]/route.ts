// In timetable-management-system/app/api/days/[id]/route.ts
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

    const { name, display_name } = await req.json();
    try {
        const updatedDay = await prisma.days.update({
            where: { id: params.id, user_id: user.id },
            data: { name, display_name },
        });
        return NextResponse.json(updatedDay);
    } catch (error) {
        console.error("Failed to update day:", error);
        return NextResponse.json({ error: 'Failed to update day' }, { status: 500 });
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
        await prisma.days.delete({
            where: { id: params.id, user_id: user.id },
        });
        return NextResponse.json({ message: 'Day deleted' }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete day:", error);
        return NextResponse.json({ error: 'Failed to delete day' }, { status: 500 });
    }
}
