import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/db/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: {
    allowedHosts: [
      "piardify.vercel.app",
      "*.vercel.app",
      "localhost:3000",
    ],
    protocol: "auto",
  },
  trustedOrigins: [
    "https://localhost:3000",
    "http://localhost:3000",
    "https://*.vercel.app",
    process.env.BETTER_AUTH_URL || "",
  ].filter(Boolean),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
