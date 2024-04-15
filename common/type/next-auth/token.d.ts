interface AccessToken {
  accessToken: string;
  expires_in: string;
}

interface RefreshTokenResponse {
  error: ErrorResponse | undefined;
  success: AccessToken | undefined;
}
