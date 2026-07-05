
import IngredientAdd from '#/components/ingredient/ingredientAdd'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ingredient/add/')({
    component: RouteComponent,
})

function RouteComponent() {
    return <IngredientAdd/>
}
