import type { RecipeListType } from "@kochfeinde/shared";
import { Link } from "@tanstack/react-router";

export default function RecipeLink({recipe} : {recipe: RecipeListType[0]}) {
    return <>
        <Link to="/recipe/$slug" params={{slug: recipe.slug}}>
            <div className="card bg-base-200 rounded-md">
                <div className="card-body">
                    <h2 className="card-title">
                        {recipe.name}
                    </h2>
                    Probier das Rezept!
                </div>
            </div>
        </Link>
    </>
}