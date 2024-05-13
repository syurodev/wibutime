import { useSession } from "next-auth/react";

export const useClientSession = () => {
  const session = useSession();

  if (session.data?.user && session.data.backend_token) {
    return session.data;
  } else return null;
};
