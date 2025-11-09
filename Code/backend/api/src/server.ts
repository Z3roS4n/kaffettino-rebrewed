import Fastify from "fastify";

import corsPlugin from "./plugins/cors.js";
import prismaPlugin from "./plugins/prisma.js";
import authPlugin from "./plugins/auth.js";
import routes from "./routes/index.js";

const fastify = Fastify();

//fastify.register(corsPlugin);
fastify.register(prismaPlugin);
fastify.register(authPlugin);
fastify.register(routes);

fastify.listen(
  { port: Number(process.env["PORT"]) || 4000 },
  (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`🚀 Server ready at ${address}`);
  }
);
