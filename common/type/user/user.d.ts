type UserResponse = {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  image: string;
  provider: string;
  coins: number;
  username?: string;
  password?: string;
  backendToken?: TokenResponse;
  roles?: string[];
  permissions?: string[];
};

type TokenResponse = {
  accessToken: string;
  expires_in: number;
  refreshToken?: string;
};
