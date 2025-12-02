/**
 * Error Boundary Component
 *
 * Catch React errors và hiển thị fallback UI thay vì crash toàn bộ app
 * Sử dụng shadcn/ui components
 */

"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/utils/error-handler";
import { AlertCircle } from "lucide-react";
import { Component, type ReactNode } from "react";

export interface ErrorBoundaryProps {
  /**
   * Children components
   */
  readonly children: ReactNode;

  /**
   * Fallback UI khi có error
   */
  readonly fallback?:
    | ReactNode
    | ((error: Error, reset: () => void) => ReactNode);

  /**
   * Callback khi có error
   */
  readonly onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);

    // Call onError callback nếu có
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Nếu có custom fallback
      if (this.props.fallback) {
        if (typeof this.props.fallback === "function") {
          return this.props.fallback(this.state.error, this.reset);
        }
        return this.props.fallback;
      }

      // Default fallback UI với shadcn/ui
      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Đã có lỗi xảy ra</AlertTitle>
              <AlertDescription>
                <p className="mb-3 text-sm">
                  {this.state.error instanceof ApiError
                    ? this.state.error.message
                    : "Có lỗi không mong muốn xảy ra. Vui lòng thử lại."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={this.reset}
                  className="mt-2"
                >
                  Thử lại
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
