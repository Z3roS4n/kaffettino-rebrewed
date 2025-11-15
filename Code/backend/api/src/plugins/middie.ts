import fp from "fastify-plugin";
import middie from "@fastify/middie";

const middiePlugin = fp(async (fastify) => {
  fastify.register(middie, { hook: "onRequest" });
});

export default middiePlugin;
