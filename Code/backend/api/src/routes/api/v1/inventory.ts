import type { FastifyInstance } from "fastify";
import { getSession } from "../../../utils/session.js";
import userHandler, {
  IGetUser,
  ISetUserData,
} from "../../../utils/user-handler.js";
import sendError from "../../../utils/error-handler.js";
import sessionMW from "../../../middlewares/session.js";
import permissionsMW from "../../../middlewares/permissions.js";
import { Role } from "../../../generated/prisma/client.js";

const BASE_PATH = "/inventory";
const ROLES_NEEDED = [Role.ADMIN, Role.TREASURER];

export default async function inventoryRoutes(fastify: FastifyInstance) {
  fastify.get(
    `${BASE_PATH}`,
    { preHandler: [sessionMW, permissionsMW(ROLES_NEEDED)] },
    async (request, reply) => {
      try {
        const { aulettaId, productId } = request.query as {
          aulettaId?: number;
          productId: number;
        };

        return "";
      } catch (error) {
        return sendError(reply, { code: 500, error: error });
      }
    }
  );
}
