"use client";

import dynamic from "next/dynamic";
import { type JSONContent } from "@tiptap/react";

const HtmlRenderer = dynamic(
  () => import("./HTMLRenderer").then((mod) => mod.HtmlRenderer),
  { ssr: false }
);

export function RenderDescriptionServerClientWrapper({
  json,
}: {
  json: JSONContent;
}) {
  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary">
      <HtmlRenderer json={json} />
    </div>
  );
}
