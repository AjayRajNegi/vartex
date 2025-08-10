import parse from "html-react-parser";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { type JSONContent } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";

import { useMemo } from "react";
export function RenderDescription({ json }: { json: JSONContent }) {
  const output = useMemo(() => {
    return generateHTML(json, [
      StarterKit, // Provides basic editing features like bold, italic, headings, etc.
      TextAlign.configure({
        types: ["heading", "paragraph"], // Enables text alignment for these types
      }),
    ]);
  }, [json]);

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  );
}
