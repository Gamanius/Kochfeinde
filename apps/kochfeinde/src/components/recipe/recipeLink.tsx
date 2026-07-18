import type { RecipeListType } from "@kochfeinde/shared";
import { tagLabelMap } from "@kochfeinde/shared";
import { Link } from "@tanstack/react-router";
import Card from "../card";
import { Timer } from "lucide-react";
import AddToListButton from "../list/addToListButton";

export default function RecipeLink({recipe} : {recipe: RecipeListType[0]}) {

    return <Link to="/recipe/$slug" params={{slug: recipe.slug}}>
        <Card title={
            <span className="inline-flex justify-between w-full ">
                {recipe.name}

                <AddToListButton slug={recipe.slug} name={recipe.name} portionNum={recipe.portion_num} />
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