import { auth } from "@/auth";

export const useServerSession = async () => {
  const session = await auth();

  return session;
};
