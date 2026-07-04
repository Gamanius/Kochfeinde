/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { initTRPC, TRPCError } from '@trpc/server';
import type {Context} from "./index"
import { getAccessToken, getRefreshToken,  setCookies,  } from './auth/cookies';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from './auth/tokens';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure.use(async (opts) => {
    return opts.next()
});

export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
    const { ctx } = opts;

    // 1. Try access token first
    const accessToken = getAccessToken(ctx.httpCtx.req);
    if (accessToken) {
        const verified = verifyAccessToken(accessToken);
        console.log("Access ", accessToken)
        if (verified) {
            return opts.next();
        }
    }

    // 2. Access token expired or missing — try refresh token
    const refreshToken = getRefreshToken(ctx.httpCtx.req);
    if (refreshToken) {
        const refreshVerified = verifyRefreshToken(refreshToken);
        if (refreshVerified) {
            // Refresh is still valid — issue new tokens and proceed
            const userId = refreshVerified.sub;
            console.log("Refresh ", refreshToken)

            setCookies(ctx.httpCtx.res, generateAccessToken(userId), generateRefreshToken(userId))
            return opts.next();
        }
    }

    // 3. Nothing works — real UNAUTHORIZED
    throw new TRPCError({ code: "UNAUTHORIZED" });
})