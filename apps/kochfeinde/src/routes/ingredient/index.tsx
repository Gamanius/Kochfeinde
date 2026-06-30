import IngredientList from '#/components/ingredient/ingredientList'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/ingredient/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Suspense>
    <IngredientList/>
  </Suspense>
}
