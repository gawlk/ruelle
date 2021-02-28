import { shallowRef, defineAsyncComponent, reactive } from 'vue'

export const createRouter = () => {
    const page = shallowRef()

    const router = reactive({
        routes: {},
        page,
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

            page.value = router.routes[router.path]
        },
    })

    const pages = import.meta.glob('./pages/**/*.(vue|jsx|tsx)')
    console.log('pages', pages)

    Object.keys(pages)
        .filter((key) => !key.includes('/components/'))
        .forEach((key) => {
            let path = key
                .toLowerCase()
                .match(/^\.\/pages\/(.*)\.(vue|jsx|tsx)$/)[1]
            path = '/' + (path === 'index' ? '' : path.replace(/\/?index$/, ''))
            router.routes[path] = defineAsyncComponent(() => pages[key]())
        })

    router.set(window.location.pathname)

    window.addEventListener('popstate', () => {
        router.set(window.location.pathname)
    })

    return router
}
