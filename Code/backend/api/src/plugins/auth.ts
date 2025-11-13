import { BetterAuthOptions } from "better-auth";
import auth from "../auth.js";

import FastifyBetterAuth, {
  type FastifyBetterAuthOptions,
} from "fastify-better-auth";

export const autoConfig: FastifyBetterAuthOptions<BetterAuthOptions> = {
  auth,
};

export default FastifyBetterAuth;
