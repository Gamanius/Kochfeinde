import IngredientEdit from '#/components/ingredient/ingredientEdit'
import IngredientDelete from '#/components/ingredient/ingredientDelete'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/ingredient/$slug/edit/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { slug } = Route.useParams()

    return (
        <Suspense>
            <IngredientEdit slug={slug} />
            <IngredientDelete slug={slug} />
        </Suspense>
    )
}