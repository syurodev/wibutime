/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { FC, memo, useCallback, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Heading2,
  Bold,
  Italic,
  Quote,
  List,
  ListOrdered,
  Strikethrough,
  ImagePlus,
  Superscript,
  Subscript,
  Link2,
} from "lucide-react";

import { Toggle } from "@/components/ui/toggle";
// import { compressImage } from '@/lib/compressImage'
// import { deleteFiles } from '@/actions/uploadthing'
// import { uploadFiles } from '@/lib/uploadthing'
import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

type IProps = {
  editor: Editor | null;
  imageUpload: boolean;
};

const Toolbar: FC<IProps> = ({ editor, imageUpload }) => {
  if (!editor) return null;

  const [image, setImage] = useState<{
    key: string;
    url: string;
  }>({
    key: "",
    url: "",
  });
  // const [isLoading, setIsLoading] = useState<boolean>(false)

  // const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (!e.target.files) return
  //   setIsLoading(true)
  //   const result = await compressImage(
  //     e.target.files, 0.8
  //   )

  //   // if (image.key !== "") {
  //   //   await deleteFiles(image.key)
  //   // }

  //   const [res] = await uploadFiles('smallImage', { files: [result] })

  //   setImage({
  //     key: res.key,
  //     url: res.url
  //   })

  //   editor.chain().focus().setImage({ src: res.url }).run()
  //   setIsLoading(false)
  // }

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex w-full justify-between">
      <div className="flex w-full gap-2 items-center">
        <Toggle
          size={"sm"}
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
        >
          <Heading2 />
        </Toggle>

        <Toggle
          size={"sm"}
          pressed={editor.isActive("bold")}
          onPressedChange={() => {
            editor.chain().focus().toggleBold().run();
          }}
        >
          <Bold />
        </Toggle>

        <Toggle
          size={"sm"}
          pressed={editor.isActive("italic")}
          onPressedChange={() => {
            editor.chain().focus().toggleItalic().run();
          }}
        >
          <Italic />
        </Toggle>

        <Toggle
          size={"sm"}
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => {
            editor.chain().focus().toggleBlockquote().run();
          }}
        >
          <Quote />
        </Toggle>

        <Toggle
          size={"sm"}
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => {
            editor.chain().focus().toggleBulletList().run();
          }}
        >
          <List />
        </Toggle>

        <Toggle
          size={"sm"}
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => {
            editor.chain().focus().toggleOrderedList().run();
          }}
        >
          <ListOrdered />
        </Toggle>

        <Toggle
          size={"sm"}
          pressed={editor.isActive("strike")}
          onPressedChange={() => {
            editor.chain().focus().toggleStrike().run();
          }}
        >
          <Strikethrough />
        </Toggle>

        <Toggle
          size={"sm"}
          pressed={editor.isActive("subscript")}
          onPressedChange={() => {
            editor.chain().focus().toggleSubscript().run();
          }}
        >
          <Subscript />
        </Toggle>

        <Toggle
          size={"sm"}
          pressed={editor.isActive("superscript")}
          onPressedChange={() => {
            editor.chain().focus().toggleSuperscript().run();
          }}
        >
          <Superscript />
        </Toggle>

        <Button size={"sm"} onClick={setLink} variant={"ghost"}>
          <Link2 />
        </Button>

        {/* <label htmlFor='editorAddImage' className='cursor-pointer rounded-md hover:bg-muted'>
          {
            isLoading ? (
              <ReloadIcon className="size-[14px] animate-spin" />
            ) : (
              <ImagePlus className="size-[14px]" />
            )
          }
          <input
            id='editorAddImage'
            className="hidden"
            type="file"
            onChange={(e) => handleUploadImage(e)}
          />
        </label> */}
      </div>

      {imageUpload && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
    </div>
  );
};

export default memo(Toolbar);
