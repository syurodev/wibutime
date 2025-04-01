export interface IUserAuth {
  user: {
    id: number;
    username: string;
    email: string;
    roles: {
      id: number;
      name: string;
    }[];
    permissions: {
      id: number;
      name: string;
      module: string;
      action: string;
    }[];
  };
  access_token: string;
}
