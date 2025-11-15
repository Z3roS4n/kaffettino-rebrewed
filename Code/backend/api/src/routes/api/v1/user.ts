import type { FastifyInstance } from "fastify";
import { getSession } from "../../../utils/session.js";
import userHandler, {
  IGetUser,
  ISetUserData,
} from "../../../utils/user-handler.js";
import sendError from "../../../utils/error-handler.js";
import sessionMW from "../../../middlewares/session.js";

const BASE_PATH = "/user";

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get(
    `${BASE_PATH}`,
    { preHandler: sessionMW },
    async (request, reply) => {
      try {
        const { includeWallets } = request.query as {
          includeWallets?: boolean;
        };
        const session = request.session;

        const user: IGetUser = await userHandler.getUser(
          session.user.id,
          includeWallets
        );

        return user;
      } catch (error) {
        return sendError(reply, { code: 500, error: error });
      }
    }
  );

  fastify.post(
    `${BASE_PATH}`,
    { preHandler: sessionMW },
    async (request, reply) => {
      try {
        const body: ISetUserData = request.body as ISetUserData;
        const session = request.session;

        const updateUser = await userHandler.setUserData(session.user.id, body);

        return updateUser;
      } catch (error) {
        return sendError(reply, { code: 500, error: error });
      }
    }
  );
}
