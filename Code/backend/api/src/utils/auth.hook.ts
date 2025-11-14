import { getSession } from "@/utils/session";

import type { FastifyInstance } from "fastify";

async function authHook(fastify: FastifyInstance) {
  fastify.decorateRequest("session");

  fastify.addHook("onRequest", async (req, res) => {
    const session = await getSession(req);

    if (!session?.user) {
      return res
        .status(401)
        .send("You must be logged in to access this resource.");
    }

    req.setDecorator("session", session);
  });
}

export default authHook;
