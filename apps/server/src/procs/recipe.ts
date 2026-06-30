import { InsertRecipeSchema, PatchRecipeSchema, QueryRecipeSchema, RecipeSchema, type RecipeListType, type RecipeType } from "@kochfeinde/shared";
import { protectedProcedure, publicProcedure, router } from "../trcp";
import { db } from "../db/database"
import {recipeTable} from "../db/schema"
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { devNull } from "os";

export const recipeRouter = router({
    list: publicProcedure.query(async (): Promise<RecipeListType> => {
        const res = await db.select().from(recipeTable)
        const t = res.map(r => (
            {
                ...r
            }
        ))

        return t
    }),
    get: publicProcedure.input(QueryRecipeSchema).query(async (opt): Promise<RecipeType> => {
        const res = await db.select().from(recipeTable)
            .where(eq(recipeTable.slug, opt.input.slug))

        console.log(res)
        if (res.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND"
            })
        }

        const recipe = res[0]

        return {
            name: recipe.name,
            slug: recipe.slug,
            markdown: recipe.markdown || ""
        }
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
    }),
    patch: protectedProcedure.input(PatchRecipeSchema).mutation(async (opt) => {
        const res = await db.update(recipeTable).set({
            markdown: opt.input.markdown,
            name: opt.input.name
        })
        .where(eq(recipeTable.slug, opt.input.slug))
        .returning({
            slug: recipeTable.slug
        })

        if (res.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND"
            })
        }
        
        return {
            name: res.at(0)
        }
    })
});