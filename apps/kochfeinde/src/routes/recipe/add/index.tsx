import { createFileRoute } from '@tanstack/react-router'
import { useBreadcrumbs } from '#/components/breadcrumbs'
import { useEffect } from 'react'
import RecipeAdd from '#/components/recipe/recipeAdd'

export const Route = createFileRoute('/recipe/add/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { setCrumbs } = useBreadcrumbs()

  useEffect(() => {
    setCrumbs([
      { label: "Rezepte", path: "/recipe" },
      { label: "Neu" },
    ])
    return () => setCrumbs([])
  }, [])

  return <RecipeAdd/>
}
