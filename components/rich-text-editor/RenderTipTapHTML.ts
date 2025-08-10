import StarterKit from "@tiptap/starter-kit";
import { type JSONContent } from "@tiptap/react";
import TextAlign from "@tiptap/extension-text-align";

// Dynamically load correct version of generateHTML
let generateHTMLFn: typeof import("@tiptap/html").generateHTML;

if (typeof window === "undefined") {
  // Node / SSR
  generateHTMLFn = require("@tiptap/html/server").generateHTML;
} else {
  // Browser
  generateHTMLFn = require("@tiptap/html").generateHTML;
}

export function renderTipTapHTML(json: JSONContent) {
  return generateHTMLFn(json, [
    StarterKit,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
  ]);
}
