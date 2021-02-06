import { ComponentProps, useEffect, useRef } from 'react'
import { useStyle } from './hooks/useStyle'

export type PageLoaderProps = Omit<ComponentProps<'div'>, 'children'> & { loading: boolean; delay?: number; time?: number }

export default function PageLoader({ loading, delay = 100, time = 1000, className, ...rest }: PageLoaderProps) {
    const s = useStyle(),
        ref = useRef<HTMLDivElement>(null),
        width = useRef(0)
    useEffect(() => {
        let valid = true, tp = performance.now()
        if (!loading && width.current === 0)
            return
        if (loading)
            width.current = 0
        const c = ref.current
        if (!c)
            return
        const fn = (tn: number) => {
            if (!valid)
                return

            const delta = (tn - tp) / (loading ? time : delay)
            tp = tn
            width.current += delta
            const w = Math.min(1, 1 / (Math.exp(4 - 8 * width.current) + 1))
            if (loading)
                c.style.opacity = '1'
            c.style.width = (Math.round(w * 10000) / 100) + '%'

            if (w < 1)
                requestAnimationFrame(fn)
        }
        if (loading) {
            setTimeout(() => (tp = performance.now(), requestAnimationFrame(fn)), delay)
        } else {
            requestAnimationFrame(fn)
            setTimeout(() => valid && (c.style.opacity = '0'), delay + 10)
        }
        return () => { valid = false }
    }, [loading])
    return (
        <div className={s('loading-page', { className })} ref={ref} {...rest} />
    )
}
