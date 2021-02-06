import { OrderedMap } from 'immutable'
import { createContext, PropsWithChildren, ReactNode, useMemo, useRef, useState } from 'react'
import { useStyle } from './hooks/useStyle'

type NotifyNode = ReactNode | ((close: () => void) => ReactNode)

export const NotificationContext = createContext({ notify: (node: NotifyNode, timeout?: number | false) => { } })

export interface NotificationsContainerProps {
    max?: number
    defaultTimeout?: number
}

export default function NotificationsContainer({ max = 3, defaultTimeout = 6000, children }: PropsWithChildren<NotificationsContainerProps>) {
    const id = useRef(0),
        height = useRef(0),
        ref = useRef<HTMLDivElement>(null),
        s = useStyle(),
        [stack, setStack] = useState(OrderedMap<number, { node: ReactNode, bottom: number, exit?: boolean, close: () => void }>()),
        ctx = useMemo(() => ({
            notify(node: NotifyNode, timeout?: number | false) {
                let closed = false
                const key = ++id.current,
                    h = ref.current?.children[0].getBoundingClientRect()?.height || 0,
                    close = () => setStack(s => {
                        if (closed) return s
                        closed = true
                        const above = s.keySeq().reverse().filter(k => k < key).first(undefined),
                            bottom = s.get(key)?.bottom || 0,
                            diff = above ? s.get(above, { bottom }).bottom - bottom : 0
                        setTimeout(() => setStack(s => s.delete(key)), 500)
                        return s.map(({ bottom, exit, ...rest }, k) => ({ bottom: k < key ? bottom - diff : bottom, exit: k === key || exit, ...rest }))
                    })
                setStack(s => {
                    let count = s.size, i = 0
                    for (const { close } of s.valueSeq()) {
                        if (count-- < max) break
                        setTimeout(close, 100 * (++i))
                    }
                    timeout !== false && setTimeout(close, timeout ?? defaultTimeout)
                    return s.set(key, {
                        node: typeof node === 'function' ? node(close) : node,
                        bottom: height.current += Math.ceil(h + 12),
                        close,
                    })
                })
            }
        }), [max])
    if (stack.size === 0)
        height.current = id.current = 0
    return (
        <NotificationContext.Provider value={ctx}>
            {children}
            {stack.entrySeq().map(([key, { node, bottom, exit }]) => (
                <div className={s('notification', { exit })} style={{ bottom: height.current - bottom }} ref={key === id.current ? ref : undefined} key={key}>
                    {node}
                </div>
            ))}
        </NotificationContext.Provider>
    )
}
