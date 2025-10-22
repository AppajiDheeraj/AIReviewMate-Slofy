import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "../../shared/db/index.js"; // <-- use your shared DB
import { user } from "../../shared/db/schema.js"; // <-- import schema
import { eq, sql } from "drizzle-orm";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// 🔹 Get user credits
app.get("/api/credits", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Missing email" });

    const result = await db.select().from(user).where(eq(user.email, email));
    if (!result.length)
      return res.status(404).json({ error: "User not found" });

    const credits = result[0].credits || 0;
    res.json({ email, credits });
  } catch (err) {
    console.error("Error fetching credits:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Deduct credits
app.post("/api/credits/deduct", async (req, res) => {
  try {
    const { email, amount } = req.body;
    console.log("💳 Deducting credits for", req.body.email);
    if (!email || typeof amount !== "number")
      return res.status(400).json({ error: "Missing email or amount" });

    const result = await db.select().from(user).where(eq(user.email, email));
    if (!result.length)
      return res.status(404).json({ error: "User not found" });

    const currentCredits = result[0].credits || 0;
    if (currentCredits < amount)
      return res.status(400).json({ error: "Insufficient credits" });

    await db
      .update(user)
      .set({ credits: sql`${user.credits} - ${amount}` })
      .where(eq(user.email, email));

    res.json({ email, newCredits: currentCredits - amount });
  } catch (err) {
    console.error("Error deducting credits:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Add credits (for testing or rewards)
app.post("/api/credits/add", async (req, res) => {
  try {
    const { email, amount } = req.body;
    if (!email || typeof amount !== "number")
      return res.status(400).json({ error: "Missing email or amount" });

    const result = await db.select().from(user).where(eq(user.email, email));
    if (!result.length)
      return res.status(404).json({ error: "User not found" });

    await db
      .update(user)
      .set({ credits: sql`${user.credits} + ${amount}` })
      .where(eq(user.email, email));

    res.json({ email, newCredits: result[0].credits + amount });
  } catch (err) {
    console.error("Error adding credits:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Credits Service connected to DB running on port ${PORT}`)
);
