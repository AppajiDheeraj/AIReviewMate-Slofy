import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import dotenv from "dotenv";

dotenv.config();
console.log("🧠 Loaded DATABASE_URL:", process.env.DATABASE_URL);
const client = postgres(process.env.DATABASE_URL, { ssl: "require" });
export const db = drizzle(client, { schema });
