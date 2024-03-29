import type { Config } from "drizzle-kit";
export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migration",
  driver: "pg",
  strict: true,
  // verbose: true, //auto log
  dbCredentials: {
    connectionString: process.env.SUPABASE_URL!
  }
} satisfies Config;