import Fastify from "fastify";

import prismaPlugin from "./plugins/prisma.js";
import fastifyCors from "@fastify/cors";
import autoload from "@fastify/autoload";
import path, { join, dirname } from "path";
import fs from "fs";

import { fileURLToPath } from "url";

// Ottieni il path della cartella corrente (equivalente a __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify();

async function buildServer() {
  fastify.register(prismaPlugin);
  const routesPath = join(__dirname, "routes");
  fs.readdirSync(routesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .forEach((folder) => {
      const prefix = `/${folder.name}`;
      console.log("Route caricata: ", prefix);
      fastify.register(autoload, {
        dir: join(routesPath, folder.name),
        options: { prefix }, // aggiunge il prefisso alle rotte della cartella
      });
    });

  return fastify;
}

async function start() {
  try {
    await buildServer();
    await fastify.listen({ port: 3000, host: "0.0.0.0" });

    const address = fastify.server.address();
    const port = typeof address === "object" && address ? address.port : 3000;

    console.log(`🚀 Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
