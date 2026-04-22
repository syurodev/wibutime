import { NextResponse } from "next/server"
import { getDeviceToken } from "@/features/auth/lib/session"

export async function GET() {
  const token = await getDeviceToken()
  return NextResponse.json({ hasDeviceSession: !!token })
}
