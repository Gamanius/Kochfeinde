import { Trash2 } from "lucide-react"
import Card from "../card"
import { useTRPC } from "#/query/trcp"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useForm } from "react-hook-form"


export default function IngredientDelete({slug}:{slug:string}) {
    const trpc = useTRPC()
    const query = useQueryClient()
    const router = useRouter()
    const res = useSuspenseQuery(trpc.ingredient.get.queryOptions({slug}))

    const mut = useMutation(trpc.ingredient.delete.mutationOptions({
        onSuccess: () => {
            query.invalidateQueries(trpc.ingredient.list.queryOptions())
            query.removeQueries(trpc.ingredient.get.queryOptions({slug}))
            router.navigate({to: "/ingredient"})
        },
        onError: (err) => {
            setError("name", { type: "manual", message: err.message })
        },
    }))
    const {register, handleSubmit, formState: { errors }, setError} = useForm<{name: string}>()

    const onSubmit = (data: {name: string}) => {
        if (data.name !== res.data.name) {
            setError("name", {type: "pattern", message: "Der Name muss übereinstimmen!"}, {
                shouldFocus: true
            })
            return
        }
        mut.mutate({
            slug: slug
        })
    }

    return <Card title="Zutat Löschen">
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
                <label className="floating-label">
                    <span>Name der Zutat</span>
                    <input type="text" placeholder={res.data.name} className="input" {...register("name")}/>
                </label>
                    
                      {errors.name ? (
                        <p className="label text-error">{errors.name.message}</p>
                    ) : (
                        <p className="label">
                        Gib den Namen der Zutat ein um sie endgültig zu löschen
                        </p>
                    )}
            </fieldset>
            <button className="btn btn-error" disabled={mut.isPending}>
                <Trash2 /> Löschen
            </button>
        </form>
    </Card>
}