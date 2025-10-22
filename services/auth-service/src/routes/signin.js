import express from "express";
import { db } from "../../../../shared/db/index.js";
import { eq } from "drizzle-orm";
import { verifyPassword } from "../utils/hash.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.query.user.findFirst({
      where: (u, { eq }) => eq(u.email, email),
    });

    if (!user) return res.status(401).json({ error: "Invalid email" });

    const valid = await verifyPassword(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
