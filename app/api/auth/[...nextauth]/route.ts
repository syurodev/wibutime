import {handlers} from "@/lib/auth/auth";
import {NextRequest} from "next/server";

async function GET(request: NextRequest) {
  // Extract URL parts for debugging
  const url = new URL(request.url);

  try {
    return await handlers.GET(request);
  } catch (error) {
    throw error;
  }
}

async function POST(request: NextRequest) {
  return await handlers.POST(request);
}

export {GET, POST};
