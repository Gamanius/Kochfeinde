import { ChangeDisplayNameSchema, ChangePasswordSchema, LoginUserSchema, RegisterUserSchema } from "@kochfeinde/shared";
import { protectedProcedure, publicProcedure, router } from "../trcp";
import { TRPCError } from "@trpc/server";
import { db } from "../db/database";
import { userTable } from "../db/schema";
import { eq } from "drizzle-orm";
import {hashPassword, verifyPassword} from "../auth/password"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../auth/tokens"
import { clearCookies, getRefreshToken, getUserId, setCookies } from "../auth/cookies"


const REGISTER_CODE = process.env.REGISTER_CODE!;

export const authRouter = router({
    get: publicProcedure.query(async (opt) => {
        const refresh = getRefreshToken(opt.ctx.httpCtx.req)
        if (refresh === null) {
            return null
        }

        const sub = verifyRefreshToken(refresh)

        if (sub === null) {
            return null
        }

        const user = await db.select().from(userTable).where(eq(userTable.name, sub.sub))

        if (user.length === 0) {
            return null
        }

        return {
            name: sub.sub,
            displayname: user[0].displayName,
            creationdate: user[0].creation_date
        }

    }),
    login: publicProcedure.input(LoginUserSchema).mutation(async (opt) => {
        const user = await db.select().from(userTable).where(eq(userTable.name, opt.input.name))

        if (user.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Nutzername oder Passwort falsch"
            })
        }

        const pass = await verifyPassword(opt.input.password, user[0].passwordHash)
        if (!pass) {            
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Nutzername oder Passwort falsch"
            })
        }

        setCookies(opt.ctx.httpCtx.res, generateAccessToken(user[0].name), generateRefreshToken(user[0].name))
    }),
    register: publicProcedure.input(RegisterUserSchema).mutation(async (opt) => {
        if (opt.input.register_code !== REGISTER_CODE) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Der Registrierungs Code ist falsch"
            })
        }

        const duplicate = await db.select().from(userTable).where(eq(userTable.name, opt.input.name))
        if (duplicate.length > 0) {
            throw new TRPCError({
                code: "CONFLICT",
                message: "Der Name ist schon registriert"
            })
        }

        const name = await db.insert(userTable).values({
            name: opt.input.name,
            displayName: opt.input.displayname,
            passwordHash: await hashPassword(opt.input.password)
        }).returning({
            name: userTable.name
        })

        if (name.length === 0) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR"
            })
        }

        setCookies(opt.ctx.httpCtx.res, generateAccessToken(name[0].name), generateRefreshToken(name[0].name))
    }),
    refresh: publicProcedure.mutation(async (opt) => {
        const refresh = getRefreshToken(opt.ctx.httpCtx.req)
        if (refresh === null) {
            throw new TRPCError({
                code: "UNAUTHORIZED"
            })
        }

        const sub = verifyRefreshToken(refresh)

        if (sub === null) {
            throw new TRPCError({
                code: "UNAUTHORIZED"
            })
        }


        setCookies(opt.ctx.httpCtx.res, generateAccessToken(sub.sub), generateRefreshToken(sub.sub))
    }),
    logout: publicProcedure.mutation(async (opt) => {
        clearCookies(opt.ctx.httpCtx.res)
    }),
    updatepassword: protectedProcedure.input(ChangePasswordSchema).mutation(async (opt) => {
        const userid = getUserId(opt.ctx.httpCtx.req)
        const user = await db.select().from(userTable).where(eq(userTable.name, userid))

        if (user.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "We shouldn't be here. You are logged in but still I can't find you in my database"
            })
        }

        const valid = await verifyPassword(opt.input.oldPassword, user[0].passwordHash)
        if (!valid) {
            throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "Altes Passwort ist falsch"
            })
        }

        const pass = await db.update(userTable).set({
            passwordHash: await hashPassword(opt.input.password)
        }).returning()


        if (pass.length === 0) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR"
            })
        }

        return {
            name: pass[0].name
        }
    }),
    updatedisplayname: protectedProcedure.input(ChangeDisplayNameSchema).mutation(async (opt) => {
        const userid = getUserId(opt.ctx.httpCtx.req)
        const user = await db.select().from(userTable).where(eq(userTable.name, userid))

        if (user.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "We shouldn't be here. You are logged in but still I can't find you in my database"
            })
        }

        const pass = await db.update(userTable).set({
            displayName: opt.input.name
        }).returning()


        if (pass.length === 0) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR"
            })
        }

        return {
            name: pass[0].name
        }
    }),
})