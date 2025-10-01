import * as React from 'react';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';
import { Loader2, AlertCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ImageNodeProps extends PlateElementProps {
  element: {
    id: string;
    type: 'image';
    url: string;
    alt?: string;
    status?: 'pending' | 'uploaded' | 'error';
    pendingId?: string;
    children: Array<{ text: string }>;
  };
}

export function ImageElement({ className, children, element, ...props }: ImageNodeProps) {
  const { url, alt, status = 'uploaded', pendingId } = element;
  const [imageError, setImageError] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);

  const isPending = status === 'pending';
  const isError = status === 'error' || imageError;

  // Debug log
  React.useEffect(() => {
    console.log('ImageElement:', { url, status, pendingId, isPending });
  }, [url, status, pendingId, isPending]);

  return (
    <PlateElement className={cn('py-2', className)} element={element} {...props}>
      <div className="group relative inline-block max-w-full">
        <div
          className={cn(
            'relative overflow-hidden rounded-lg border bg-muted',
            isError && 'border-destructive bg-destructive/10'
          )}
        >
          {/* Image */}
          <img
            src={url}
            alt={alt || 'Uploaded image'}
            className={cn(
              'max-w-full h-auto',
              imageLoading && 'opacity-0'
            )}
            onLoad={() => {
              setImageLoading(false);
              setImageError(false);
            }}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />

          {/* Loading overlay - only show when actually loading image */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Đang tải...</span>
              </div>
            </div>
          )}

          {/* Error overlay */}
          {isError && !imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-destructive/10">
              <div className="flex flex-col items-center gap-2 text-destructive">
                <AlertCircle className="h-6 w-6" />
                <span className="text-sm">Lỗi tải ảnh</span>
              </div>
            </div>
          )}

          {/* Status indicator */}
          {isPending && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-yellow-500 text-white border-yellow-600">
                Chờ upload
              </Badge>
            </div>
          )}

          {/* Remove button (visible on hover) */}
          <button
            type="button"
            className="absolute top-2 right-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
            onClick={() => {
              // TODO: Implement remove functionality
              console.log('Remove image:', element.id);
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Caption input */}
        <div className="mt-2">
          <input
            type="text"
            placeholder="Thêm chú thích..."
            defaultValue={alt}
            className="w-full rounded border-0 bg-transparent px-2 py-1 text-sm text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
            onChange={(e) => {
              // TODO: Update alt text
              console.log('Update alt:', e.target.value);
            }}
          />
        </div>
      </div>
      {children}
    </PlateElement>
  );
}