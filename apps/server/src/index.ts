import { type CreateHTTPContextOptions, createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from 'cors';
import { appRouter } from "./appRouter";

export const createContext = async (opts: CreateHTTPContextOptions) => {
    return {
      httpCtx: opts,
      userId: null as string | null,
    }
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// create server
createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
}).listen(3000);