"use client";

/**
 * Admin Pages Error Boundary
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="max-w-2xl mx-auto p-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-destructive/10 p-4">
            <AlertCircle className="size-16 text-destructive" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3">Admin Panel Error</h1>

        <p className="text-muted-foreground mb-6">
          Unable to load admin panel. Please try refreshing the page.
        </p>

        {error.digest && (
          <p className="text-xs text-muted-foreground mb-8 font-mono">
            Error ID: {error.digest}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} size="lg" className="gap-2">
            <RefreshCw className="size-4" />
            Try Again
          </Button>

          <Button variant="outline" size="lg" className="gap-2" asChild>
            <a href="/">
              <Home className="size-4" />
              Back to Home
            </a>
          </Button>
        </div>
      </Card>
    </div>
  );
}
