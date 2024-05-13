import React, { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Blockquote from "@tiptap/extension-blockquote";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Strike from "@tiptap/extension-strike";
import Typography from "@tiptap/extension-typography";
import HardBreak from "@tiptap/extension-hard-break";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Link from "@tiptap/extension-link";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { default as TiptapImage } from "@tiptap/extension-image";

type IDescription = {
  content: {
    type: string;
    content: any[];
  };
  className?: string;
  fontSize?: "text-sm" | "text-base" | "text-xs" | "text-lg" | "text-[1.2rem]";
  font?: "font-sans" | "font-serif" | "font-mono";
};

const RenderEditorContent: React.FC<IDescription> = ({
  content,
  className,
  fontSize,
  font,
}) => {
  const output = useMemo(() => {
    return generateHTML(content, [
      Document.configure({
        HTMLAttributes: {
          class: `${fontSize ? fontSize : "text-base"} ${
            font ? font : ""
          } select-none mb-6 leading-7`,
        },
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: `${fontSize ? fontSize : "text-base"} ${
            font ? font : ""
          } select-none mb-6 leading-7`,
        },
      }),
      Text.configure({
        HTMLAttributes: {
          class: `${fontSize ? fontSize : "text-base"} ${
            font ? font : ""
          } select-none mb-6 leading-7`,
        },
      }),
      Typography,
      HardBreak,
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-bold select-none mb-6 leading-7",
          level: [2],
        },
      }),
      Bold.configure({
        HTMLAttributes: {
          class: "font-bold select-none mb-6 leading-7",
        },
      }),
      Italic.configure({
        HTMLAttributes: {
          class: "italic select-none mb-6 leading-7",
        },
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: "border-l-2 pl-4 ml-5 select-none mb-6 leading-7",
        },
      }),
      ListItem.configure({
        HTMLAttributes: {
          class: "ml-5 select-none mb-6 leading-7",
        },
      }),
      OrderedList,
      HorizontalRule,
      Strike.configure({
        HTMLAttributes: {
          class: "line-through",
        },
      }),
      Superscript,
      Subscript,
      Link.configure({
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
          class: "text-link",
        },
      }),
      TiptapImage.configure({
        inline: false,
        HTMLAttributes: {
          class:
            "mx-auto rounded-lg object-cover max-w-[70%] select-none mb-6 leading-7",
        },
      }),
    ]);
  }, [content, font, fontSize]);

  return (
    <div
      className={`${className ? className : ""} w-full m-auto`}
      dangerouslySetInnerHTML={{ __html: output || "" }}
    />
  );
};

export default React.memo(RenderEditorContent);
