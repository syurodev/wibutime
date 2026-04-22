const V1 = "/api/v1"

export const endpoints = {
  sessions: {
    anonymous: `${V1}/sessions/anonymous`,
  },
  auth: {
    login: `${V1}/auth/login`,
    logout: `${V1}/auth/logout`,
    register: `${V1}/auth/register`,
    verifyOtp: `${V1}/auth/verify-otp`,
    me: `${V1}/auth/me`,
    magicLinkSend: `${V1}/auth/magic-link/send`,
    magicLinkVerify: `${V1}/auth/magic-link/verify`,
  },
} as const
