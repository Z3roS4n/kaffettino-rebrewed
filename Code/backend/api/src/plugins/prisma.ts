// src/plugins/prisma.ts
import { PrismaClient } from "../generated/prisma/client.js";
import fp from "fastify-plugin";

export const prisma = new PrismaClient();

export default fp(async (fastify) => {
  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (app) => {
    await app.prisma.$disconnect();
  });
});

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
