import "server-only";
import { z } from "zod";

export const env = z
  .object({
    DATABASE_URL: z.url(),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
  })
  .parse(process.env);
