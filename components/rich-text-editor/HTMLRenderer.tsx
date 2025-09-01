"use client";

import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { type JSONContent } from "@tiptap/react";

export function HtmlRenderer({ json }: { json: JSONContent }) {
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    import("./RenderTipTapHTML")
      .then((mod) => {
        const result = mod.renderTipTapHTML(json);
        setOutput(result);
      })
      .catch((error) => {
        console.error("Failed to load renderTipTapHTML:", error);
      });
  }, [json]);

  if (!output) {
    return null;
  }

  return <>{parse(output)}</>;
}
