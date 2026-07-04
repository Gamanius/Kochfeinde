import { DatabaseArrowDown, Trash2 } from "lucide-react"
import Card from "../card"
import { useTRPC } from "#/query/trcp"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useForm } from "react-hook-form"


export default function RecipeDelete({slug}:{slug:string}) {
    const trpc = useTRPC()
    const query = useQueryClient()
    const router = useRouter()
    const res = useSuspenseQuery(trpc.recipe.get.queryOptions({slug}))

    const mut = useMutation(trpc.recipe.delete.mutationOptions({
        onSuccess: () => {
            query.invalidateQueries(trpc.recipe.list.queryOptions())
            query.removeQueries(trpc.recipe.get.queryOptions({slug}))
            router.navigate({to: "/recipe"})
        }
    }))
    const {register, handleSubmit, formState: { errors }, setError} = useForm<{name: string}>()

    const onSubmit = (data: {name: string}) => {
        if (data.name !== res.data.name) {
            setError("name", {type: "pattern", message: "Der Name muss übereinstimmen!"}, {
                shouldFocus: true
            })
        }
        mut.mutate({
            slug: slug
        })
    }

    return <Card title="Rezept Löschen">
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
                <label className="floating-label">
                    <span>Name des Rezeptes</span>
                    <input type="text" placeholder={res.data.name} className="input" {...register("name")}/>
                </label>
                    
                      {errors.name ? (
                        <p className="label text-error">{errors.name.message}</p>
                    ) : (
                        <p className="label">
                        Gebe den Namen des Rezeptes ein um es endgültig zu löschen
                        </p>
                    )}
            </fieldset>
            <p className="text-error">
                {mut.error?.message}
            </p>
            <button className="btn btn-error">
                <Trash2 /> Löschen
            </button>
        </form>
    </Card>
}