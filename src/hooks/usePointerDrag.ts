import { useEffect, useRef, useState } from "react"

export default function usePointerDrag<T extends { [k: string]: any }>(
    state: T,
    start: (state: CBData<T>) => boolean,
    move: (state: CBData<T>) => boolean,
    end: (state: T) => void) {
    const [active, setActive] = useState<number | boolean>(false),
        st = useRef(state)
    st.current = state
    useEffect(() => {
        if (active === false) {
            const md = (ev: MouseEvent) => ev.target && setActive(start({
                target: ev.target as HTMLElement,
                x: ev.pageX,
                y: ev.pageY,
                mouse: ev,
                ...st.current
            })),
                ts = (ev: TouchEvent) => {
                    if (ev.touches.length !== 1) return
                    const t = ev.touches[0],
                        s = start({
                            target: t.target as HTMLElement,
                            x: t.pageX,
                            y: t.pageY,
                            touch: ev,
                            ...st.current
                        })
                    if (s) {
                        setActive(t.identifier)
                    }
                }
            window.addEventListener('mousedown', md)
            window.addEventListener('touchstart', ts, { passive: false })
            return () => {
                window.removeEventListener('mousedown', md)
                window.removeEventListener('touchstart', ts)
            }
        } else if (active === true) {
            const mm = (ev: MouseEvent) => {
                ev.preventDefault()
                ev.target && move({
                    target: ev.target as HTMLElement,
                    x: ev.pageX,
                    y: ev.pageY,
                    mouse: ev,
                    ...st.current
                })
            }, mu = (ev: MouseEvent) => {
                ev.preventDefault()
                setActive(false)
                end(st.current)
            }
            window.addEventListener('mousemove', mm, { passive: false })
            window.addEventListener('mouseup', mu)

            return () => {
                window.removeEventListener('mousemove', mm)
                window.removeEventListener('mouseup', mu)

            }
        } else {
            const tm = (ev: TouchEvent) => {
                for (let i = 0; i < ev.changedTouches.length; i++) {
                    const t = ev.changedTouches[i]
                    if (t.identifier === active) {
                        const tgt = document.elementFromPoint(t.clientX, t.clientY)
                        if (tgt && move({
                            target: tgt as HTMLElement,
                            x: t.pageX,
                            y: t.pageY,
                            touch: ev,
                            ...st.current
                        }))
                            ev.preventDefault()
                        return
                    }
                }
            }, te = (ev: TouchEvent) => {
                for (let i = 0; i < ev.changedTouches.length; i++) {
                    const t = ev.changedTouches[i]
                    if (t.identifier === active) {
                        setActive(false)
                        end(st.current)
                        return
                    }
                }
            }, cancel = (ev: Event) => ev.preventDefault()
            window.addEventListener('touchmove', tm, { passive: false })
            window.addEventListener('touchend', te)
            window.addEventListener('touchcancel', te)
            window.addEventListener('contextmenu', cancel)
            return () => {
                window.removeEventListener('touchmove', tm)
                window.removeEventListener('touchend', te)
                window.removeEventListener('touchcancel', te)
                window.removeEventListener('contextmenu', cancel)
            }
        }
    }, [active])
}

type CBData<T> = T & { target: HTMLElement, x: number, y: number } & ({
    mouse: MouseEvent
    touch?: undefined
} | {
    mouse?: undefined
    touch: TouchEvent
})
