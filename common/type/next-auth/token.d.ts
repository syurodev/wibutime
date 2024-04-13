interface AccessToken {
  accessToken: string;
  expires_in: number;
}

interface RefreshTokenResponse {
  error: ErrorResponse | undefined;
  success: AccessToken | undefined;
}
