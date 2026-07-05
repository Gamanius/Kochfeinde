import Card from '#/components/card'
import { useTRPC } from '#/query/trcp'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterUserSchema  } from '@kochfeinde/shared'
import type {RegisterUserType} from '@kochfeinde/shared';
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

export const Route = createFileRoute('/register/')({
  component: RouteComponent,
})

function RouteComponent() {
    const trpc = useTRPC()
    const query = useQueryClient()
    const router = useRouter()
    const mut = useMutation(trpc.auth.register.mutationOptions({
        onSuccess: () => {
            query.invalidateQueries(trpc.auth.get.queryOptions());
            router.navigate({to: "/"})
        }
    }))
    const {register, handleSubmit, formState: { errors },} = useForm({
        resolver: zodResolver(RegisterUserSchema),
    })

    const onSubmit = (data: RegisterUserType) => {
        mut.mutate({
            ...data
        })
    }

    return <Card title="Neuen Account erstellen">
        <form onSubmit={handleSubmit(onSubmit)} className='flex justify-center'>
            <fieldset className="flex flex-col gap-4 fieldset bg-base-100 border-neutral-content rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Registrierung</legend>
                <label className='floating-label'>
                    <span>Anmelde Name</span>
                    <input type="text" className="input" {...register("name")}/>
                    <p className='text-error'>{errors.name?.message}</p>
                </label>
                <span className='label -mt-2 whitespace-normal'> Der Name wird verwendet zum anmelden und kann nicht geändert werden </span>
                <label className='floating-label'>
                    <span>Anzeige Name</span>
                    <input type="text" className="input" {...register("displayname")}/>
                    <p className='text-error'>{errors.displayname?.message}</p>
                </label>
                <span className='label -mt-2 whitespace-normal'> Der Name wird angezeigt und kann später geändert werden </span>

                <label className='floating-label'>
                    <span>Passwort</span>
                    <input type="password" className="input" {...register("password")}/>
                    <p className='text-error'>{errors.password?.message}</p>
                </label>
                <label className='floating-label'>
                    <span>Registrierungs Code</span>
                    <input type='text' className='input' {...register("register_code")}/>
                    <p className='text-error'>{errors.register_code?.message}</p>
                </label>
                <p className='text-error'>
                    {mut.error?.message}
                </p>
                <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary" type="submit" disabled={mut.isPending}>Registrieren</button>
                </div>
            </fieldset>
            </form>
    </Card>
}
