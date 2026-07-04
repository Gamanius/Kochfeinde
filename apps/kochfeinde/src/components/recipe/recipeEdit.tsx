import { useTRPC } from "#/query/trcp";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import Card from '#/components/card';
import RecipeEditCode from './recipeEditCode';
import { zodResolver } from "@hookform/resolvers/zod";
import { parseIngredient, PatchRecipeSchema  } from "@kochfeinde/shared";
import type {PatchRecipeSchemaType} from "@kochfeinde/shared";
import { useForm } from "react-hook-form";
import { useRouter } from "@tanstack/react-router";

export default function RecipeEdit({slug}:{slug:string}) {
    const trpc = useTRPC()
    const query = useQueryClient()
    const router = useRouter()
    const res = useSuspenseQuery(trpc.recipe.get.queryOptions({slug}))
    
    const mut = useMutation(trpc.recipe.patch.mutationOptions({
        onSuccess: () => {
            query.invalidateQueries(trpc.recipe.list.queryOptions())
            query.invalidateQueries(trpc.recipe.get.queryOptions({slug}))
            router.navigate({
                to: "/recipe/$slug",
                params: {
                    slug: slug
                }
            })
        }
    }))
    const {register, handleSubmit, watch, setValue, formState: { errors },} = useForm({
        resolver: zodResolver(PatchRecipeSchema),
        defaultValues: {
            name: res.data.name,
            slug: slug,
            markdown: res.data.markdown,
            active_time: res.data.active_time,
            total_time: res.data.total_time,
            undertitle: res.data.undertitle
        }
    })

    const onSubmit = (data: PatchRecipeSchemaType) => {
        mut.mutate({
            ...data
        })
    }

    const editstate = watch("markdown");


    return <>
    <Card title={`Rezept "${res.data.name}" bearbeiten`}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="flex flex-col gap-4 fieldset bg-base-100 border-neutral-content rounded-box border p-4 mb-4">
                <legend className="fieldset-legend">Allgemeine Daten</legend>

                <label  className="floating-label flex flex-col">
                    <span>Rezept Name</span>
                    <input type="text" className="input w-full" {...register("name")}/>

                  {errors.name ? (
                    <p className="label text-error">{errors.name.message}</p>
                ) : (
                    <p className="label">
                    Es können nicht zwei Zutaten mit dem selben Namen existieren.
                    </p>
                )}
                </label>

                <label className="floating-label">
                    <span>Kurzbeschreibung</span>
                    <input type="text" className="input w-full" {...register("undertitle")}></input>
                </label>

                <div className="grid grid-cols-2 gap-2">
                    <label className="floating-label">
                        <span className="label-text">Zeit Aktiv (min)</span>
                        <input type="number" step="1"
                            className="input"
                            {...register("active_time", {valueAsNumber: true})}
                        />
                    </label>

                <label className="floating-label">
                    <span className="label-text">Zeit Total (min)</span>
                    <input type="number" step="1"
                        className="input"
                        {...register("total_time", {valueAsNumber: true})}
                    />

                </label>
                </div>


            </fieldset>


            <RecipeEditCode value={editstate} onChange={(val) => setValue("markdown", val, { shouldDirty: true })} />
            <p className="text-error">
                {mut.error?.message}
            </p>
            <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary" type="submit" disabled={mut.isPending}>Speichern</button>
            </div>
        </form>

    </Card>
    </>

}