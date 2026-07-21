import { useTRPC } from "#/query/trcp"
import { useSuspenseQuery } from "@tanstack/react-query"
import IngredientLink from "./ingredientLink"
import Card from "../card"
import { Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"

export default function IngredientList() {
    const trcp = useTRPC()
    const res = useSuspenseQuery(trcp.ingredient.list.queryOptions())
    const user = useSuspenseQuery(trcp.auth.get.queryOptions())
    return (
        <>  
            <section className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2">
                {user.data === null ? <></>:
                <Link to="/ingredient/add">
                <Card title={"Neue Zutat"}>
                    <span className="inline-flex items-center gap-1">
                        <Plus/> Erstelle eine Zutat die bisher fehlt
                    </span>
                </Card>
                </Link>
                }
                {res.data.map(r => <IngredientLink key={r.name} ingredient={r}/>)}
            </section>
        </>
    );
}