import { FindIngredientSchema, InsertIngredientSchema, PatchIngredientSchema, QueryIngredientSchema, type IngredientListType, type IngredientType } from "@kochfeinde/shared";
import { protectedProcedure, publicProcedure, router } from "../trcp";
import { db } from "../db/database"
import {ingredientTable} from "../db/schema"
import { TRPCError } from "@trpc/server";
import { DrizzleQueryError, eq, ilike } from "drizzle-orm";
import slugify from "slugify";

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

        if (res.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND"
            })
        }

        const ingredient = res[0]

        return {
            name: ingredient.name,
            slug: ingredient.slug,

            calories: ingredient.calories,
            totalFat: ingredient.totalFat,
            fatUnsaturated: ingredient.fatUnsaturated,
            fatSaturated: ingredient.fatSaturated,
            cholesterol: ingredient.cholesterol,

            totalCarbohydrates: ingredient.totalCarbohydrates,
            totalSugars: ingredient.totalSugars,

            dietaryFiber: ingredient.dietaryFiber,
            protein: ingredient.protein,
            salt: ingredient.salt,
            water: ingredient.water,

            vitaminA: ingredient.vitaminA,
            vitaminB12: ingredient.vitaminB12,
            vitaminC: ingredient.vitaminC,
            vitaminD: ingredient.vitaminD,

            potassium: ingredient.potassium,
            sodium: ingredient.sodium,
            calcium: ingredient.calcium,
            iron: ingredient.iron,

            density: ingredient.density,
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
            ...r
        }))
    }),
    insert: protectedProcedure.input(InsertIngredientSchema).mutation(async (opt) => {
        const newSlug = slugify(opt.input.name, {
            locale: "de",
            lower: true,
            trim: true
        })
        const res = await db.insert(ingredientTable).values({
            name: opt.input.name,
            slug: newSlug,

            calories: opt.input.calories ?? 0,
            totalFat: opt.input.totalFat ?? 0,
            fatUnsaturated: opt.input.fatUnsaturated ?? 0,
            fatSaturated: opt.input.fatSaturated ?? 0,
            cholesterol: opt.input.cholesterol ?? 0,

            totalCarbohydrates: opt.input.totalCarbohydrates ?? 0,
            totalSugars: opt.input.totalSugars ?? 0,

            dietaryFiber: opt.input.dietaryFiber ?? 0,
            protein: opt.input.protein ?? 0,
            salt: opt.input.salt ?? 0,
            water: opt.input.water ?? 0,

            vitaminA: opt.input.vitaminA ?? 0,
            vitaminB12: opt.input.vitaminB12 ?? 0,
            vitaminC: opt.input.vitaminC ?? 0,
            vitaminD: opt.input.vitaminD ?? 0,

            potassium: opt.input.potassium ?? 0,
            sodium: opt.input.sodium ?? 0,
            calcium: opt.input.calcium ?? 0,
            iron: opt.input.iron ?? 0,

            density: opt.input.density ?? 1,
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
    }),
    update: protectedProcedure.input(PatchIngredientSchema).mutation(async (opt) => {
        const newSlug = slugify(opt.input.name, {
            locale: "de",
            lower: true,
            trim: true
        })
        const res = await db.update(ingredientTable).set({
            name: opt.input.name,
            slug: newSlug,

            calories: opt.input.calories ?? 0,
            totalFat: opt.input.totalFat ?? 0,
            fatUnsaturated: opt.input.fatUnsaturated ?? 0,
            fatSaturated: opt.input.fatSaturated ?? 0,
            cholesterol: opt.input.cholesterol ?? 0,

            totalCarbohydrates: opt.input.totalCarbohydrates ?? 0,
            totalSugars: opt.input.totalSugars ?? 0,

            dietaryFiber: opt.input.dietaryFiber ?? 0,
            protein: opt.input.protein ?? 0,
            salt: opt.input.salt ?? 0,
            water: opt.input.water ?? 0,

            vitaminA: opt.input.vitaminA ?? 0,
            vitaminB12: opt.input.vitaminB12 ?? 0,
            vitaminC: opt.input.vitaminC ?? 0,
            vitaminD: opt.input.vitaminD ?? 0,

            potassium: opt.input.potassium ?? 0,
            sodium: opt.input.sodium ?? 0,
            calcium: opt.input.calcium ?? 0,
            iron: opt.input.iron ?? 0,

            density: opt.input.density ?? 1,
        })
        .where(eq(ingredientTable.slug, opt.input.slug))
        .returning({
            id: ingredientTable.id,
            slug: ingredientTable.slug,
        })

        if (res.length === 0) {
            throw new TRPCError({
                code: "NOT_FOUND"
            })
        }

        return {
            name: res.at(0)
        }
    }),
    delete: protectedProcedure.input(QueryIngredientSchema).mutation(async (opt) => {
    try {
        const res = await db.delete(ingredientTable)
            .where(eq(ingredientTable.slug, opt.input.slug))
            .returning({
                id: ingredientTable.id,
                slug: ingredientTable.slug,
            })

            if (res.length === 0) {
                throw new TRPCError({
                    code: "NOT_FOUND"
                })
            }

            return {
                slug: res[0].slug
            }
        } catch (err) {
            if (
                err instanceof DrizzleQueryError &&
                err.cause &&
                typeof err.cause === "object" &&
                "code" in err.cause &&
                (err.cause as { code: string }).code === "23001"
            ) {
                throw new TRPCError({
                    code: "CONFLICT",
                    message: "Diese Zutat wird noch in einem Rezept verwendet und kann nicht gelöscht werden."
                })
            }
            throw err
        }
    })
})