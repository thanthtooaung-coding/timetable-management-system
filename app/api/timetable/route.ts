import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(await cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timetableEntries = await prisma.timetable_entries.findMany({
    where: { user_id: user.id },
    include: {
      days: true,
      time_slots: true,
      activity_types: true,
    },
  });
  return NextResponse.json(timetableEntries);
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(await cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { day_id, time_slot_id, activity_type_id, subject } = await req.json();

  try {
    const newEntry = await prisma.timetable_entries.upsert({
      where: {
        user_id_day_id_time_slot_id: {
          user_id: user.id,
          day_id,
          time_slot_id,
        },
      },
      update: { activity_type_id, subject },
      create: {
        user_id: user.id,
        day_id,
        time_slot_id,
        activity_type_id,
        subject,
      },
    });
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Failed to upsert timetable entry:", error);
    return NextResponse.json({ error: 'Failed to create or update timetable entry' }, { status: 500 });
  }
}
