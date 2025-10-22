// notification-service/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5004;

// Parse incoming JSON requests
app.use(express.json()); // ✅ works for modern Express
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// ✅ Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 🩺 Health check
app.get("/", (_, res) => {
  res.json({ status: "Notification service running", ok: true });
});

// 📩 Send email notification
app.post("/api/notify/email", async (req, res) => {
  const { to, subject, message } = req.body;
  console.log("💳 Deducting credits for", req.body.to);
  if (!to || !subject || !message)
    return res.status(400).json({ error: "Missing to, subject, or message" });

  try {
    await transporter.sendMail({
      from: `"Slofy" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: `<div style="font-family:sans-serif;line-height:1.5">
        <h2>📬 ${subject}</h2>
        <p>${message}</p>
        <p style="color:#666;font-size:0.9rem;margin-top:10px">
          — Slofy Notification Service
        </p>
      </div>`,
    });

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("Email send error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Notification service running on port ${PORT}`));
