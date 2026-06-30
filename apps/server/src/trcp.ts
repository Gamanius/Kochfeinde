/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { initTRPC, TRPCError } from '@trpc/server';
import type {Context} from "./index"

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure.use(async (opts) => {
    return opts.next()
});

export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
    const {ctx} = opts;

    if (ctx.user === null) {
        throw new TRPCError({
            code: "UNAUTHORIZED"
        })
    }

    return opts.next({
        
    })
})