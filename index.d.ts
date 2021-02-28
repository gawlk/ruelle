export interface Router {
    routes: any

    path: string | undefined

    page: any

    to: (path: string) => void

    back: (path: string) => void

    check: (path: string) => void

    set: (path: string) => void
}

export function createRouter(globs: any): Router
