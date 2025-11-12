"use client";

import type { TLinkElement } from "platejs";
import type { PlateElementProps } from "platejs/react";

import { getLinkAttributes } from "@platejs/link";
import { PlateElement } from "platejs/react";

import { cn } from "@/lib/utils";

export function LinkElement(props: PlateElementProps<TLinkElement>) {
  // const suggestionData = props.editor
  //   .getApi(SuggestionPlugin)
  //   .suggestion.suggestionData(props.element) as
  //   | TInlineSuggestionData
  //   | undefined;

  return (
    <PlateElement
      {...props}
      as="a"
      className={cn(
        "font-medium text-primary underline decoration-primary underline-offset-4"
      )}
      attributes={{
        ...props.attributes,
        ...getLinkAttributes(props.editor, props.element),
        onMouseOver: (e) => {
          e.stopPropagation();
        },
      }}
    >
      {props.children}
    </PlateElement>
  );
}
