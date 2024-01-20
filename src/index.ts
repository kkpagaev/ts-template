import Fastify from "fastify";
import {
  fastifyTRPCPlugin,
  FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import { Pool } from "pg";
import { AppRouter, appRouter } from "./router";
import { createContext } from "./context";

async function main() {
  const f = Fastify({
    logger: true,
  });
  f.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });
  const pool = new Pool({
    connectionString: "postgresql://user:user@localhost:1252/user",
  });

  await pool.connect();

  f.get("/", async () => {
    return {
      hello: "world",
    };
  });

  f.listen({
    port: 3000,
  });
}

main();
