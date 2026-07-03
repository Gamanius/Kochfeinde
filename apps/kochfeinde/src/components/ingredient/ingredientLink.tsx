import type { IngredientListType } from "@kochfeinde/shared";
import { Link } from "@tanstack/react-router";
import Card from "../card";

export default function IngredientLink({ingredient } : {ingredient: IngredientListType[0]}) {
    return <>
        <Link to="/ingredient/$slug" params={{slug: ingredient.slug}}>
        
            <Card title={ingredient.name}>
                Schau dir die Zutaten an
            </Card>
        </Link>
    </>
}