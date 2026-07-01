import { useTRPC } from '#/query/trcp'
import { zodResolver } from '@hookform/resolvers/zod'
import { InsertIngredientSchema, InsertRecipeSchema  } from '@kochfeinde/shared'
import type {InsertRecipeSchemaType} from '@kochfeinde/shared';
import { dataTagErrorSymbol, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useBreadcrumbs } from '#/components/breadcrumbs'
import { useEffect } from 'react'

export const Route = createFileRoute('/ingredient/add/')({
    component: RouteComponent,
})

function RouteComponent() {
    const { setCrumbs } = useBreadcrumbs()

    useEffect(() => {
        setCrumbs([
            { label: "Zutaten", path: "/ingredient" },
            { label: "Neu" },
        ])
        return () => setCrumbs([])
    }, [])

    const trcp = useTRPC()
    const query = useQueryClient()
    const router = useRouter()

    const mut = useMutation(trcp.ingredient.insert.mutationOptions({
        onSuccess: (data) => {
            query.invalidateQueries(trcp.ingredient.list.queryOptions())
            if (data.name === undefined) {
                router.navigate( {to: "/ingredient"})
                return
            }
            router.navigate({to: "/ingredient/$slug", params: {slug: data.name.slug}})
        }
    }))
    const {register, handleSubmit, formState: { errors },} = useForm({
        resolver: zodResolver(InsertIngredientSchema)
    })

    const onSubmit = (data: InsertRecipeSchemaType) => {
        mut.mutate({
            name: data.name
        })
    }

    return <>
    <div className="card bg-base-100 shadow-xl m-4">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="card-title">Zutat hinzufügen</h2>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Zutaten Name</legend>
                <input type="text" className="input" placeholder="Banane" {...register("name")}/>
                  {errors.name ? (
                    <p className="label text-error">{errors.name.message}</p>
                ) : (
                    <p className="label">
                    Es können nicht zwei Zutaten mit dem selben Namen existieren.
                    </p>
                )}
            </fieldset>
                <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary">Save</button>
                </div>
        </form>
    </div>
    </>
}
