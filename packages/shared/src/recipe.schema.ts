import { z } from "zod";

export const RecipeListSchema = z.array(z.object({
    name: z.string(),
    slug: z.string()
}))
export type RecipeListType = z.infer<typeof RecipeListSchema>;

export const RecipeSchema = z.object({
    name: z.string(),
    slug: z.string(),

    markdown: z.string()
})
export type RecipeType = z.infer<typeof RecipeSchema>;

export const QueryRecipeSchema = z.object({
    slug: z.string().lowercase()
})

export const InsertRecipeSchema = z.object({
    name: z.string().min(3, {error: "Beep Beep you will be deleted"})
})
export type InsertRecipeSchemaType = z.infer<typeof InsertRecipeSchema>

export const PatchRecipeSchema = z.object({
    slug: z.string(),
    name: z.string().min(3, {error: "Beep Beep you will be deleted"}),
    markdown: z.string()
})
export type PatchRecipeSchemaType = z.infer<typeof PatchRecipeSchema>

