import { ReactNode, useState, useRef, useEffect, PropsWithChildren, useMemo, CSSProperties, RefObject } from 'react'
import { createPortal } from 'react-dom'
import useOverlayNode from './hooks/useOverlayNode'
import { useStyle } from './hooks/useStyle'
import useDebouncedEvent from './hooks/useDebouncedEvent'

type PopoverPos = { x?: number | 'left' | 'center' | 'right', y?: number | 'top' | 'center' | 'bottom' } | 'center'

function getOffsetTop(rect: ClientRect, pos?: PopoverPos) {
    const y = pos === 'center' ? pos : pos?.y
    let offset = 0

    if (typeof y === 'number')
        offset = y
    else if (y === 'center')
        offset = rect.height / 2
    else if (y === 'bottom')
        offset = rect.height

    return offset + rect.top
}

function getOffsetLeft(rect: ClientRect, pos?: PopoverPos) {
    const x = pos === 'center' ? pos : pos?.x
    let offset = 0

    if (typeof x === 'number')
        offset = x
    else if (x === 'center')
        offset = rect.width / 2
    else if (x === 'right')
        offset = rect.width

    return offset + rect.left
}

export interface PopoverProps {
    show: boolean
    node: ReactNode
    onClickOutside?: (ev: MouseEvent) => unknown
    pos?: PopoverPos
    posRef?: RefObject<HTMLElement>
}

interface Pos {
    left?: number
    top: number
    right?: number

    width?: number
    fixed: boolean
    zIndex: number
    sox: number
    soy: number
}

export default function Popover({ show, onClickOutside, node: child, pos: start, posRef: ref, children }: PropsWithChildren<PopoverProps>) {
    const node = useOverlayNode(),
        [update, setUpdate] = useState(4),
        posRefOwned = useRef<HTMLDivElement>(null),
        posRef = ref ?? posRefOwned,
        pos = useRef<Pos>()
    useEffect(() => {
        let valid = true
        if (!show) {
            if (!pos.current) {
                setUpdate(4)
                return
            }
            setUpdate(3)
            setTimeout(() => {
                if (valid)
                    setUpdate(4)
            }, 250)
            return () => { valid = false }
        }
        const p = ref ? ref.current : posRef.current?.children[0]
        if (!p) return
        const rect = p.getBoundingClientRect()

        let fixed = false, z = 1

        for (let e = p.parentElement; e != null; e = e.parentElement) {
            const cs = getComputedStyle(e),
                zTest = parseInt(cs.getPropertyValue('z-index'))
            if (!isNaN(zTest)) {
                z = Math.max(zTest, z)
                if (cs.position === 'fixed')
                    fixed = true
            } else if (cs.position === 'fixed') {
                fixed = true
            }
        }
        const ps = {
            left: getOffsetLeft(rect, start),
            top: getOffsetTop(rect, start),
            width: rect.width,
            zIndex: z + 10,
            fixed,
            sox: 0,
            soy: 0,
        }
        if (!fixed) {
            ps.top += window.pageYOffset
        }
        pos.current = ps
        setTimeout(() => {
            if (!valid) return
            setUpdate(1)
            setTimeout(() => valid && setUpdate(2), 250)
        }, 10)
        setUpdate(0)
        return () => { valid = false }
    }, [show, ref])
    useEffect(() => {
        if (!pos.current || update !== 2 || !onClickOutside) return
        const click = (ev: MouseEvent) => {
            for (let e = ev.target as HTMLElement | null; e != null; e = e.parentElement) {
                if (e === node)
                    return
            }
            onClickOutside(ev)
        }
        window.addEventListener('click', click)
        return () => window.removeEventListener('click', click)
    }, [onClickOutside, update])
    return (
        <>
            {ref === undefined ? <div ref={posRefOwned} style={{ display: 'contents' }}>
                {child}
            </div> : child}
            {pos.current && update !== 4 && createPortal(<Inner pos={pos.current} state={update}>{children}</Inner>, node)}
        </>
    )
}

interface InnerProps {
    pos: Pos
    state: number
}

function Inner({ pos: { sox, soy, top, left, right, width, zIndex, fixed }, state, children }: PropsWithChildren<InnerProps>) {
    const c = useRef<HTMLDivElement>(null),
        sz = useRef<HTMLDivElement>(null),
        s = useStyle(),
        w = useDebouncedEvent('resize'),
        style = useMemo(() => {
            const size: CSSProperties = { left: 0, top: 0, width: 0, height: 0, minWidth: width, overflow: state === 2 ? 'auto' : 'hidden', opacity: state === 2 || state === 1 ? 1 : 0 }
            if (c.current && sz.current) {
                const r = c.current.getBoundingClientRect(),
                    rs = sz.current.getBoundingClientRect()
                size.width = rs.width
                size.height = rs.height
                if (r.top + rs.height > window.innerHeight - 12)
                    size.top = window.innerHeight - (r.top + rs.height) - 12
                if (r.top + (size.top as number) < 12) {
                    size.top = 12 - r.top
                    size.height = Math.min(size.height, window.innerHeight - 24)
                }
                const wo = 20
                if (r.left + rs.width > window.innerWidth - wo)
                    size.left = window.innerWidth - (r.left + rs.width) - wo
                if (r.left + (size.left as number) < wo) {
                    size.left = wo - r.left
                    size.width = Math.min(size.width, window.innerWidth - wo - wo)
                }
            }
            if (state === 0) {
                size.top = sox
                size.left = soy
            } else if (state === 2) {
                size.width = size.height = 'auto'
            }
            return size
        }, [state, w])
    return (
        <div style={{ top, left, right, zIndex, position: fixed ? 'fixed' : 'absolute' }} ref={c}>
            <div className={s.popover} style={style}>
                <div className={s.sizer} ref={sz} style={{ minWidth: width }}>
                    {children}
                </div>
            </div>
        </div>
    )
}
