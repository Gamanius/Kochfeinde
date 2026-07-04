import { useTRPC } from "#/query/trcp"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link, redirect } from "@tanstack/react-router"
import {CircleUserRound, Lock, Quote, SquarePen, Timer, Zap} from "lucide-react"
import { renderRecipe } from "./recipeParser"




export default function RecipeSite({slug}:{slug:string}) {
    const trcp = useTRPC()
    const res = useSuspenseQuery(trcp.recipe.get.queryOptions({slug}))
    const user = useSuspenseQuery(trcp.auth.get.queryOptions())
    if (res.error !== null) {
        throw Error("Das ist nicht gut")
    }
    return <article className="flex justify-center min-w-full">
        <div className="mx-4  p-10 max-w-4xl w-full shadow-2xl ">
            <div className="flex justify-between border-b pb-2 items-end">
                <h1 className="">
                    {res.data.name}
                </h1> 
                {user.data === null ? 
                <div className="tooltip tooltip-left tooltip-error" data-tip="Logge dich ein um zu bearbeiten"> 
                <button className="btn btn-square btn-disabled">
                    <Lock/>    
                </button> </div>:
                <Link to="/recipe/$slug/edit" params={{slug: slug}} className="btn btn-square btn-ghost">
                    <SquarePen />
                </Link>
                }
            </div>
            {res.data.undertitle === null ? <></>: 
            <span className="inline-flex items-center gap-1 mt-1"><Quote /> <i>{res.data.undertitle}</i></span>
            }
            <div className="grid grid-cols-3 mt-1">
                <span className="inline-flex items-center gap-1"><CircleUserRound /> {res.data.author}</span>
                <span className="inline-flex items-center gap-1 justify-self-center"><Timer />{res.data.total_time} min</span>
                <span className="inline-flex items-center gap-1 justify-self-end"><Zap /> {res.data.active_time} min</span>
            </div>
            <div className="recipe-content" dangerouslySetInnerHTML={{
                __html: renderRecipe(res.data.markdown)
            }}></div>
        </div>
    </article>
}