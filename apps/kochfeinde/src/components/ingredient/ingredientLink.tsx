import type { IngredientListType } from "@kochfeinde/shared";
import { Link } from "@tanstack/react-router";

export default function IngredientLink({ingredient } : {ingredient: IngredientListType[0]}) {
    return <>
        <Link to="/ingredient/$slug" params={{slug: ingredient.slug}}>
            <div className="card bg-base-200 rounded-md">
                <div className="card-body">
                    <h2 className="card-title">
                        {ingredient.name}
                    </h2>
                    Schau dir die Zutaten an
                </div>
            </div>
        </Link>
    </>
}