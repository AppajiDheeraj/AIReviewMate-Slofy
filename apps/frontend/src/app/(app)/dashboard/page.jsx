"use client";

import AIReviewEditor from "@/components/CodeEditor";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function EditorPage() {
  return (
    <ProtectedRoute>
    <AIReviewEditor />
    </ProtectedRoute>
  )
}
