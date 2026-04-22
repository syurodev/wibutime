const V1 = "/api/v1"

export const endpoints = {
  sessions: {
    anonymous: `${V1}/sessions/anonymous`,
  },
  auth: {
    login: `${V1}/auth/login`,
    logout: `${V1}/auth/logout`,
    refresh: `${V1}/auth/refresh`,
    register: `${V1}/auth/register`,
    verifyOtp: `${V1}/auth/verify-otp`,
    me: `${V1}/auth/me`,
    magicLinkSend: `${V1}/auth/magic-link/send`,
    magicLinkVerify: `${V1}/auth/magic-link/verify`,
    passkey: {
      registerBegin: `${V1}/auth/passkey/register/begin`,
      registerComplete: `${V1}/auth/passkey/register/complete`,
      authenticateBegin: `${V1}/auth/passkey/authenticate/begin`,
      authenticateComplete: `${V1}/auth/passkey/authenticate/complete`,
      credentials: `${V1}/auth/passkey/credentials`,
      credentialById: (id: string) => `${V1}/auth/passkey/credentials/${id}`,
    },
  },
} as const
