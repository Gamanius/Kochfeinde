import IngredientList from '#/components/ingredient/ingredientList'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useEffect } from 'react'
import { useBreadcrumbs } from '#/components/breadcrumbs'

export const Route = createFileRoute('/ingredient/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { setCrumbs } = useBreadcrumbs()

  useEffect(() => {
    setCrumbs([{ label: "Zutaten" }])
    return () => setCrumbs([])
  }, [])

  return <Suspense>
    <IngredientList/>
  </Suspense>
}
