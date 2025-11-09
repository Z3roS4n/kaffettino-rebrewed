// src/routes/index.ts

import type { FastifyInstance } from "fastify";
import { readdirSync } from "fs";

interface RoutesIndex {
  version: string;
  routes: string[];
}

export default async function routes(fastify: FastifyInstance) {
  const routes: RoutesIndex[] = [];
  const folders = readdirSync("./");
  const versions: string[] = folders.filter((folder: string) =>
    folder.startsWith("v")
  );
  versions.forEach((version) => {
    const dirRoutes = readdirSync(`./${version}`);
    routes.push({ version, routes: dirRoutes });
  });

  const importedRoutes = await Promise.all(
    routes.map(async (routeIndex) => {
      const imported = await Promise.all(
        routeIndex.routes.map(
          (route) => import(`./${routeIndex.version}/${route}`)
        )
      );
      return {
        version: routeIndex.version,
        routes: imported,
      };
    })
  );

  importedRoutes.forEach((version) => {
    version.routes.forEach((route) => {
      fastify.register(route, { prefix: `/${version}/${route.toString()}` });
      console.log(`Route ${route} registered successfully!`);
    });
  });
}
