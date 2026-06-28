import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <main className="">
        <section className="">
            <div className="card bg-base-200">
                <Link to="/recipe">
                    Rezepte!
                </Link>
            </div>
        </section>
    </main>
  )
}
