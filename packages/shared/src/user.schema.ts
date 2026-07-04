// packages/shared/src/user.ts

import { z } from "zod";

export const LoginUserSchema = z.object({
    name: z.string(),
    password: z.string()
});

export type LoginUserType =  z.infer<typeof LoginUserSchema>;


export const RegisterUserSchema = z.object({
    name: z.string(),
    password: z.string(),
    register_code: z.string()
})

export type RegisterUserType = z.infer<typeof RegisterUserSchema>;