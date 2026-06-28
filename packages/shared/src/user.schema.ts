// packages/shared/src/user.ts

import { z } from "zod";

export const GetUserSchema = z.object();

export type CreateUserInput =  z.infer<typeof GetUserSchema>;

export const GetRecipeSchema = z.array(z.object({
    name: z.string()
}))
export type GetRecipeSchemaType = z.infer<typeof GetRecipeSchema>;

export const InsertRecipeSchema = z.object({
    name: z.string().min(3, {error: "Beep Beep you will be deleted"})
})
export type InsertRecipeSchemaType = z.infer<typeof InsertRecipeSchema>