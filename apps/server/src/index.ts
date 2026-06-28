import { type CreateHTTPContextOptions, createHTTPServer } from "@trpc/server/adapters/standalone";
import cors from 'cors';
import { appRouter } from "./appRouter";

export const createContext = async (opts: CreateHTTPContextOptions) => {
    // Example: extract a session token from the request headers
    
    return {
      req: opts,
      user: "admin"
    }
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// create server
createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext,
}).listen(3000);