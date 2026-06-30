// packages/shared/src/user.ts

import { z } from "zod";

export const GetUserSchema = z.object();

export type CreateUserInput =  z.infer<typeof GetUserSchema>;



