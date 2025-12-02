"use client";

/**
 * Homepage Error Boundary
 */

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function HomeError({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Container maxWidth="md">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-amber-500/10 p-4">
              <AlertTriangle className="size-12 text-amber-500" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">Unable to load homepage</h1>

          <p className="text-muted-foreground mb-6">
            Something went wrong while loading the content. Please try again.
          </p>

          {error.digest && (
            <p className="text-xs text-muted-foreground mb-6 font-mono">
              Error ID: {error.digest}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="size-4" />
              Try Again
            </Button>

            <Button variant="outline" className="gap-2" asChild>
              <a href="/">
                <Home className="size-4" />
                Reload Page
              </a>
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
}
