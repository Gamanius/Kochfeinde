import { createContext, useContext } from "react"

export type Crumb = {
    label: string
    path?: string
}

export const BreadcrumbContext = createContext<{
    crumbs: Crumb[]
    setCrumbs: (crumbs: Crumb[]) => void
}>({
    crumbs: [],
    setCrumbs: () => {},
})

export const useBreadcrumbs = () => useContext(BreadcrumbContext)
