import fp from "fastify-plugin";
import FastifyBetterAuth from "fastify-better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});

export default fp(async (fastify) => {
  await fastify.register(FastifyBetterAuth, { auth });
});
