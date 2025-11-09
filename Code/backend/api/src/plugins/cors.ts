import fp from "fastify-plugin";
import cors from "@fastify/cors";

const corsPlugin = fp(async (fastify) => {
  fastify.register(cors, {
    origin: "*", // o il tuo dominio
    methods: ["GET", "POST", "PUT", "DELETE"],
  });
});

export default corsPlugin;
