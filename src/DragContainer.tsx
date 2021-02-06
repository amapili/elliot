import { Set } from "immutable"
import { ComponentPropsWithoutRef, createContext, Dispatch, MutableRefObject, ReactNode, SetStateAction, useContext, useEffect, useRef, useState } from "react"
import { useStyle } from "./hooks/useStyle"
import { debounce } from "./hooks/useDebouncedEvent"
import usePointerDrag from "./hooks/usePointerDrag"

interface DragContainerProps<I, Z> extends Omit<ComponentPropsWithoutRef<'div'>, 'onDrag' | 'onDragEnd' | 'children'> {
    selected: Set<I>
    setSelected: Dispatch<SetStateAction<Set<I>>>
    onDrag: (zone: Z, before?: I) => void
    onDragEnd?: (zone: Z, before?: I) => void
    allowSelect?: boolean
    children: ReactNode
}

export default function DragContainer<I, Z = I>({ selected, setSelected, children, onDrag, onDragEnd, className, allowSelect = true, ...rest }: DragContainerProps<I, Z>) {
    const [dragging, setDragging] = useState<{
        id: I,
        html: string,
        startX: number,
        startY: number,
        mx?: number,
        my?: number,
        w: number,
        h: number,
        lastZone?: Z,
        lastItem?: I
    }>(),
        [drag, setDrag] = useState(false),
        [sel, setSel] = useState<{ x: number, y: number, init: Set<I>, dragged: boolean }>(),
        elems = useRef({ items: new Map<HTMLElement, MutableRefObject<unknown>>(), zones: new Map<HTMLElement, MutableRefObject<unknown>>() }),
        s = useStyle(),
        container = useRef<HTMLDivElement>(null),
        selRef = useRef<HTMLDivElement>(null),
        ref = useRef<HTMLElement>(),
        dragRef = useRef<HTMLDivElement>(null),
        getOffset = () => {
            const rect = container.current?.getBoundingClientRect()
            if (!rect) return { left: 0, top: 0, width: 0, height: 0, }
            return { left: rect.left + window.scrollX, top: rect.top + window.scrollY, width: rect.width, height: rect.height }
        },
        check = debounce((e: { x: number, y: number }) => {
            if (sel && container.current) {
                const x1 = Math.min(sel.x, e.x),
                    x2 = Math.max(sel.x, e.x),
                    y1 = Math.min(sel.y, e.y),
                    y2 = Math.max(sel.y, e.y)
                const set = sel.init.withMutations(set => {
                    for (const [pic, id] of elems.current.items.entries()) {
                        const br = document.body.getBoundingClientRect(), pr = pic.getBoundingClientRect(),
                            x = pr.left - br.left, y = pr.top - br.top
                        if (x1 <= x + pr.width && x2 >= x && y1 <= y + pr.height && y2 >= y)
                            set.add(id.current as I)
                    }
                })
                setSelected(set)
            }
        }, 50, true)


    usePointerDrag({ dragging, drag, selected, sel, onDrag, onDragEnd, check, allowSelect }, ev => {
        const { target, id, drop } = findElement(ev.target, elems.current)
        if (target && id !== undefined && !ev.mouse?.button && ev.mouse?.shiftKey !== true) {
            ref.current = target
            const { left: startX, top: startY, width: w, height: h } = target.getBoundingClientRect()
            setDragging({ id, html: target.outerHTML, startX: startX + window.scrollX, startY: startY + window.scrollY, w, h })
        } else if (ev.allowSelect && ev.mouse?.button === 0 && (id === undefined || ev.mouse?.shiftKey) && drop !== undefined) {
            setSel({ x: ev.x, y: ev.y, init: selected, dragged: false })
        } else {
            return false
        }
        return true
    }, ({ sel, dragging, drag, selected, onDrag, check, ...ev }) => {
        const off = getOffset()
        if (dragging && (drag || ev.mouse)) {
            const { id, drop } = findElement(ev.target, elems.current),
                { mx, my, lastItem, lastZone, startX, startY } = dragging
            if (id !== undefined && id !== lastItem || drop !== undefined && drop !== lastZone) {
                if (id === undefined || id !== dragging.id && !selected.has(id)) {
                    dragging.lastItem = id
                    dragging.lastZone = drop
                    onDrag(drop!, id)
                }
            }
            const d = dragRef.current?.children[0] as HTMLElement | undefined
            if (mx === undefined || my === undefined) {
                dragging.mx = ev.x
                dragging.my = ev.y
                setDrag(true)
                setSelected(s => s.has(dragging.id) ? s : Set([dragging.id]))
                return true
            }
            if (!d) return true
            const dx = ev.x - mx, dy = ev.y - my
            d.style.left = Math.min(off.width - dragging.w, Math.max(0, startX + dx - off.left)) + 'px'
            d.style.top = Math.min(off.height - dragging.h, Math.max(0, startY + dy - off.top)) + 'px'
        } else if (sel) {
            const s = selRef.current
            if (!s) return true
            if (!sel.dragged)
                setSel(s => s && ({ ...s, dragged: true }))
            s.style.left = -off.left + Math.min(sel.x, ev.x) + 'px'
            s.style.top = -off.top + Math.min(sel.y, ev.y) + 'px'
            s.style.width = Math.abs(sel.x - ev.x) + 'px'
            s.style.height = Math.abs(sel.y - ev.y) + 'px'
            check(ev)
        } else {
            if (dragging)
                setDragging(undefined)
            return false
        }
        return true
    }, ({ sel, dragging, onDragEnd }) => {
        if (dragging) {
            const { lastItem, lastZone } = dragging
            if (onDragEnd && lastZone !== undefined)
                onDragEnd(lastZone, lastItem)
            setDragging(undefined)
            setDrag(false)
            setSelected(Set())
        } else if (sel) {
            !sel.dragged && setSelected(Set())
            setSel(undefined)
        }
    })

    useEffect(() => {
        const c = ref.current, d = dragRef.current?.children[0] as HTMLElement | undefined
        if (!dragging || !c || !d) return
        let valid = true
        const off = getOffset(),
            { left: startX, top: startY, width, height } = c.getBoundingClientRect()
        d.style.width = width + 'px'
        d.style.height = height + 'px'
        d.style.left = startX + window.scrollX - off.left + 'px'
        d.style.top = startY + window.scrollY - off.top + 'px'
        setTimeout(() => valid && (setDrag(true), setSelected(s => s.has(dragging.id) ? s : Set([dragging.id]))), 800)
        return () => { valid = false }
    }, [dragging])

    return (
        <div ref={container} className={s('drag-container', { className })} onClickCapture={ev => drag && ev.stopPropagation()} {...rest}>
            <DragContext.Provider value={elems.current}>
                {children}
            </DragContext.Provider>
            {sel && <div className={s.select} ref={selRef} />}
            {dragging && <div className={`${s.dragging} ${drag ? s.active : ''}`} ref={dragRef} dangerouslySetInnerHTML={{ __html: dragging.html }} />}
        </div>
    )
}
type Maps = { items: Map<HTMLElement, MutableRefObject<any>>, zones: Map<HTMLElement, MutableRefObject<any>> }
const DragContext = createContext(undefined as any as Maps)

function createUseDrag(key: 'items' | 'zones') {
    return function <T extends HTMLElement>(id: unknown) {
        const items = useContext(DragContext)[key],
            ref = useRef(id),
            prevElem = useRef<T>()
        ref.current = id
        return (e: T | null) => {
            if (prevElem.current)
                items.delete(prevElem.current)
            if (e) {
                prevElem.current = e
                items.set(e, ref)
            }
        }
    }
}

export const useDragItem = createUseDrag('items')

export const useDragZone = createUseDrag('zones')

function findElement(target: unknown, { items, zones }: Maps) {
    let e = target as HTMLElement | null | undefined
    for (let i = 0; i < 5 && e && !(items.has(e) || zones.has(e)); e = e.parentElement, i++) { }
    if (!e)
        return {}
    if (zones.has(e))
        return { target: e, drop: zones.get(e)!.current }
    if (!items.has(e))
        return {}
    let z: HTMLElement | null | undefined = e
    for (let i = 0; i < 5 && z && !zones.has(z); z = z.parentElement, i++) { }
    if (!(z && zones.has(z)))
        return {}
    return { target: e, id: items.get(e)!.current, drop: zones.get(z)!.current }
}
