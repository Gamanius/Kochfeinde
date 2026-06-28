import { InsertRecipeSchema, type GetRecipeSchemaType } from "@kochfeinde/shared";
import { protectedProcedure, publicProcedure, router } from "../trcp";
import { db } from "../db/database"
import {recipeTable} from "../db/schema"
import { TRPCError } from "@trpc/server";

export const recipeRouter = router({
    list: publicProcedure.query(async (): Promise<GetRecipeSchemaType> => {
        const res = await db.select().from(recipeTable)
        const t = res.map(res => (
            {
                name: res.name
            }
        ))

        return t
    }),
    insert: protectedProcedure.input(InsertRecipeSchema).mutation(async (opt) => {
        const res = await db.insert(recipeTable).values({
            name: opt.input.name,
            slug: opt.input.name.toLowerCase().replaceAll(" ", "_")
        }).returning({
            id: recipeTable.id,
            slug: recipeTable.slug
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
});