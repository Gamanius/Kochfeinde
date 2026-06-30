import { useTRPC } from '#/query/trcp'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
    const trcp = useTRPC()
    const recipe = useSuspenseQuery(trcp.recipe.list.queryOptions()).data.length
    const ingredient = useSuspenseQuery(trcp.ingredient.list.queryOptions()).data.length

    return (
    <main className="">
        <section className="m-2 grid-cols-2 grid gap-2">
            <Link className="card bg-base-200" to='/recipe'>
                <div className='card-body'>
                    <h2 className='card-title'>Rezepte!</h2>
                    Es wurden {recipe} Rezepte bisher hochgeladen
                </div>
            </Link>
            <Link className="card bg-base-200" to='/ingredient'>
                <div className='card-body'>
                    <h2 className='card-title'>Zutaten</h2>
                    Es wurden {ingredient} Zutaten bisher hochgeladen
                </div>
            </Link>
        </section>
    </main>
  )
}
