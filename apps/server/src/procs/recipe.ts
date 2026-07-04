import { InsertRecipeSchema, parseIngredient, PatchRecipeSchema, QueryRecipeSchema, type RecipeListType, type RecipeType } from "@kochfeinde/shared";
import { protectedProcedure, publicProcedure, router } from "../trcp";
import { db } from "../db/database"
import {ingredientTable, ingredientToRecipe, recipeTable, userTable} from "../db/schema"
import { TRPCError } from "@trpc/server";
import { eq, inArray } from "drizzle-orm";
import { getUserId } from "../auth/cookies";


export const recipeRouter = router({
    list: publicProcedure.query(async (): Promise<RecipeListType> => {
        const res = await db.select()
            .from(recipeTable)
            .innerJoin(userTable, eq(recipeTable.userId, userTable.id))

        const t = res.map(r => (
            {
                name: r.recipe.name,
                slug: r.recipe.slug,
                author: r.user.displayName,
                total_time: r.recipe.time_total,
                undertitle: r.recipe.undertitle
            }
        ))

        return t
    }),
    get: publicProcedure.input(QueryRecipeSchema).query(async (opt): Promise<RecipeType> => {
        const res = await db.select().from(recipeTable)
            .where(eq(recipeTable.slug, opt.input.slug))
            .innerJoin(userTable, eq(recipeTable.userId, userTable.id))

        if (res.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND"
            })
        }

        const recipe = res[0]

        return {
            name: recipe.recipe.name,
            slug: recipe.recipe.slug,
            markdown: recipe.recipe.markdown || "",
            author: recipe.user.displayName,
            active_time: recipe.recipe.time_active,
            total_time: recipe.recipe.time_total,
            undertitle: recipe.recipe.undertitle
        }
    }),
    insert: protectedProcedure.input(InsertRecipeSchema).mutation(async (opt) => {
        const userid = getUserId(opt.ctx.httpCtx.req)
        const user = await db.select().from(userTable).where(eq(userTable.name, userid))

        if (user.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "We shouldn't be here. You are logged in but still I can't find you in my database"
            })
        }

        const res = await db.insert(recipeTable).values({
            name: opt.input.name,
            slug: opt.input.name.toLowerCase().replaceAll(" ", "_"),
            userId: user[0].id
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
            recipe: res.at(0),
        }
    }),
    patch: protectedProcedure.input(PatchRecipeSchema).mutation(async (opt) => {
        const res = await db.update(recipeTable).set({
            markdown: opt.input.markdown,
            name: opt.input.name,
            time_active: opt.input.active_time,
            time_total: opt.input.total_time,
            undertitle: opt.input.undertitle
        })
        .where(eq(recipeTable.slug, opt.input.slug))
        .returning({
            id: recipeTable.id,
            slug: recipeTable.slug
        })

        if (res.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND"
            })
        }

        const recipe = res[0]

        const ingredients = parseIngredient(opt.input.markdown)

        await db.delete(ingredientToRecipe).where(eq(ingredientToRecipe.recipeId, recipe.id))
        const all_ings = await db.select()
            .from(ingredientTable)
            .where(inArray(ingredientTable.slug, ingredients.map(i => i.ingredient_slug)))

        const slugToId = Object.fromEntries(all_ings.map(i => [i.slug, i.id]))

        if (ingredients.length > 0) {
            await db.insert(ingredientToRecipe).values(ingredients.map(i => {
                return {
                    recipeId: recipe.id,
                    ingredientId: slugToId[i.ingredient_slug],
                    quantity: i.quantity,
                    unit: i.unit,
                }
            }))
        }
        
        return {
            name: res.at(0)
        }
    }),
    delete: protectedProcedure.input(QueryRecipeSchema).mutation(async (opt) => {
        const res = await db.delete(recipeTable)
            .where(eq(recipeTable.slug, opt.input.slug))
            .returning({
                id: recipeTable.id,
                slug: recipeTable.slug
            })
        
        if (res.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND"
            })
        }

        return {
            slug: res[0].slug
        }

    })
});