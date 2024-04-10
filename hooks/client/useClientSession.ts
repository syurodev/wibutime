import { useSession } from "next-auth/react";

export const useClientSession = () => {
  const session = useSession();

  if (session.data?.user) {
    return session.data?.user;
  } else return null;
};
