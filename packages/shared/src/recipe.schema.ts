import { z } from "zod";
import { recipeTags } from "./recipe";

export const RecipeTagSchema = z.enum(recipeTags);
export type RecipeTagType = z.infer<typeof RecipeTagSchema>;

export const RecipeListSchema = z.array(z.object({
    name: z.string(),
    slug: z.string(),
    total_time: z.int(),
    undertitle: z.string().nullable(),
    author: z.string(),
    tags: z.array(RecipeTagSchema).nullable(),
}))
export type RecipeListType = z.infer<typeof RecipeListSchema>;

export const RecipeSchema = z.object({
    name: z.string(),
    slug: z.string(),

    total_time: z.int(),
    active_time: z.int(),
    undertitle: z.string().nullable(),

    markdown: z.string(),
    author: z.string(),

    portion_num: z.number(),
    portion_string: z.string(),

    tags: z.array(RecipeTagSchema).nullable(),
})
export type RecipeType = z.infer<typeof RecipeSchema>;

export const QueryRecipeSchema = z.object({
    slug: z.string().lowercase()
})

export const InsertRecipeSchema = z.object({
    name: z.string().min(3)
})
export type InsertRecipeSchemaType = z.infer<typeof InsertRecipeSchema>

export const PatchRecipeSchema = z.object({
    slug: z.string(),
    name: z.string().min(3),
    markdown: z.string(),

    total_time: z.int(),
    active_time: z.int(),
    undertitle: z.string().nullable(),

    portion_num: z.number(),
    portion_string: z.string(),

    tags: z.array(RecipeTagSchema).nullable(),
})
export type PatchRecipeSchemaType = z.infer<typeof PatchRecipeSchema>

