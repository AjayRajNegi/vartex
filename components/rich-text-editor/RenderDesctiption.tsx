"use client";

import parse from "html-react-parser";
import { type JSONContent } from "@tiptap/react";
import { renderTipTapHTML } from "./RenderTipTapHTML";

export function RenderDescription({ json }: { json: JSONContent }) {
  const output = renderTipTapHTML(json);

  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      {parse(output)}
    </div>
  );
}
