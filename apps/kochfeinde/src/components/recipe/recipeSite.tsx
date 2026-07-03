import { useTRPC } from "#/query/trcp"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, redirect } from "@tanstack/react-router"
import {SquarePen} from "lucide-react"
import { renderRecipe } from "./recipeParser"




export default function RecipeSite({slug}:{slug:string}) {
    const trcp = useTRPC()
    const res = useSuspenseQuery(trcp.recipe.get.queryOptions({slug}))
    if (res.error !== null) {
        throw Error("Das ist nicht gut")
    }
    return <article className="flex justify-center min-w-full">
        <div className="mx-4  p-10 max-w-4xl w-full shadow-2xl ">
            <div className="flex justify-between border-b pb-2 items-end">
                <h1 className="">
                    {res.data.name}
                </h1> 
                <Link to="/recipe/$slug/edit" params={{slug: slug}} className="btn btn-square btn-ghost">
                    <SquarePen />
                </Link>
            </div>
            <div className="recipe-content" dangerouslySetInnerHTML={{
                __html: renderRecipe(res.data.markdown)
            }}></div>
        </div>
    </article>
}