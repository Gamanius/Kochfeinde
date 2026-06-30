import { createFileRoute } from '@tanstack/react-router'
import RecipeEdit from '#/components/recipe/recipeEdit';



export const Route = createFileRoute('/recipe/$slug/edit/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { slug } = Route.useParams()


    return <>
        <RecipeEdit slug={slug}/>
    </>
}
