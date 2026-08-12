"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Color from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Text,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";

function ToolbarButton({ active = false, label, onClick, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`rounded p-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 ${
        active ? "bg-blue-100 text-blue-700" : ""
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 h-6 w-px self-center bg-gray-200" />;
}

export default function TiptapEditor({ value = "", onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Image,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: "Start writing your blog post here..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose max-w-none min-h-[500px] focus:outline-none prose-headings:text-gray-900 prose-p:text-gray-700",
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
  });

  useEffect(() => {
    if (!editor || value === editor.getHTML()) return;
    editor.commands.setContent(value || "", { emitUpdate: false });
  }, [editor, value]);

  if (!editor) return null;

  const setLink = () => {
    const url = window.prompt("Enter the link URL");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url.trim() }).run();
  };

  const insertImage = () => {
    const url = window.prompt("Enter the image URL");
    if (url?.trim()) editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  const button = (label, Icon, command, active = false) => (
    <ToolbarButton label={label} onClick={command} active={active}>
      <Icon size={16} />
    </ToolbarButton>
  );

  return (
    <div className="overflow-hidden rounded-lg">
      <div className="sticky top-0 z-10 flex flex-wrap gap-1 rounded-t-lg border border-gray-200 bg-white p-2">
        {button("Bold", Bold, () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
        {button("Italic", Italic, () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
        {button("Underline", UnderlineIcon, () => editor.chain().focus().toggleUnderline().run(), editor.isActive("underline"))}
        {button("Strikethrough", Strikethrough, () => editor.chain().focus().toggleStrike().run(), editor.isActive("strike"))}
        {button("Highlight", Highlighter, () => editor.chain().focus().toggleHighlight().run(), editor.isActive("highlight"))}
        {button("Clear formatting", RemoveFormatting, () => editor.chain().focus().unsetAllMarks().clearNodes().run())}
        <Divider />
        {button("Heading 1", Heading1, () => editor.chain().focus().toggleHeading({ level: 1 }).run(), editor.isActive("heading", { level: 1 }))}
        {button("Heading 2", Heading2, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
        {button("Heading 3", Heading3, () => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive("heading", { level: 3 }))}
        {button("Paragraph", Text, () => editor.chain().focus().setParagraph().run(), editor.isActive("paragraph"))}
        <Divider />
        {button("Bullet list", List, () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
        {button("Ordered list", ListOrdered, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
        {button("Blockquote", Quote, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"))}
        {button("Code block", Code2, () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive("codeBlock"))}
        <Divider />
        {button("Align left", AlignLeft, () => editor.chain().focus().setTextAlign("left").run(), editor.isActive({ textAlign: "left" }))}
        {button("Align center", AlignCenter, () => editor.chain().focus().setTextAlign("center").run(), editor.isActive({ textAlign: "center" }))}
        {button("Align right", AlignRight, () => editor.chain().focus().setTextAlign("right").run(), editor.isActive({ textAlign: "right" }))}
        {button("Justify", AlignJustify, () => editor.chain().focus().setTextAlign("justify").run(), editor.isActive({ textAlign: "justify" }))}
        <Divider />
        {button("Insert link", LinkIcon, setLink, editor.isActive("link"))}
        {button("Insert image", ImagePlus, insertImage)}
        {button("Horizontal rule", Minus, () => editor.chain().focus().setHorizontalRule().run())}
        <Divider />
        {button("Undo", Undo2, () => editor.chain().focus().undo().run())}
        {button("Redo", Redo2, () => editor.chain().focus().redo().run())}
      </div>
      <div className="min-h-[500px] rounded-b-lg border border-t-0 border-gray-200 p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
