import { useCallback, useEffect, useMemo, useRef } from 'react'
import Route from '../Route'

export default function useBrowserRouting(onChange: (route: Route, isGoTo: boolean) => void) {
    const chg = useRef(onChange),
        update = useCallback((isGoTo = false) => {
            const route = Route.from(window.location.pathname)
            chg.current(route, isGoTo)
        }, []),
        fns = useMemo(() => ({
            goTo(route: Route) {
                const state = {
                    last: window.location.pathname
                }
                window.history.pushState(state, document.title, route.toString())
                update(true)
            },
            replaceTo(route: Route, doUpdate = true) {
                window.history.replaceState(window.history.state, document.title, route.toString())
                if (doUpdate)
                    update()
            },
            backTo(route: Route) {
                const loc = route.toString(),
                    last = window.history.state && window.history.state.last
                if (last === loc) {
                    window.history.back()
                } else {
                    const cur = window.location.pathname
                    window.history.replaceState(window.history.state, document.title, route.toString())
                    window.history.pushState({ last: loc }, document.title, cur)
                    window.history.back()
                }
            }
        }), [update])
    useEffect(() => {
        const l = () => update()
        window.addEventListener('popstate', l, false)
        return () => { window.removeEventListener('popstate', l, false) }
    }, [update])

    chg.current = onChange

    return fns
}
