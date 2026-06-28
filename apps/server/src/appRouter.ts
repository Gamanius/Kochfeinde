import { GetUserSchema } from "@kochfeinde/shared";
import { publicProcedure, router } from "./trcp";
import { recipeRouter } from "./procs/recipe";

export const appRouter = router({
    recipe: recipeRouter
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;
