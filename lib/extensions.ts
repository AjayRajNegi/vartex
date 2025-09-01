// components/rich-text-editor/extensions.ts
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

export const extensions = [
  StarterKit,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
];
