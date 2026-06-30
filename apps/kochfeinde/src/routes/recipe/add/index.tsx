import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recipe/add/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/recipe/add/"!</div>
}
