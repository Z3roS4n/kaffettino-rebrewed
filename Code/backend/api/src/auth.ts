import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./plugins/prisma.ts";

// Configurazione BetterAuth
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: ["http://localhost:3000", "https://example.com"],
  emailAndPassword: {
    enabled: true,
  },
});
