interface UserSummaryInfo {
  id: number;
  name: string;
  created_at: number;
  username?: string;
  image?: string;
}

interface TopUser extends UserSummaryInfo {
  like: number;
  upload: number;
}

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
  backend_token?: TokenResponse;
  roles?: string[];
  permissions?: string[];
};

type TokenResponse = {
  access_token: string;
  expires_in: string | number;
  refresh_token?: string;
};
