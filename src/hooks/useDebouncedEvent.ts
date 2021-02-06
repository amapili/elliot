import { useEffect, useState } from 'react'

export function debounce<T extends (...args: any[]) => any>(fn: T, wait: number, immediate: boolean) {
    let timeout: number | null = null,
        time = new Date().getTime()
    return function (this: any, ...args: any[]) {
        const ctx = this,
            later = function () {
                timeout = null
                if (!immediate) fn.apply(ctx, args)
            }
        const imm = immediate && !timeout
        if (timeout) {
            window.clearTimeout(timeout)
            const now = new Date().getTime()
            if (now > time + wait) {
                time = now
                fn.apply(this, args)
            }
        }
        timeout = window.setTimeout(later, wait)
        if (imm) fn.apply(this, args)
    } as T
}

export default function useDebouncedEvent<K extends keyof WindowEventMap>(type: K, options?: boolean | AddEventListenerOptions, wait = 100): WindowEventMap[K] | undefined {
    const [ev, setEv] = useState<WindowEventMap[K] | undefined>()
    useEffect(() => {
        const fn = debounce((e: WindowEventMap[K]) => setEv(e), wait, true)
        window.addEventListener(type, fn, options)
        return () => window.removeEventListener(type, fn, options)
    }, [type])
    return ev
}
