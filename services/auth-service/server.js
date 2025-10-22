import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../shared/db/index.js";
import { user } from "../../shared/db/schema.js";
import { eq } from "drizzle-orm";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// 🔐 Sign up
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: "Missing required fields" });

  try {
    const existing = await db.select().from(user).where(eq(user.email, email));
    if (existing.length > 0)
      return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await db.insert(user).values({
      name,
      email,
      password: hashed,
      credits: 500,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    const token = jwt.sign({ id: newUser[0].id, email }, JWT_SECRET, { expiresIn: "1d" });
    return res.status(201).json({ user: newUser[0], token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🔑 Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await db.select().from(user).where(eq(user.email, email));
    if (users.length === 0)
      return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, users[0].password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: users[0].id, email }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ user: users[0], token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
