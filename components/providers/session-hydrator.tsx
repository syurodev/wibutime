import { getSession } from "@/lib/auth/session";
import { SessionSync } from "./session-sync";

export async function SessionHydrator() {
  const session = await getSession();
  console.log(
    "[SessionHydrator] Server Session:",
    session ? "Found" : "Null",
    "Token:",
    session?.accessToken ? "Present" : "Missing"
  );
  return <SessionSync accessToken={session?.accessToken ?? null} />;
}
