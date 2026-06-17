import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export const queryClient = new QueryClient({defaultOptions: {
  queries: {
    staleTime: 5000,
  }
}
})


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div data-theme="light">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
      </QueryClientProvider>
    </div>
  </StrictMode>,
)
