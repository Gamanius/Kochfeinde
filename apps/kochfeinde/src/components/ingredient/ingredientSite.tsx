import { useTRPC } from "#/query/trcp"
import { useSuspenseQuery } from "@tanstack/react-query"
import { nutritionFields } from "./nutrition"
import Card from "../card"
import {SquarePen} from "lucide-react"
import { Link } from "@tanstack/react-router"

export default function IngredientSite({slug}:{slug:string}) {
    const trcp = useTRPC()
    const res = useSuspenseQuery(trcp.ingredient.get.queryOptions({slug}))

    const i = res.data

    return <Card title={<>
        <div className="flex justify-between w-full">
            {res.data.name}
            <Link to="/ingredient/$slug/edit" params={{slug: slug}} className="btn btn-ghost btn-square">
                <SquarePen />
            </Link>
        </div>
    </>}>
        
        <table className="table table-zebra">
            <thead>
                <tr>
                    <th>Nährwert</th>
                    <th>pro 100g</th>
                </tr>
            </thead>
            <tbody>
                {nutritionFields.map(({ key, label, unit }) => (
                    <tr key={key}>
                        <td>{label}</td>
                        <td>{i[key as keyof typeof i] ?? "—"} {unit}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </Card>
}