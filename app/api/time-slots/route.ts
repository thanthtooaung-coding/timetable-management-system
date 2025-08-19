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

  const timeSlots = await prisma.time_slots.findMany({
    where: { user_id: user.id },
    orderBy: { period: "asc" },
  });
  return NextResponse.json(timeSlots);
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

  const { period, display_name } = await req.json();
  const newTimeSlot = await prisma.time_slots.create({
    data: {
      user_id: user.id,
      period: Number(period),
      display_name,
    },
  });
  return NextResponse.json(newTimeSlot, { status: 201 });
}
