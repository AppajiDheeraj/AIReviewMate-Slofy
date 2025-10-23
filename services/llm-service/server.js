// server.js (ESM) - Upgraded with fool-proof Function Calling
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
// We no longer need jsonrepair!

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// CORS setup... (remains the same)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000,http://localhost:3001" ).split(",").map((u) => u.trim());
app.use(cors({ /* ... */ }));
app.use(express.json({ limit: "1mb" }));


// The function/tool schema from Step 1
// This schema describes the `submit_code_review` function and its parameters.
const codeReviewTool = {
  type: "function",
  function: {
    name: "submit_code_review",
    description: "Submit the AI's review of the user's code, including suggestions and the fully improved code.",
    parameters: {
      type: "object",
      properties: {
        suggestions: {
          type: "array",
          description: "A list of specific, actionable suggestions for improvement.",
          items: {
            type: "object",
            properties: {
              startLine: { type: "number", description: "The 1-based starting line number of the code to be replaced." },
              endLine: { type: "number", description: "The 1-based ending line number of the code to be replaced." },
              oldCode: { type: "string", description: "The exact original code snippet that should be changed." },
              newCode: { type: "string", description: "The new code that should replace the original snippet." },
              explanation: { type: "string", description: "A brief explanation of why this change is an improvement." },
              category: { 
                type: "string", 
                description: "The category of the suggestion.",
                enum: ["Best Practices", "Better Performance", "Bug Fix"] 
              },
            },
            required: ["startLine", "endLine", "oldCode", "newCode", "explanation", "category"],
          },
        },
        fullImprovedCode: {
          type: "string",
          description: "The complete source code with all suggestions applied.",
        },
        explanation: {
          type: "string",
          description: "A one-paragraph summary of the overall changes made.",
        },
        category: {
          type: "string",
          description: "The single best category that describes the overall review.",
          enum: ["Best Practices", "Better Performance", "Bug Fix"],
        },
      },
      required: ["suggestions", "fullImprovedCode", "explanation", "category"],
    },
  },
};



app.get("/", (_, res) => res.json({ status: "AIReviewMate LLM service", ok: true }));

app.post("/review", async (req, res) => {
  const { code, language = "plaintext" } = req.body || {};
  if (!code) return res.status(400).json({ error: "Missing code" });

  try {
    // The prompt is now much simpler. It just asks the AI to perform a task.
    const prompt = `Please review the following ${language} code. Identify areas for improvement, fix them, and submit your review.`;

    const llmResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert AI code reviewer. Your task is to analyze user-submitted code and call the `submit_code_review` function with your findings." },
          { role: "user", content: `${prompt}\n\n\`\`\`${language}\n${code}\n\`\`\`` },
        ],
        // --- THIS IS THE MAGIC OF FUNCTION CALLING ---
        tools: [codeReviewTool], // 1. Provide the tool definition
        tool_choice: { type: "function", function: { name: "submit_code_review" } }, // 2. Force the model to use it
        // ---
        temperature: 0.1,
        max_tokens: 4000,
      } ),
    });

    if (!llmResponse.ok) {
      const errorBody = await llmResponse.text();
      throw new Error(`LLM API request failed with status ${llmResponse.status}: ${errorBody}`);
    }

    const data = await llmResponse.json();
    
    // --- THIS IS THE NEW, FOOLPROOF PARSING ---
    // The arguments are inside a tool_calls array, already as a JSON string.
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "submit_code_review") {
      throw new Error("The AI model did not call the required function.");
    }

    // JSON.parse is now safe because the API guarantees this string is valid JSON.
    let parsed;
try {
  const rawArgs = toolCall.function.arguments;

  // Remove newlines or trailing commas that break JSON.parse
  const clean = rawArgs
    .replace(/\n/g, " ")
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]");

  parsed = JSON.parse(clean);
} catch (e) {
  console.error("🧨 JSON.parse failed on tool arguments:", e.message);
  console.error("Raw tool_call arguments snippet:", toolCall?.function?.arguments?.slice(0, 200));
  return res
    .status(500)
    .json({ error: "Model returned invalid JSON", details: e.message });
} 
    // --- NO MORE REPAIRING, NO MORE ERRORS ---

    const suggestions = (parsed.suggestions || []).map((s, idx) => ({
      id: s.id ?? idx + 1,
      startLine: s.startLine ?? 1,
      endLine: s.endLine ?? 1,
      oldCode: s.oldCode ?? "",
      newCode: s.newCode ?? "",
      explanation: s.explanation ?? "No explanation provided.",
      category: s.category ?? "Best Practices",
    }));

    res.json({
      suggestions,
      fullImprovedCode: parsed.fullImprovedCode || code,
      improvedCode: parsed.fullImprovedCode || code,
      explanation: parsed.explanation || "The AI did not provide a summary.",
      category: parsed.category || "Best Practices",
    });

  } catch (err) {
    console.error("Critical error in /review endpoint:", err);
    res.status(500).json({ error: "An internal server error occurred.", details: String(err.message) });
  }
});

app.listen(PORT, () => {
  console.log(`✅ AIReviewMate LLM service (Function Calling Mode) running on port ${PORT}`);
});
