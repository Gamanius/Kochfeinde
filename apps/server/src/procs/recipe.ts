import { InsertRecipeSchema, mergeIngredients, parseIngredient, PatchRecipeSchema, QueryRecipeSchema, type RecipeListType, type RecipeType } from "@kochfeinde/shared";
import { protectedProcedure, publicProcedure, router } from "../trcp";
import { db } from "../db/database"
import {ingredientTable, ingredientToRecipe, recipeTable, userTable} from "../db/schema"
import { TRPCError } from "@trpc/server";
import { eq, inArray } from "drizzle-orm";
import { getUserId } from "../auth/cookies";
import slugify from "slugify";


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
                undertitle: r.recipe.undertitle,
                tags: r.recipe.tags,
                portion_num: r.recipe.portion_num || 4
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
            undertitle: recipe.recipe.undertitle,
            tags: recipe.recipe.tags,
            portion_num: recipe.recipe.portion_num || 4,
            portion_string: recipe.recipe.portion_string || "Personen"
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
            slug: slugify(opt.input.name),
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
        const undertitle_normalized = opt.input.undertitle ? opt.input.undertitle.trim() : ""
        const res = await db.update(recipeTable).set({
            markdown: opt.input.markdown,
            name: opt.input.name,
            time_active: opt.input.active_time,
            time_total: opt.input.total_time,
            undertitle: undertitle_normalized === "" ? null : undertitle_normalized,
            tags: opt.input.tags,
            portion_num: opt.input.portion_num,
            portion_string: opt.input.portion_string
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

        const ingredients = mergeIngredients(parseIngredient(opt.input.markdown))

        // Separate DB-linked ingredients from custom ingredients
        const dbIngredients = ingredients.filter(i => i.ingredient_slug !== null)

        // Get unique ingredient slugs for DB lookup (exclude nulls)
        const uniqueSlugs = [...new Set(dbIngredients.map(i => i.ingredient_slug as string))]

        await db.delete(ingredientToRecipe).where(eq(ingredientToRecipe.recipeId, recipe.id))

        // Only query DB ingredients when there are actual slugs to look up
        if (uniqueSlugs.length > 0) {
            const all_ings = await db.select()
                .from(ingredientTable)
                .where(inArray(ingredientTable.slug, uniqueSlugs))

            // Check that every ingredient exists in the database
            if (uniqueSlugs.length !== all_ings.length) {
                const foundSlugs = new Set(all_ings.map(i => i.slug))
                const missingSlugs = uniqueSlugs.filter(s => !foundSlugs.has(s))
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: `Diese Zutaten existieren nicht in der Datenbank: ${missingSlugs.join(", ")}`
                })
            }

            const slugToId = Object.fromEntries(all_ings.map(i => [i.slug, i.id]))

            await db.insert(ingredientToRecipe).values(dbIngredients.map(i => {
                return {
                    recipeId: recipe.id,
                    ingredientId: slugToId[i.ingredient_slug as string],
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