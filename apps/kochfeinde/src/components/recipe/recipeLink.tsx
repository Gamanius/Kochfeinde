import type { RecipeListType } from "@kochfeinde/shared";
import { Link } from "@tanstack/react-router";
import Card from "../card";

export default function RecipeLink({recipe} : {recipe: RecipeListType[0]}) {
    return <Link to="/recipe/$slug" params={{slug: recipe.slug}}>
     <Card title={recipe.name}>
            Probier das Rezept!
    </Card>
        </Link>
}