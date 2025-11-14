// src/routes/user.ts
import type { FastifyInstance } from "fastify";
import { getSession } from "../../../utils/session.js";

const BASE_PATH = "/user";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get(`${BASE_PATH}`, async (request, reply) => {
    const session = await getSession(request);
    if (!session?.user) return reply.code(401).send({ error: "Unauthorized" });
    return { user: session.user };
  });
}
