import { TRPCProvider, useTRPC } from '#/query/trcp'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from "react-hook-form"
import { InsertRecipeSchema  } from '@kochfeinde/shared';
import type {InsertRecipeSchemaType} from '@kochfeinde/shared';
import { zodResolver } from "@hookform/resolvers/zod"
import { Suspense } from 'react';
import RecipeList from '#/components/recipe/recipeList';

export const Route = createFileRoute('/recipe/')({
    component: RouteComponent,
})

function RouteComponent() {
    const trcp = useTRPC()
    const query = useQueryClient()
    const res = useSuspenseQuery(trcp.recipe.list.queryOptions())
    const mut = useMutation(trcp.recipe.insert.mutationOptions({
        onSettled: () => {
            query.invalidateQueries(trcp.recipe.list.queryOptions())

        }
    }))
    const {register, handleSubmit, formState: { errors },} = useForm({
        resolver: zodResolver(InsertRecipeSchema)
    })

    const onSubmit = (data: InsertRecipeSchemaType) => {
        mut.mutate({
            name: data.name
        })
    }

    return <div>
        <Suspense>
            <RecipeList/>
        </Suspense>
    </div>
}
