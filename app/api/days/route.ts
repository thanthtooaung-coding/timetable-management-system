// app/api/days/route.ts
import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(await cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const days = await prisma.days.findMany({
    where: { user_id: user.id },
  })
  return NextResponse.json(days)
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(await cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, display_name } = await req.json()
  const newDay = await prisma.days.create({
    data: {
      user_id: user.id,
      name,
      display_name,
    },
  })
  return NextResponse.json(newDay, { status: 201 })
}
