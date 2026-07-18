import Card from '#/components/card'
import { useTRPC } from '#/query/trcp'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChefHat, Cookie, CookingPot } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
    const trcp = useTRPC()
    const recipe = useSuspenseQuery(trcp.recipe.list.queryOptions()).data.length
    const ingredient = useSuspenseQuery(trcp.ingredient.list.queryOptions()).data.length
    const user = useSuspenseQuery(trcp.auth.get.queryOptions()).data

    return (
    <main className="mx-4" suppressHydrationWarning>
        {user === null ? (
            <div className="hero bg-base-200 rounded-box my-4 p-6 text-center">
                <div className="hero-content max-w-md">
                    <div>
                        <h1 className="text-3xl font-bold">Kochfeinde</h1>
                        <p className="py-3">
                            Rezepte sammeln, Nährwerte checken, Einkaufsliste erstellen.
                        </p>
                        <Link to="/login" className="btn mr-4">Einloggen</Link>
                        <Link to="/register" className="btn btn-primary">Registrieren</Link>
                    </div>
                </div>
            </div>
        ) : (
            <div className='mx-2 my-4 flex items-center gap-2'>
                <Cookie/> 
                <h1>Wilkommen zurück {user.displayname}</h1>
            </div>
        )}


        <section className="sm:grid-cols-2 grid gap-2">
            <Link to='/recipe'>
                <Card title={<><ChefHat/>Rezepte</>}>
                    Es wurden {recipe} Rezepte bisher hochgeladen
                </Card>

            </Link>
            <Link to='/ingredient'>
                <Card title={<><CookingPot/>Zutaten</>}>
                    {ingredient} Zutaten befinden sich in der Datenbank
                </Card>
            </Link>
        </section>

        
    </main>
  )
}
