import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Octokit } from "@octokit/rest";

dotenv.config();
console.log("Loaded GitHub Token:", process.env.GITHUB_TOKEN ? "✅ Loaded" : "❌ Missing");
const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, 
});

// 📁 Fetch repository tree
// /api/github/tree route
app.get("/api/github/tree", async (req, res) => {
  const { owner, repo, path = "" } = req.query;

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "Slofy-App",
      },
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("GitHub tree fetch failed:", data);
      return res.status(response.status).json({ error: "Failed to fetch tree" });
    }

    // 🔹 Include the 'path' property so frontend knows what to fetch later
    const tree = data.map((item) => ({
      id: item.sha || item.name,
      name: item.name,
      type: item.type === "dir" ? "folder" : "file",
      path: item.path, // ✅ CRUCIAL — so handleFileClick(item.path) works
    }));

    res.json(tree);
  } catch (err) {
    console.error("Error fetching tree:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// 📄 Fetch file content
app.get("/api/github/file", async (req, res) => {
  const { owner, repo, path } = req.query;
  if (!owner || !repo || !path)
    return res.status(400).json({ error: "Missing owner, repo, or path" });

  try {
    const { data } = await octokit.repos.getContent({ owner, repo, path });
    const content = Buffer.from(data.content, "base64").toString("utf8");
    res.json({ path, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/github/auth-check", async (req, res) => {
  try {
    const { data } = await octokit.rest.users.getAuthenticated();
    res.json({ login: data.login, authenticated: true });
  } catch (err) {
    res.status(401).json({ authenticated: false, error: err.message });
  }
});

app.get("/api/github/rate-limit", async (req, res) => {
  try {
    const { data } = await octokit.rest.rateLimit.get();
    res.json({ remaining: data.rate.remaining, limit: data.rate.limit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create Branch + Commit
app.post("/api/github/commit", async (req, res) => {
  const { owner, repo, branch, baseBranch, message, files } = req.body;

  if (!owner || !repo || !branch || !baseBranch || !files?.length)
    return res.status(400).json({ error: "Missing parameters" });

  try {
    // 1️⃣ Get base branch SHA
    const { data: baseRef } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${baseBranch}`,
    });

    // 2️⃣ Create branch if it doesn’t exist
    let branchRef;
    try {
      branchRef = await octokit.git.getRef({ owner, repo, ref: `heads/${branch}` });
    } catch {
      await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branch}`,
        sha: baseRef.object.sha,
      });
    }

    const commitUrls = [];

    // 3️⃣ Commit each file
    for (const file of files) {
      const { data: latestFile } = await octokit.repos.getContent({
        owner,
        repo,
        path: file.path,
        ref: branch,
      }).catch(() => ({ data: null }));

      const params = {
        owner,
        repo,
        path: file.path,
        message,
        content: Buffer.from(file.content).toString("base64"),
        branch,
      };

      if (latestFile && latestFile.sha) params.sha = latestFile.sha;

      const { data: commit } = await octokit.repos.createOrUpdateFileContents(params);
      commitUrls.push(commit.commit.html_url);
    }

    res.json({ branch, commitUrls });
  } catch (err) {
    console.error("Commit error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Create Pull Request
app.post("/api/github/pull-request", async (req, res) => {
  const { owner, repo, branch, baseBranch, title, body } = req.body;
  if (!owner || !repo || !branch || !baseBranch)
    return res.status(400).json({ error: "Missing parameters" });

  try {
    const { data: pulls } = await octokit.pulls.list({
      owner,
      repo,
      head: `${owner}:${branch}`,
      base: baseBranch,
      state: "open",
    });

    if (pulls.length > 0) {
      return res.json({ status: "exists", url: pulls[0].html_url });
    }

    const { data: pr } = await octokit.pulls.create({
      owner,
      repo,
      head: branch,
      base: baseBranch,
      title,
      body,
    });

    res.json({ status: "created", url: pr.html_url });
  } catch (err) {
    console.error("PR error:", err.message);
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => console.log(`✅ GitHub service running on port ${PORT}`));
