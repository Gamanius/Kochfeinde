import { zodResolver } from "@hookform/resolvers/zod";
import { InsertRecipeSchema  } from "@kochfeinde/shared";
import type {InsertRecipeSchemaType} from "@kochfeinde/shared";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Card from "../card";
import { useTRPC } from "#/query/trcp";
import { useRouter } from "@tanstack/react-router";

export default function RecipeAdd() {
    const trpc = useTRPC()
    const query = useQueryClient()
    const router = useRouter()
    const mut = useMutation(trpc.recipe.insert.mutationOptions({
        onSuccess: (opt) => {
            query.invalidateQueries(trpc.recipe.list.queryOptions())
            if (opt.recipe === undefined) {
                router.navigate({
                    to: "/"
                })
                return;
            }
            router.navigate({
                to: "/recipe/$slug",
                params: {
                    slug: opt.recipe.slug
                }
            })
        }
    }))
    const {register, handleSubmit, formState: { errors },} = useForm({
        resolver: zodResolver(InsertRecipeSchema),
    })

    const onSubmit = (data: InsertRecipeSchemaType) => {
        mut.mutate({
            ...data
        })
    }

      return <>
        <Card title={`Neues Rezept erstellen`}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Rezept Name</legend>
                    <input type="text" className="input" {...register("name")}/>
                      {errors.name ? (
                        <p className="label text-error">{errors.name.message}</p>
                    ) : (
                        <p className="label">
                        Das Rezept sollte mindestens 3 Buchstaben haben
                        </p>
                    )}
                </fieldset>
                <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary" type="submit" disabled={mut.isPending}>Erstellen!</button>
                </div>
            </form>
    
        </Card>
        </>
}