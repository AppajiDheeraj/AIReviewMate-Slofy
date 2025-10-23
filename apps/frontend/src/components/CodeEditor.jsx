"use client";

import { useEditor } from "@/context/EditorContext";
import { useState, useEffect } from "react";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Terminal, TypingAnimation } from "@/components/ui/terminal";
import { Sparkles, ChevronDown, Code2, GitCompare, Wand2, XCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { useRef } from "react";
import { useAuth } from "@/context/AuthContext";

export default function CodeTerminalReview() {
  const { theme: appTheme } = useTheme();
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [language, setLanguage] = useState("auto");
  // const [code, setCode] = useState(
  //   "\n//  ___( o)>\n//  \\ <_. )\n//   `---'\n// Time to Code Review!\n"
  // );
  const { code, setCode } = useEditor();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("your-code");
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const { user } = useAuth();

  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    setEditorTheme(appTheme === "light" ? "vs" : "vs-dark");
  }, [appTheme]);

  const languages = [
    "auto",
    "javascript",
    "typescript",
    "python",
    "cpp",
    "java",
    "go",
    "rust",
    "php",
    "swift",
    "kotlin",
    "html",
    "css",
    "sql",
  ];

  const detectLanguage = (code) => {
    if (code.includes("#include")) return "cpp";
    if (code.includes("def ")) return "python";
    if (code.includes("console.log")) return "javascript";
    if (code.includes("public static void main")) return "java";
    return "javascript";
  };

  const debouncedAnalyze = (newCode) => {
    // Cancel previous debounce timer
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    // Wait 1.2s after typing stops
    debounceTimerRef.current = setTimeout(() => {
      analyzeCode(newCode);
    }, 2000);
  };

  const cancelReview = () => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort(); // ✅ abort the actual fetch
    abortControllerRef.current = null;
  }

  if (debounceTimerRef.current) {
    clearTimeout(debounceTimerRef.current); // ✅ stop any queued debounced call
  }

  setLoading(false);
  setStatusMessage("⏹️ Review canceled.");
  setResult(null);
  setError(null);
  console.log("⚠️ Review canceled by user.");
};


  const analyzeCode = async (sourceCode) => {
    if (!sourceCode || !sourceCode.trim()) return;

    // cancel any in-progress request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setStatusMessage("Reviewing your code...");
    setResult(null);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/llm/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user?.email,
            code: sourceCode,
            language:
              language === "auto" ? detectLanguage(sourceCode) : language,
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) throw new Error("LLM review failed");
      const data = await response.json();

      setResult(data);
      setStatusMessage("✅ Review completed successfully");
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("⏹️ Request canceled due to new typing");
      } else {
        console.error("Error during review:", err);
        setError("AI review failed.");
        setStatusMessage("⚠️ AI review failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const acceptChanges = () => {
    if (result?.improvedCode) setCode(result.improvedCode);
    setTab("your-code");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#0a0a0a] p-6">
      <div className="w-full max-w-6xl bg-[#0d0d0d] border border-[#222] rounded-lg shadow-2xl overflow-hidden relative backdrop-blur-md">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-[#222] bg-[#111111]">
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#161616] border-gray-700 text-gray-300"
                >
                  {language.toUpperCase()}{" "}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#161616] border-gray-700 text-gray-300 max-h-56 overflow-y-auto">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                  >
                    {lang.toUpperCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#161616] border-gray-700 text-gray-300"
                >
                  {editorTheme === "vs-dark" ? "Dark" : "Light"}{" "}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#161616] border-gray-700 text-gray-300">
                <DropdownMenuItem onClick={() => setEditorTheme("vs-dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditorTheme("vs")}>
                  Light
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Editor Workspace */}
        <div className="p-0 bg-[#0d0d0d] text-gray-200 border-none min-h-[80vh] rounded-lg overflow-hidden">
          <Tabs value={tab} onValueChange={setTab} className="w-full p-2 gap-2">
            {/* Tabs Header */}
            <TabsList className="bg-[#141414] border-b border-[#222] h-10">
              <TabsTrigger
                value="your-code"
                className="flex items-center gap-2"
              >
                <Code2 className="h-4 w-4" /> Your Code
              </TabsTrigger>

              {result && (
                <>
                  <TabsTrigger
                    value="ai-diff"
                    className="flex items-center gap-2"
                  >
                    <GitCompare className="h-4 w-4" /> AI Diff
                  </TabsTrigger>

                  <TabsTrigger
                    value="ai-explanation"
                    className="flex items-center gap-2"
                  >
                    <Wand2 className="h-4 w-4" /> AI Explanation
                  </TabsTrigger>
                </>
              )}
            </TabsList>

            {/* Editor */}
            <TabsContent value="your-code" className="overflow-hidden">
              <Editor
  height="72vh"
  theme={editorTheme}
  language={language === "auto" ? detectLanguage(code) : language}
  value={code}
  onChange={(v) => {
    setCode(v || "");
    debouncedAnalyze(v || "");
  }}
  options={{
    fontSize: 14,
    minimap: { enabled: false },
    lineNumbers: "on",
    automaticLayout: true,
    scrollBeyondLastLine: false,
  }}
/>

            </TabsContent>

            {/* Diff Viewer */}
            {result && (
              <TabsContent value="ai-diff" className="relative">
                <DiffEditor
                  height="72vh"
                  theme={editorTheme}
                  original={code}
                  modified={result.improvedCode || ""}
                  language={
                    language === "auto" ? detectLanguage(code) : language
                  }
                  options={{
                    renderSideBySide: true,
                    readOnly: true,
                    automaticLayout: true,
                  }}
                />
                <div className="absolute right-4 top-3 flex gap-2">
                  <Button
                    onClick={acceptChanges}
                    className="bg-green-600/35 border-green-600 hover:bg-green-700/55 text-white"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => setTab("your-code")}
                    className="bg-red-600/35 hover:bg-red-700/55 text-white"
                  >
                    Reject
                  </Button>
                </div>
              </TabsContent>
            )}

            {/* AI Explanation */}
            {result && (
              <TabsContent
                value="ai-explanation"
                className="bg-black p-4 rounded-b-lg"
              >
                {result.error ? (
                  <TypingAnimation className="text-red-500 text-md">
                    &gt; {result.error}
                  </TypingAnimation>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      {/* ✅ Show category badge here */}
                      {result.category && (
                        <Badge
                          variant={
                            result.category === "Bug Fix"
                              ? "destructive"
                              : result.category === "Better Performance"
                              ? "secondary"
                              : "outline"
                          }
                          className="ml-2"
                        >
                          {result.category}
                        </Badge>
                      )}
                      <TypingAnimation className="text-green-500 text-lg">
                        &gt; AI Review completed successfully.
                      </TypingAnimation>
                    </div>

                    <TypingAnimation className="text-gray-300 mt-2 text-md whitespace-pre-wrap">
                      {result.explanation || "No explanation provided."}
                    </TypingAnimation>
                  </>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Floating Send Button */}
         <div className="absolute bottom-5 right-6 flex gap-3">
          <Button
            onClick={analyzeCode}
            disabled={loading}
            className={`px-6 py-3 rounded-full font-semibold shadow-lg ${
              loading
                ? "bg-blue-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white flex items-center gap-2`}
          >
            {loading ? "Analyzing..." : <>
              <Sparkles className="h-4 w-4" /> Send to AI
            </>}
          </Button>

          <Button
          onClick={cancelReview}
            disabled={!loading}
            className={`px-6 py-3 rounded-full font-semibold shadow-lg bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-2 ${
              !loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <XCircle className="h-4 w-4" /> Cancel
          </Button>
        </div>
        
      </div>
    </div>
  );
}
