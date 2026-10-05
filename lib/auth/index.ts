import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { seedDefaultCategories } from "@/lib/categories/seed";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { env } from "@/lib/env";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  user: { modelName: "users" },
  session: { modelName: "sessions" },
  account: { modelName: "authAccounts" },
  verification: { modelName: "verifications" },
  emailAndPassword: { enabled: true, autoSignIn: true },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  databaseHooks: {
    user: {
      create: { after: (user) => seedDefaultCategories(user.id) },
    },
  },
  advanced: { database: { generateId: "uuid" } },
  plugins: [nextCookies()],
});
