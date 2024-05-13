interface AccessToken {
  access_token: string;
  expires_in: string;
}

interface RefreshTokenResponse {
  error: ErrorResponse | undefined;
  success: AccessToken | undefined;
}
