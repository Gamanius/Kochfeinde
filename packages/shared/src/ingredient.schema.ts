import { z } from "zod"

export const IngredientSchema = z.object({
    name: z.string(),
    slug: z.string(),
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
    slug: z.string()
}))
export type IngredientListType = z.infer<typeof IngredientListSchema>;


export const InsertIngredientSchema = z.object({
    name: z.string().min(3, {error: "Der Name sollte min. 3 Buchstaben haben"}).max(50, "Der Name sollte nicht mehr als 50 Buchstaben haben")
})
export type InsertIngredientSchemaType = z.infer<typeof InsertIngredientSchema>