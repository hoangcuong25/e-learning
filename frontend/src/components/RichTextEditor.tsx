"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
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

type ToolbarButtonProps = {
  onClick: () => void;
  isActive?: boolean;
  title?: string;
  children: React.ReactNode;
};

function ToolbarButton({ onClick, isActive, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`
        w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all duration-150
        ${
          isActive
            ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
            : "text-slate-400 hover:text-slate-100 hover:bg-slate-700 border border-transparent"
        }
      `}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-slate-700 self-center mx-0.5" />;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value || "<p></p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm focus:outline-none min-h-[180px] px-4 py-3 text-slate-200 leading-relaxed",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "<p></p>");
    }
  }, [value]);

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 overflow-hidden transition-all focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-slate-700 bg-slate-800/80">
        {/* Text formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Đậm"
        >
          <Bold size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Nghiêng"
        >
          <Italic size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          title="Gạch chân"
        >
          <UnderlineIcon size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
          title="Code"
        >
          <Code size={14} />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Danh sách"
        >
          <List size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Danh sách số"
        >
          <ListOrdered size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Trích dẫn"
        >
          <Quote size={14} />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          title="Căn trái"
        >
          <AlignLeft size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          title="Căn giữa"
        >
          <AlignCenter size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          title="Căn phải"
        >
          <AlignRight size={14} />
        </ToolbarButton>

        <Divider />

        {/* History */}
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Hoàn tác"
        >
          <RotateCcw size={14} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Làm lại"
        >
          <RotateCw size={14} />
        </ToolbarButton>
      </div>

      {/* Editor content area */}
      <div className="bg-slate-800">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
