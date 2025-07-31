"use client";
import { Menubar } from "./Menubar";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";

// RichTextEditor component that integrates Tiptap for rich text editing
export function RichTextEditor({ field }: { field: any }) {
  // Initialize the Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit, // Provides basic editing features like bold, italic, headings, etc.
      TextAlign.configure({
        types: ["heading", "paragraph"], // Enables text alignment for these types
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose—sm sm:prose lg:prose—lg x l: prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      // Update form state with serialized editor content as JSON
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    // Initialize content from field value if available, else show default text
    content: field.value ? JSON.parse(field.value) : "<p>Hello World</p>",
    immediatelyRender: false, // Editor renders when it's ready, not instantly
  });

  return (
    // Editor wrapper with border and styling
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
      {/* Toolbar component (buttons for bold, italic, etc.) */}
      <Menubar editor={editor} />
      {/* Main editor content area */}
      <EditorContent editor={editor} />
    </div>
  );
}
