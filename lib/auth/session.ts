import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import "server-only";

const secretKey = process.env.SESSION_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

export type SessionData = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
    roles?: string[];
    permissions?: string[];
  };
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
};

/**
 * Encrypt session data into JWT
 */
export async function encrypt(payload: SessionData): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

/**
 * Decrypt JWT back to session data
 */
export async function decrypt(
  session: string | undefined
): Promise<SessionData | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionData;
  } catch (error) {
    console.error("Failed to verify session:", error);
    return null;
  }
}

/**
 * Create a new session cookie
 */
export async function createSession(sessionData: SessionData): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt(sessionData);
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Update existing session (for token refresh)
 */
export async function updateSession(sessionData: SessionData): Promise<void> {
  const session = await encrypt(sessionData);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Delete session cookie
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

/**
 * Get current session
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  return await decrypt(session);
}

/**
 * Verify session exists, redirect if not
 */
export async function verifySession(): Promise<SessionData> {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}
