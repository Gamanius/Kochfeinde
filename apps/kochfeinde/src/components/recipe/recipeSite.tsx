import { useTRPC } from "#/query/trcp"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import {ChevronLeft, CircleUserRound, Lock, Minus, Plus, Quote, SquarePen, Timer, Zap} from "lucide-react"
import { renderRecipe } from "./recipeParser"
import { tagLabelMap } from "@kochfeinde/shared"
import { useState } from "react"
import AddToListButton from "../list/addToListButton"


function changeVal(num: string, val : number) : string {
    let newVal = parseFloat(num)
    if (isNaN(newVal)) {
        return "0"
    }

    newVal += val;

    return String(newVal.toFixed(2))
}


export default function RecipeSite({slug}:{slug:string}) {
    const trcp = useTRPC()
    const res = useSuspenseQuery(trcp.recipe.get.queryOptions({slug}))
    const user = useSuspenseQuery(trcp.auth.get.queryOptions())
    if (res.error !== null) {
        throw Error("Das ist nicht gut")
    }

    const [portionNum, setPortionNum] = useState(String(res.data.portion_num))

    return <article className="flex justify-center min-w-full">
        <div className="mx-4  p-10 max-w-4xl w-full shadow-2xl ">
            <Link to="/recipe" className="text-sm text-neutral hover:text-primary underline flex items-center"><ChevronLeft className="size-4"/> Rezepte</Link>
            <div className="flex justify-between items-end">
                <h1 className="">
                    {res.data.name}
                </h1> 
                <span className="flex flex-wrap justify-end gap-2">

                <AddToListButton slug={slug} name={res.data.name} portionNum={res.data.portion_num} small={false} />
                
                {user.data === null ? 
                <div className="tooltip tooltip-left tooltip-error" data-tip="Logge dich ein um zu bearbeiten"> 
                <button className="btn btn-square btn-disabled">
                    <Lock/>    
                </button> </div>:
                <Link to="/recipe/$slug/edit" params={{slug: slug}} className="btn btn-square btn-ghost">
                    <SquarePen />
                </Link>
                }
                </span>

            </div>
            <div className="divider my-0"></div>
            {res.data.undertitle === null ? <></>: 
            <span className="inline-flex items-center gap-1 mt-1"><Quote /> <i>{res.data.undertitle}</i></span>
            }
            {/* Widgets */}
            <div className="grid grid-cols-3 mt-1">
                <span className="inline-flex items-center gap-1"><CircleUserRound /> {res.data.author}</span>
                <span className="inline-flex items-center gap-1 justify-self-center"><Timer />{res.data.total_time} min</span>
                <span className="inline-flex items-center gap-1 justify-self-end"><Zap /> {res.data.active_time} min</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 max-h-18 overflow-scroll">
                {res.data.tags?.sort().map(tag => (
                    <span key={tag} className="badge badge-soft">{tagLabelMap[tag]}</span>
                ))}
            </div>
            {/* Scale selector */}
            <div className="mt-2">
                <span className="inline-flex gap-2 items-center flex-wrap">Dieses Rezept ist für 
                    <div className="join">
                        <button className="btn btn-square join-item" onClick={() => setPortionNum(e => changeVal(e, -1))}> <Minus/> </button>
                        <input className="input join-item text-center" 
                            style={{ width: `${portionNum.length + 4}ch` }}
                            value={portionNum}
                            onChange={e => setPortionNum(e.target.value)}
                            onBlur={e => {
                                const val = parseFloat(e.target.value)
                                if (isNaN(val)) {
                                    setPortionNum(String(res.data.portion_num))
                                } else {
                                    setPortionNum(String(val.toFixed(2)))
                                }
                            }}
                            />
                        <button className="btn btn-square join-item" onClick={() => setPortionNum(e => changeVal(e, 1))}> <Plus/> </button>
                    </div>
                     {res.data.portion_string}</span>
            </div>
            <div className="divider my-0">

            </div>
            <div className="recipe-content text-justify" dangerouslySetInnerHTML={{
                __html: renderRecipe(res.data.markdown, parseFloat(portionNum)/res.data.portion_num)
            }}></div>
        </div>
    </article>
}