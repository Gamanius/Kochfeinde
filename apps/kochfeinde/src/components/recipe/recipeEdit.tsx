import { useTRPC } from "#/query/trcp";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import Card from '#/components/card';
import RecipeEditCode from './recipeEditCode';
import { zodResolver } from "@hookform/resolvers/zod";
import { PatchRecipeSchema  } from "@kochfeinde/shared";
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
            markdown: res.data.markdown
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
        <h3>
            Rezept
        </h3>
        <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Zutaten Name</legend>
                <input type="text" className="input" {...register("name")}/>
                  {errors.name ? (
                    <p className="label text-error">{errors.name.message}</p>
                ) : (
                    <p className="label">
                    Es können nicht zwei Zutaten mit dem selben Namen existieren.
                    </p>
                )}
            </fieldset>
            <RecipeEditCode value={editstate} onChange={(val) => setValue("markdown", val, { shouldDirty: true })} />
            <div className="card-actions justify-end mt-4">
                <button className="btn btn-primary" type="submit">Speichern</button>
            </div>
        </form>

    </Card>
    </>

}