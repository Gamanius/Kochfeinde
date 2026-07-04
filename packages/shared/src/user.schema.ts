// packages/shared/src/user.ts

import { z } from "zod";

export const LoginUserSchema = z.object({
    name: z.string(),
    password: z.string()
});

export type LoginUserType =  z.infer<typeof LoginUserSchema>;

export const RegisterUserSchema = z.object({
    name: z.string().min(3),
    displayname: z.string().min(3),
    password: z.string().min(4),
    register_code: z.string()
})

export type RegisterUserType = z.infer<typeof RegisterUserSchema>;

export const ChangePasswordSchema = z.object({
    oldPassword: z.string(),
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
})
export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;

export const ChangeDisplayNameSchema = z.object({
    name: z.string().min(3)
})
export type ChangeDisplayNameType = z.infer<typeof ChangeDisplayNameSchema>;
