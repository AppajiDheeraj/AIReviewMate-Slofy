"use client";

import AIReviewEditor from "@/components/CodeEditor";
import { ProtectedRoute } from "@/components/ProtectedRoute";

/**
 * Dashboard page that renders the AI review code editor inside an authentication-protected route.
 *
 * @returns {JSX.Element} The AIReviewEditor component wrapped by ProtectedRoute.
 */
export default function EditorPage() {
  return (
    <ProtectedRoute>
    <AIReviewEditor />
    </ProtectedRoute>
  )
}