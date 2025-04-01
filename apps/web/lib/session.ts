'use server';
import { Session } from '@workspace/types';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const JWT_SECRET = process.env.CONFIG_JWT_SECRET;
const ENCODE_JWT_SECRET = new TextEncoder().encode(JWT_SECRET);

export async function createSession(payload: Session) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const jwtPayload = {
    ...payload,
    [Symbol.for('convertToJWTPayload')]: true,
  } as Session & { [key: string]: unknown };

  const session = await new SignJWT(jwtPayload)
    .setProtectedHeader({
      alg: 'HS256',
    })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(ENCODE_JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
    sameSite: 'lax',
  });
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;

    const { payload } = await jwtVerify(session, ENCODE_JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return payload as unknown as Session;
  } catch (error) {
    console.error('Error getting session', error);
    redirect('/auth/login');
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
