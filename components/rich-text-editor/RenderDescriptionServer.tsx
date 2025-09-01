import { type JSONContent } from "@tiptap/react";
import { RenderDescriptionServerClientWrapper } from "./RenderDescriptionServerClientWrapper";

export function RenderDescriptionServer({ json }: { json: JSONContent }) {
  return <RenderDescriptionServerClientWrapper json={json} />;
}
