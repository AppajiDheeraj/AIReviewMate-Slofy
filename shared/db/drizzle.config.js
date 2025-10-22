import "dotenv/config";

export default {
  schema: "./schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL, // ✅ Neon full connection string
  },
};
