import { useTRPC } from "#/query/trcp"
import { zodResolver } from "@hookform/resolvers/zod"
import { PatchIngredientSchema } from "@kochfeinde/shared"
import type { PatchIngredientSchemaType } from "@kochfeinde/shared"
import { useQueryClient, useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import Card from "../card";
import { nutritionFields } from "./nutrition"

export default function IngredientEdit({ slug }: { slug: string }) {
    const trcp = useTRPC()
    const query = useQueryClient()
    const router = useRouter()

    const res = useSuspenseQuery(trcp.ingredient.get.queryOptions({ slug }))

    const mut = useMutation(trcp.ingredient.update.mutationOptions({
        onSuccess: (data) => {
            query.invalidateQueries(trcp.ingredient.list.queryOptions())
            if (data.name === undefined) {
                router.navigate({ to: "/ingredient" })
                return
            }
            router.navigate({ to: "/ingredient/$slug", params: { slug: data.name.slug } })
        }
    }))

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(PatchIngredientSchema),
        defaultValues: {
            slug: slug,
            name: res.data.name,
            calories: res.data.calories,
            totalFat: res.data.totalFat,
            fatUnsaturated: res.data.fatUnsaturated,
            fatSaturated: res.data.fatSaturated,
            cholesterol: res.data.cholesterol,
            totalCarbohydrates: res.data.totalCarbohydrates,
            totalSugars: res.data.totalSugars,
            dietaryFiber: res.data.dietaryFiber,
            protein: res.data.protein,
            salt: res.data.salt,
            water: res.data.water,
            vitaminA: res.data.vitaminA,
            vitaminB12: res.data.vitaminB12,
            vitaminC: res.data.vitaminC,
            vitaminD: res.data.vitaminD,
            potassium: res.data.potassium,
            sodium: res.data.sodium,
            calcium: res.data.calcium,
            iron: res.data.iron,
            density: res.data.density ?? undefined,
        }
    })

    const onSubmit = (data: PatchIngredientSchemaType) => {
        mut.mutate(data)
    }

    return <>
        <Card title={`Zutat "${res.data.name}" bearbeiten`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Allgemeine Information</legend>
                    <label className="floating-label">
                        <span>Zutaten Name</span>
                        <input type="text" className="input" placeholder="Zutaten Name" {...register("name")} />
                    </label>

                    {errors.name ? (
                        <p className="label text-error">{errors.name.message}</p>
                    ) : (
                        <p className="label">
                            Es können nicht zwei Zutaten mit dem selben Namen existieren.
                        </p>
                    )}
                </fieldset>

                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Nährwerte (pro 100g)</legend>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {nutritionFields.map(({ key, label, unit }) => (
                            <label key={key} className="form-control w-full max-w-xs">
                                <span className="label-text">{label} ({unit})</span>
                                <input
                                    type="number"
                                    step="any"
                                    className="input input-bordered w-full"
                                    {...register(key as keyof PatchIngredientSchemaType)}
                                />
                            </label>
                        ))}
                    </div>
                </fieldset>

                <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary" disabled={mut.isPending}>Speichern</button>
                </div>
            </form>
        </Card>
    </>
}