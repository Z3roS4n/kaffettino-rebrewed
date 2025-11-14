import type { FastifyInstance } from "fastify";
import { getSession } from "../../../utils/session.js";
import userHandler, {
  IGetUser,
  ISetUserData,
} from "../../../utils/user-handler.js";
import sendError from "../../../utils/error-handler.js";

const BASE_PATH = "/user";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get(`${BASE_PATH}`, async (request, reply) => {
    try {
      const { includeWallets } = request.query as { includeWallets?: boolean };

      const session = await getSession(request);
      if (!session?.user)
        return reply.code(401).send({ error: "Unauthorized" });

      const user: IGetUser = await userHandler.getUser(
        session.user.id,
        includeWallets
      );

      return user;
    } catch (error) {
      return sendError({ code: 500, error: error });
    }
  });

  fastify.post(`${BASE_PATH}`, async (request, reply) => {
    try {
      const body: ISetUserData = request.body as ISetUserData;

      const session = await getSession(request);
      if (!session?.user)
        return reply.code(401).send({ error: "Unauthorized" });

      const updateUser = await userHandler.setUserData(session.user.id, body);

      return updateUser;
    } catch (error) {
      return sendError({ code: 500, error: error });
    }
  });
}
