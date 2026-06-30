import { useTRPC } from "#/query/trcp"
import { useSuspenseQuery } from "@tanstack/react-query"

export default function IngredientSite({slug}:{slug:string}) {
    const trcp = useTRPC()
    const res = useSuspenseQuery(trcp.ingredient.get.queryOptions({slug}))

    return <article className="prose">
        <div className="flex justify-between">
        <h2>
            {res.data.name}
        </h2>
        </div>
        <p>
        </p>
    </article>
}