'use client';

import { cn } from '@workspace/ui/lib/utils';

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('border-t py-6 px-4', className)}>
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by{' '}
          <a
            href="https://github.com/syurodev"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            syurodev
          </a>
          . The source code is available on{' '}
          <a
            href="https://github.com/syurodev/wibutime"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
