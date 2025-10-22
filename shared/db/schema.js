import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), // ✅ auto-generate UUIDs
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  credits: integer("credits").default(500),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
