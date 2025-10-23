import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import fetch from "node-fetch";
import proxy from "express-http-proxy";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// 🔒 Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 })); // 100 req/min

// 🧭 Health check
app.get("/", (req, res) => {
  res.json({ status: "AIReviewMate API Gateway is running ✅" });
});

console.log("Gateway env check:", {
  GITHUB_SERVICE_URL: process.env.GITHUB_SERVICE_URL,
  CREDITS_SERVICE_URL: process.env.CREDITS_SERVICE_URL,
  NOTIFY_SERVICE_URL: process.env.NOTIFY_SERVICE_URL
});

// ----- AUTH SIGNUP WRAPPER -----
app.post("/api/auth/signup", async (req, res) => {
  try {
    // Forward to Auth service
    const resp = await fetch(`${process.env.AUTH_SERVICE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await resp.json();

    // 📩 Send welcome email
    if (resp.ok && data.user?.email) {
      await fetch(`${process.env.NOTIFY_SERVICE_URL}/api/notify/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: data.user.email,
          subject: "🎉 Welcome to Slofy!",
          message: `
            <h2>Hey ${data.user.name}, welcome aboard 🚀</h2>
            <p>Your Slofy account was created successfully.</p>
            <p>You have <b>${data.user.credits}</b> credits ready to use.</p>
          `,
        }),
      }).catch(console.error);
    }

    res.status(resp.status).json(data);
  } catch (err) {
    console.error("Gateway signup error:", err);
    res.status(500).json({ error: "Gateway signup failed" });
  }
});


// ----- AUTH LOGIN WRAPPER -----
app.post("/api/auth/login", async (req, res) => {
  try {
    // Forward to Auth service
    const resp = await fetch(`${process.env.AUTH_SERVICE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await resp.json();

    // 📩 Optional: Send login alert
    if (resp.ok && data.user?.email) {
      await fetch(`${process.env.NOTIFY_SERVICE_URL}/api/notify/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: data.user.email,
          subject: "🔐 New Login Detected",
          message: `
            <p>Hello ${data.user.name},</p>
            <p>You just signed in to your Slofy account.</p>
            <p>If this wasn’t you, please reset your password immediately.</p>
            <br/>
            <p>Login time: ${new Date().toLocaleString()}</p>
          `,
        }),
      }).catch(console.error);
    }

    res.status(resp.status).json(data);
  } catch (err) {
    console.error("Gateway login error:", err);
    res.status(500).json({ error: "Gateway login failed" });
  }
});


// 🎯 Proxy to LLM Service
app.post("/api/llm/review", async (req, res) => {
  try {
    const resp = await fetch(`${process.env.LLM_SERVICE_URL}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await resp.json();

    if (resp.ok) {
      // 💳 Deduct 5 credits per AI review
      if (req.body.email) {
        await fetch(`${process.env.CREDITS_SERVICE_URL}/api/credits/deduct`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: req.body.email, amount: 5 }),
        });
      }
    }

    res.status(resp.status).json(data);
  } catch (err) {
    console.error("Error proxying to LLM:", err);
    res.status(500).json({ error: "LLM service unreachable" });
  }
});

// ----- COMMIT WRAPPER -----
app.post("/api/github/commit", async (req, res) => {
  try {
    console.log("🚀 Incoming commit:", req.body.email);
    const resp = await fetch(`${process.env.GITHUB_SERVICE_URL}/api/github/commit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await resp.json();
    console.log("GitHub service responded:", resp.status);

    if (resp.ok && req.body.email) {
      try {
        const c = await fetch(`${process.env.CREDITS_SERVICE_URL}/api/credits/deduct`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: req.body.email, amount: 10 }),
        });
        console.log("💳 Credits fetch result:", c.status);
        if (!c.ok) console.error(await c.text());
      } catch (err) {
        console.error("❌ Credits fetch failed:", err.message);
      }

      try {
        const n = await fetch(`${process.env.NOTIFY_SERVICE_URL}/api/notify/email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: req.body.email,
            subject: "✅ Commit Successful",
            message: "This is a test from Slofy Gateway"
          }),
        });
        console.log("📩 Notify fetch result:", n.status);
        if (!n.ok) console.error(await n.text());
      } catch (err) {
        console.error("❌ Notify fetch failed:", err.message);
      }
    }

    res.status(resp.status).json(data);
  } catch (err) {
    console.error("Gateway commit error:", err.message);
    res.status(500).json({ error: "Gateway commit failed" });
  }
});


// ----- PULL REQUEST WRAPPER -----
app.post("/api/github/pull-request", async (req, res) => {
  try {
    const resp = await fetch(`${process.env.GITHUB_SERVICE_URL}/api/github/pull-request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();

    if (resp.ok && req.body.email) {
      // 💳 Deduct credits
      await fetch(`${process.env.CREDITS_SERVICE_URL}/api/credits/deduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: req.body.email, amount: 10 }),
      }).catch(console.error);

      // 📩 Send PR notification
      await fetch(`${process.env.NOTIFY_SERVICE_URL}/api/notify/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: req.body.email,
          subject: "📬 Pull Request Created",
          message: `
            A new Pull Request has been created for <b>${req.body.repo}</b><br>
            Branch: <b>${req.body.branch}</b><br>
            <a href="${data.url ?? '#'}">View PR</a>
          `,
        }),
      }).catch(console.error);
    }

    res.status(resp.status).json(data);
  } catch (err) {
    console.error("Gateway PR error:", err);
    res.status(500).json({ error: "Gateway pull request failed" });
  }
});


app.use("/api/auth", proxy(process.env.AUTH_SERVICE_URL || "http://localhost:5005"));


// 🎯 Proxy to Credits Service
app.use(
  "/api/credits",
  proxy(process.env.CREDITS_SERVICE_URL || "http://localhost:5003", {
    proxyReqPathResolver: (req) => {
      // preserve query string for GET
      return "/api/credits" + req.url;
    },
  })
);


app.use(
  "/api/github",
  proxy(process.env.GITHUB_SERVICE_URL || "http://localhost:5002", {
    proxyReqPathResolver: (req) => "/api/github" + req.url,
  })
);

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
