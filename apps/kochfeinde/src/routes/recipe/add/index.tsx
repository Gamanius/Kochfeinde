import { createFileRoute } from '@tanstack/react-router'
import RecipeAdd from '#/components/recipe/recipeAdd'

export const Route = createFileRoute('/recipe/add/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RecipeAdd/>
}
