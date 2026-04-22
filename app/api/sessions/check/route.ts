import { NextResponse } from "next/server"
import { getSession } from "@/features/auth/lib/session"

export async function GET() {
  const token = await getSession()
  return NextResponse.json({ hasSession: !!token })
}
