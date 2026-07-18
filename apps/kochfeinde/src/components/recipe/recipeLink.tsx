import type { RecipeListType } from "@kochfeinde/shared";
import { tagLabelMap } from "@kochfeinde/shared";
import { Link } from "@tanstack/react-router";
import Card from "../card";
import { ListCheck, ListPlus, Timer } from "lucide-react";
import { useRecipeListStore } from "../list/listContext";

export default function RecipeLink({recipe} : {recipe: RecipeListType[0]}) {
    const addRecipe = useRecipeListStore((s) => s.addRecipe)
    const list = useRecipeListStore((s) => s.list)

    return <Link to="/recipe/$slug" params={{slug: recipe.slug}}>
        <Card title={
            <span className="inline-flex justify-between w-full ">
                {recipe.name}

                {recipe.slug in list ?
                <button className="btn btn-disabled btn-square btn-ghost btn-sm -mb-2">
                    <ListCheck/>
                </button>
                : 
                <button className="btn btn-square btn-ghost btn-sm -mb-2" onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    addRecipe(recipe.slug, recipe.name, recipe.portion_num)
                }}>
                    <ListPlus/>
                </button>
                }
            </span>
        } className="aspect-square overflow-scroll relative">
            <span className="inline-flex items-center gap-1"><Timer/> {recipe.total_time} min</span>
            {recipe.undertitle}
            <div className="flex flex-wrap gap-1 mt-2">
                {recipe.tags?.sort().map(tag => (
                    <span key={tag} className="badge badge-outline badge-sm">{tagLabelMap[tag]}</span>
                ))}
            </div>
        </Card>
    </Link>
}