// app/api/activity-types/route.ts
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

  const activityTypes = await prisma.activity_types.findMany({
    where: { user_id: user.id },
  });
  return NextResponse.json(activityTypes);
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

  const { name, color, needs_subject } = await req.json();
  const newActivityType = await prisma.activity_types.create({
    data: {
      user_id: user.id,
      name,
      color,
      needs_subject,
    },
  });
  return NextResponse.json(newActivityType, { status: 201 });
}
