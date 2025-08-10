import StarterKit from "@tiptap/starter-kit";
import { type JSONContent } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";

let generateHTMLFn: typeof import("@tiptap/html").generateHTML;

// Pick correct implementation at runtime
if (typeof window === "undefined") {
  // SSR
  import("@tiptap/html/server").then((mod) => {
    generateHTMLFn = mod.generateHTML;
  });
} else {
  // CSR
  import("@tiptap/html").then((mod) => {
    generateHTMLFn = mod.generateHTML;
  });
}

export function renderTipTapHTML(json: JSONContent) {
  if (!generateHTMLFn) {
    throw new Error("generateHTML function not loaded yet");
  }

  return generateHTMLFn(json, [
    StarterKit,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
  ]);
}
