"use client";

import { generateHTML } from "@tiptap/html";
import { type JSONContent } from "@tiptap/react";
import { extensions } from "../../lib/extensions";

export function renderTipTapHTML(json: JSONContent): string {
  if (!json) return "";
  return generateHTML(json, extensions);
}
