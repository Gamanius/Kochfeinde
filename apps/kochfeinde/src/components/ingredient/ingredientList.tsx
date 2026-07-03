import { useTRPC } from "#/query/trcp"
import { useSuspenseQuery } from "@tanstack/react-query"
import IngredientLink from "./ingredientLink"
import Card from "../card"
import { Plus } from "lucide-react"
import { Link } from "@tanstack/react-router"

export default function IngredientList() {
    const trcp = useTRPC()
    const res = useSuspenseQuery(trcp.ingredient.list.queryOptions())
    return (
        <>  
            <section className="grid grid-cols-3 gap-2">
                {res.data.map(r => <IngredientLink key={r.name} ingredient={r}/>)}
                <Link to="/ingredient/add">
                <Card title={"Neue Zutat"}>
                    Erstelle eine Zutat die bisher fehlt
                </Card>
                </Link>
            </section>
        </>
    );
}