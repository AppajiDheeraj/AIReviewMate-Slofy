"use client";
import { createContext, useContext, useState } from "react";

const EditorContext = createContext();

/**
 * Provides the EditorContext to descendants, exposing shared `code` state and its updater.
 *
 * @param {Object} props - Component props.
 * @param {import('react').ReactNode} props.children - Elements that will receive the context value.
 * @returns {import('react').ReactElement} A provider element that supplies `{ code, setCode }` to its child tree.
 */
export function EditorProvider({ children }) {
  const [code, setCode] = useState("// Write your code here\n");

  return (
    <EditorContext.Provider value={{ code, setCode }}>
      {children}
    </EditorContext.Provider>
  );
}

/**
 * Access the editor context value.
 * @returns {{code: string, setCode: function(string): void}} The current editor context object containing `code` and `setCode`.
 */
export function useEditor() {
  return useContext(EditorContext);
}