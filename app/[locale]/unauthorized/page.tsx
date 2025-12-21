import { SignInButton } from "@/components/auth/sign-in-button";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted">
      <div className="max-w-md w-full space-y-6 p-10 bg-card rounded-xl shadow-lg text-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            401 - Unauthorized
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your session has expired. Please log in again to continue.
          </p>
        </div>
        <SignInButton />
      </div>
    </main>
  );
}
