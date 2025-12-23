"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  RotateCcw,
  RotateCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "<p>Nhập mô tả khóa học...</p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg focus:outline-none min-h-[250px] p-4 border rounded-md bg-white",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>");
    }
  }, [value]);

  if (!editor) return null;

  const setLink = () => {
    if (linkUrl === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: linkUrl }).run();
    setLinkUrl("");
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 border-b pb-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold")
              ? "bg-blue-100 border-blue-400 text-blue-600"
              : "hover:bg-gray-100"
          }
        >
          <Bold size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic")
              ? "bg-blue-100 border-blue-400 text-blue-600"
              : "hover:bg-gray-100"
          }
        >
          <Italic size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={
            editor.isActive("underline")
              ? "bg-blue-100 border-blue-400 text-blue-600"
              : "hover:bg-gray-100"
          }
        >
          <UnderlineIcon size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={
            editor.isActive("codeBlock")
              ? "bg-blue-100 border-blue-400 text-blue-600"
              : "hover:bg-gray-100"
          }
        >
          <Code size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <RotateCcw size={16} />
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <RotateCw size={16} />
        </Button>
      </div>

      {/* Editor content */}
      <div className="max-w-[750px] bg-white prose prose-sm">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
