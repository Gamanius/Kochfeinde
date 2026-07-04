import { useTRPC } from "#/query/trcp"
import { useSuspenseQuery } from "@tanstack/react-query"
import RecipeLink from "./recipeLink";
import Card from "../card";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";

export default function RecipeList() {
    const trcp = useTRPC()
    const res = useSuspenseQuery(trcp.recipe.list.queryOptions())
    const user = useSuspenseQuery(trcp.auth.get.queryOptions())
    const [search, setSearch] = useState("")

    const filtered = res.data.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>  
        <div className="flex justify-center mt-4">
            <label className="input mb-4 w-full max-w-md mx-auto">
                <input
                    type="text"
                    className="input w-full"
                    placeholder="Bananenshake …"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <span className="label"><Search/></span>
            </label>
        </div>
            <section className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-2">
                {filtered.map(r => <RecipeLink key={r.name} recipe={r}></RecipeLink>)}
                {user.data === null ? <></>:
                <Link  to="/recipe/add">
                    <Card title="Neues Rezept" className="aspect-square">
                        Klicke hier um ein neues Rezept hinzuzufügen
                    </Card>
                </Link>
                }
            </section>
        </>
    );
}