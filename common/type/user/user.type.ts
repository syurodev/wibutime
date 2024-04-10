type UserResponse = {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  provider: string;
  coins: number;
  username?: string;
  password?: string;
  tokens?: TokenResponse;
  roles?: string[];
  permissions?: string[];
};

type TokenResponse = {
  accessToken: string;
  refreshToken?: string;
};
