import Card from '#/components/card'
import { useTRPC } from '#/query/trcp'
import { zodResolver } from '@hookform/resolvers/zod'
import { InsertRecipeSchema, LoginUserSchema  } from '@kochfeinde/shared'
import type {LoginUserType} from '@kochfeinde/shared';
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export const Route = createFileRoute('/login/')({
    component: RouteComponent,
})

function RouteComponent() {
    const trpc = useTRPC()
    const query = useQueryClient()
    const router = useRouter()
    const mut = useMutation(trpc.auth.login.mutationOptions({
        onSuccess: (opt) => {
            query.invalidateQueries(trpc.auth.get.queryOptions())
            router.navigate({
                to: "/"
            })
        }
    }))
    const {register, handleSubmit } = useForm({
        resolver: zodResolver(LoginUserSchema),
    })

    const onSubmit = (data: LoginUserType) => {
        mut.mutate({
            ...data
        })
    }

    return <Card title="Login">
        <form onSubmit={handleSubmit(onSubmit)} className='flex justify-center'>
            <fieldset className="grid grid-cols-1 gap-4 fieldset bg-base-100 border-neutral-content rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Anmelden</legend>
                <label className='floating-label'>
                    <span>Nutzername</span>
                    <input type="text" className="input" {...register("name")}/>
                </label>
                <label className='floating-label'>
                    <span>Passwort</span>
                    <input type="password" className="input" {...register("password")}/>
                </label>
                <Link to='/register' className='link'>
                    Kein Login?
                </Link>
                <p className='text-error'>
                    {mut.error?.message}
                </p>
                    <button className="btn btn-primary" type="submit" disabled={mut.isPending}>Einloggen</button>
            </fieldset>
            </form>
    </Card>
}
