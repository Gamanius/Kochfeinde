import { FindIngredientSchema, InsertIngredientSchema, QueryIngredientSchema, type IngredientListType, type IngredientType } from "@kochfeinde/shared";
import { protectedProcedure, publicProcedure, router } from "../trcp";
import { db } from "../db/database"
import {ingredientTable} from "../db/schema"
import { TRPCError } from "@trpc/server";
import { eq, ilike } from "drizzle-orm";

export const ingredientRouter = router({
    list: publicProcedure.query(async (): Promise<IngredientListType> => {
        const res = await db.select().from(ingredientTable)
        const t = res.map(r => (
            {
                ...r
            }
        ))

        return t
    }),
    get: publicProcedure.input(QueryIngredientSchema).query(async (opt): Promise<IngredientType> => {
        const res = await db.select().from(ingredientTable)
            .where(eq(ingredientTable.slug, opt.input.slug))

        console.log(res)
        if (res.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND"
            })
        }

        const ingredient = res[0]

        return {
            name: ingredient.name,
            slug: ingredient.slug,
        }
    }),
    find: publicProcedure.input(FindIngredientSchema).query(async (opt): Promise<IngredientListType> => {
        const res = await db.select().from(ingredientTable)
            .where(ilike(ingredientTable.name, `%${opt.input.name}%`))

        if (res.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND"
            })
        }

        return res.map(r => ({
            name: r.name,
            slug: r.slug,
        }))
    }),
    insert: protectedProcedure.input(InsertIngredientSchema).mutation(async (opt) => {
        const res = await db.insert(ingredientTable).values({
            name: opt.input.name,
            slug: opt.input.name.toLowerCase().replaceAll(" ", "_")
        }).returning({
            id: ingredientTable.id,
            slug: ingredientTable.slug
        }).onConflictDoNothing()

        if (res.length === 0) {
            throw new TRPCError({
                code: "CONFLICT"
            })
        }

        return {
            name: res.at(0)
        }
    })
})