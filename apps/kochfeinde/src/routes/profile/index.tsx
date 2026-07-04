import UserSetting from '#/components/user/userSettings'
import { useTRPC } from '#/query/trcp'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
    const trpc = useTRPC()
    const user = useSuspenseQuery(trpc.auth.get.queryOptions());
    
    if (user.data === null) {
        return <>
            Nicht eingeloggt
        </>
    }

    return <Suspense>
        <UserSetting></UserSetting>
    </Suspense>
}
