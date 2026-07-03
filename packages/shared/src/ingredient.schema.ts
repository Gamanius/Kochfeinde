import { z } from "zod"

export const IngredientUnit = z.enum(["LITER", "GRAMM", "PIECE"])
export type IngredientUnitType = z.infer<typeof IngredientUnit>

export const IngredientSchema = z.object({
    name: z.string(),
    slug: z.string(),

    calories: z.number(),
    totalFat: z.number(),
    fatUnsaturated: z.number(),
    fatSaturated: z.number(),
    cholesterol: z.number(),

    totalCarbohydrates: z.number(),
    totalSugars: z.number(),

    dietaryFiber: z.number(),
    protein: z.number(),
    salt: z.number(),
    water: z.number(),

    vitaminA: z.number(),
    vitaminB12: z.number(),
    vitaminC: z.number(),
    vitaminD: z.number(),

    potassium: z.number(),
    sodium: z.number(),
    calcium: z.number(),
    iron: z.number(),

    density: z.number().nullable(),
})
export type IngredientType = z.infer<typeof IngredientSchema>;

export const QueryIngredientSchema = z.object({
    slug: z.string().lowercase()
})

export const FindIngredientSchema = z.object({
    name: z.string().lowercase().min(2)
})

export const IngredientListSchema = z.array(z.object({
    name: z.string(),
    slug: z.string(),

    calories: z.number(),
    totalFat: z.number(),
    fatUnsaturated: z.number(),
    fatSaturated: z.number(),
    cholesterol: z.number(),

    totalCarbohydrates: z.number(),
    totalSugars: z.number(),

    dietaryFiber: z.number(),
    protein: z.number(),
    salt: z.number(),
    water: z.number(),

    vitaminA: z.number(),
    vitaminB12: z.number(),
    vitaminC: z.number(),
    vitaminD: z.number(),

    potassium: z.number(),
    sodium: z.number(),
    calcium: z.number(),
    iron: z.number(),

    density: z.number().nullable(),
}))
export type IngredientListType = z.infer<typeof IngredientListSchema>;


export const InsertIngredientSchema = z.object({
    name: z.string().min(3, {message: "Der Name sollte min. 3 Buchstaben haben"}).max(50, "Der Name sollte nicht mehr als 50 Buchstaben haben"),

    calories: z.coerce.number().optional(),
    totalFat: z.coerce.number().optional(),
    fatUnsaturated: z.coerce.number().optional(),
    fatSaturated: z.coerce.number().optional(),
    cholesterol: z.coerce.number().optional(),

    totalCarbohydrates: z.coerce.number().optional(),
    totalSugars: z.coerce.number().optional(),

    dietaryFiber: z.coerce.number().optional(),
    protein: z.coerce.number().optional(),
    salt: z.coerce.number().optional(),
    water: z.coerce.number().optional(),

    vitaminA: z.coerce.number().optional(),
    vitaminB12: z.coerce.number().optional(),
    vitaminC: z.coerce.number().optional(),
    vitaminD: z.coerce.number().optional(),

    potassium: z.coerce.number().optional(),
    sodium: z.coerce.number().optional(),
    calcium: z.coerce.number().optional(),
    iron: z.coerce.number().optional(),

    density: z.coerce.number().optional(),
})
export type InsertIngredientSchemaType = z.infer<typeof InsertIngredientSchema>

export const PatchIngredientSchema = z.object({
    slug: z.string(),

    name: z.string().min(3, {message: "Der Name sollte min. 3 Buchstaben haben"}).max(50, "Der Name sollte nicht mehr als 50 Buchstaben haben"),

    calories: z.coerce.number().optional(),
    totalFat: z.coerce.number().optional(),
    fatUnsaturated: z.coerce.number().optional(),
    fatSaturated: z.coerce.number().optional(),
    cholesterol: z.coerce.number().optional(),

    totalCarbohydrates: z.coerce.number().optional(),
    totalSugars: z.coerce.number().optional(),

    dietaryFiber: z.coerce.number().optional(),
    protein: z.coerce.number().optional(),
    salt: z.coerce.number().optional(),
    water: z.coerce.number().optional(),

    vitaminA: z.coerce.number().optional(),
    vitaminB12: z.coerce.number().optional(),
    vitaminC: z.coerce.number().optional(),
    vitaminD: z.coerce.number().optional(),

    potassium: z.coerce.number().optional(),
    sodium: z.coerce.number().optional(),
    calcium: z.coerce.number().optional(),
    iron: z.coerce.number().optional(),

    density: z.coerce.number().optional(),
})
export type PatchIngredientSchemaType = z.infer<typeof PatchIngredientSchema>

