"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface TranslationTransferButtonProps {
  readonly sourceNodeId: string;
  readonly canTransfer: boolean;
  readonly isTranslated: boolean;
  readonly onTransfer: (sourceNodeId: string) => void;
  readonly reason?: string; // Lý do tại sao không thể transfer
  readonly className?: string;
}

export function TranslationTransferButton({
  sourceNodeId,
  canTransfer,
  isTranslated,
  onTransfer,
  reason,
  className,
}: TranslationTransferButtonProps) {
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    if (!canTransfer || isTransferring) return;

    setIsTransferring(true);

    // Animation delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    onTransfer(sourceNodeId);
    setIsTransferring(false);
  };

  const getTooltipContent = () => {
    if (isTranslated) {
      return "Node này đã được dịch";
    }
    if (!canTransfer && reason) {
      return reason;
    }
    if (canTransfer) {
      return "Copy nội dung sang cột dịch";
    }
    return "Không thể copy node này";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant={canTransfer ? "default" : "ghost"}
            disabled={!canTransfer || isTransferring}
            onClick={handleTransfer}
            className={cn(
              "h-8 w-8 rounded-full transition-all duration-200",
              isTransferring && "animate-pulse",
              isTranslated && "bg-green-500 hover:bg-green-600",
              className
            )}
          >
            {isTranslated ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy
                className={cn(
                  "h-4 w-4 transition-transform",
                  isTransferring && "translate-x-1"
                )}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="text-sm">{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
