import { GetUserSchema } from "@kochfeinde/shared";
import { publicProcedure, router } from "./trcp";
import { recipeRouter } from "./procs/recipe";
import { ingredientRouter } from "./procs/ingredient";

export const appRouter = router({
    recipe: recipeRouter,
    ingredient: ingredientRouter
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;
