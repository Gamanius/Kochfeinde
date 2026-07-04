import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import appCss from '../styles.css?url'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '@kochfeinde/server'
import { TRPCProvider } from '#/query/trcp'
import Header from '#/components/header'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}
 
let browserQueryClient: QueryClient | undefined = undefined;
 
function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Kochfeinde',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/icon.svg',
      },
    ],
  }),
  shellComponent: RootDocument,
})

const apiUrl = typeof window !== 'undefined' ? '/api' : (process.env.VITE_API_URL ?? 'http://localhost:3001');

console.log(apiUrl)

function RootDocument({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const trpcClient = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: apiUrl,
        fetch(url, options) {
            return fetch(url, {
            ...options,
            credentials: 'include',
            });
        },
      }),
    ],
  });

  return (
    <html lang="en" suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
      <head>
        <HeadContent />
      </head>
      <body>
        <Header></Header>
        <main className="grid grid-cols-1 items-center align-middle">
            <div className='max-w-7xl w-full justify-self-center'>
                {children}
            </div>
        </main>

        {/* <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        /> */}
        <Scripts />
      </body>
      </TRPCProvider>
    </QueryClientProvider>
    </html>
  )
}
