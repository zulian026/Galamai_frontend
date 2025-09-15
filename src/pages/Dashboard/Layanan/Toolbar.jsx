// src/pages/Toolbar.jsx
import React from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, INSERT_PARAGRAPH_COMMAND } from "lexical";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex gap-2 border-b p-2 bg-gray-50">
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className="px-2 py-1 border rounded"
      >
        B
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className="px-2 py-1 border rounded"
      >
        I
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className="px-2 py-1 border rounded"
      >
        U
      </button>
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined)
        }
        className="px-2 py-1 border rounded"
      >
        ➖ Divider
      </button>
    </div>
  );
}
