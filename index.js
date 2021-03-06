import { defineAsyncComponent, shallowReactive } from 'vue'

export const PAGES_REGEX = './pages/(**!(components)/)?*.(vue|jsx|tsx)'

export const createRouter = (globs) => {
    const router = shallowReactive({
        routes: {},
        to: (path) => {
            history.pushState(null, '', path)

            router.set(path)
        },
        back: () => history.back(),
        check: (path) => (router.routes[path] ? path : '/'),
        set: async (path) => {
            router.path = await router.check(path)

            if (path !== router.path) {
                history.replaceState(null, '', router.path)
            }

            router.page = router.routes[router.path]
        },
    })

    Object.keys(globs)
        .filter((key) => !key.toLowerCase().includes('/components/'))
        .forEach((key) => {
            let path = key
                .toLowerCase()
                .match(/^\.\/[A-Za-z]+\/(.*)\.(vue|jsx|tsx)$/)[1]
            path =
                '/' + (path === 'index' ? '' : path.replace(/(\/?index)+$/, ''))
            router.routes[path] = defineAsyncComponent(() => globs[key]())
        })

    router.set(window.location.pathname)

    window.addEventListener('popstate', () => {
        router.set(window.location.pathname)
    })

    return router
}
