import type { RecipeListType } from "@kochfeinde/shared";
import { Link } from "@tanstack/react-router";
import Card from "../card";
import { Timer } from "lucide-react";

export default function RecipeLink({recipe} : {recipe: RecipeListType[0]}) {
    return <Link to="/recipe/$slug" params={{slug: recipe.slug}}>
        <Card title={recipe.name} className="aspect-square">
            <span className="inline-flex items-center gap-1"><Timer/> {recipe.total_time} min</span>
            {recipe.undertitle}        
        </Card>
    </Link>
}