import { router } from "./trcp";
import { recipeRouter } from "./procs/recipe";
import { ingredientRouter } from "./procs/ingredient";
import { authRouter } from "./procs/auth";

export const appRouter = router({
    recipe: recipeRouter,
    ingredient: ingredientRouter,
    auth: authRouter
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;
