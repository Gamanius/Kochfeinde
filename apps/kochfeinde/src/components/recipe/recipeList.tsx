import { useTRPC } from "#/query/trcp"
import { useSuspenseQuery } from "@tanstack/react-query"
import RecipeLink from "./recipeLink";

export default function RecipeList() {
    const trcp = useTRPC()
    const res = useSuspenseQuery(trcp.recipe.list.queryOptions())
    return (
        <>  
            <section className="grid grid-cols-3 gap-2">
                {res.data.map(r => <RecipeLink key={r.name} recipe={r}></RecipeLink>)}
            </section>
        </>
    );
}