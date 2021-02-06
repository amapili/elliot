import { ReactNode, useState, RefObject, useEffect, useMemo, useCallback, useRef } from 'react'
import { Seq } from 'immutable'
import TreeNode from './TreeNode'

const DEFAULT_PAD = 400,
    DEFAULT_PAGE = 20,
    DEFAULT_BRANCH = 5

export interface DynamicListProps<Row> {
    pageSize?: number
    branch?: number
    container: RefObject<any>
    rows: Iterable<Row>
    load?: { hasMore(): boolean, loadMore(): Promise<void>, onVisibilityChange?: (min: number, max: number) => void }
    children: (row: Row, index: number) => JSX.Element | null
    checkVisibility?: (start: number, end: number) => boolean
    loading?: ReactNode
    empty?: ReactNode
    dummy?: ReactNode
    padding?: number
}

export default function DynamicList<Row>({ load: loadProp, rows: rowData, checkVisibility, padding = DEFAULT_PAD, pageSize = DEFAULT_PAGE, branch = DEFAULT_BRANCH, children, container, loading, empty, dummy }: DynamicListProps<Row>) {
    const [visibility, setVisibility] = useState({ min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }),
        visibilityRef = useRef(visibility),
        observer = useMemo(() => {
            if (checkVisibility || typeof IntersectionObserver === 'undefined')
                return undefined as never
            const visibilitySet = new WeakMap<HTMLElement, boolean>(),
                vis: { [k: number]: boolean | undefined } = {}
            return new IntersectionObserver((set) => {
                set.forEach(entry => {
                    const el = entry.target as HTMLElement,
                        parent = container.current
                    if (!el.isConnected || !parent)
                        return observer.unobserve(el)
                    visibilitySet.set(el, entry.isIntersecting)
                })
                const parent = container.current
                if (!parent) return
                let min = Number.POSITIVE_INFINITY, max = Number.NEGATIVE_INFINITY
                const add: Array<HTMLElement> = []
                Array.prototype.forEach.call(parent.children, (child: HTMLElement, i: number) => {
                    if (visibilitySet.has(child)) {
                        vis[i] = visibilitySet.get(child)
                    } else {
                        add.push(child)
                    }
                })
                Array.prototype.forEach.call(parent.children, (child: HTMLElement, i: number) => {
                    if (vis[i]) {
                        min = Math.min(i, min)
                        max = Math.max(i, max)
                    }
                })
                setTimeout(() => add.forEach(a => observer.observe(a)))
                setVisibility(v => v.max === max && v.min === min ? v : { min, max })
            }, { root: null, threshold: [0, 0.1], rootMargin: `${padding}px 0px ${padding}px 0px` })
        }, [checkVisibility, padding]),
        rootSize = useMemo(() => Math.pow(branch, branch - 1), [branch]),
        rows = useMemo(() => Seq.Indexed(rowData), [rowData]),
        length = useRef(0),
        load = useRef(loadProp),
        [done, setDone] = useState(() => !loadProp?.hasMore()),
        loadingMore = useRef(false),
        [err, setErr] = useState<any>(),
        isVisible = useCallback((start: number, end: number) => {
            if (checkVisibility)
                return checkVisibility(start, end)
            const { min, max } = visibilityRef.current,
                parent = container.current
            if (parent && end - start === branch) {
                for (let i = start; i < end; i++) {
                    const child = parent.children[i]
                    child && observer.observe(child)
                }
            }
            return min === Number.POSITIVE_INFINITY ? true : !(start > max || end < min)
        }, [done, padding, branch, checkVisibility])

    length.current = rows.count()
    load.current = loadProp
    visibilityRef.current = visibility

    useEffect(() => {
        const done = !load.current?.hasMore()
        setDone(done)
        let valid = true
        if (!done && !loadingMore.current && visibility.max >= length.current) {
            loadingMore.current = true
            new Promise(r => r(load.current?.loadMore()))
                .then(() => { }, e => valid && setErr(e))
                .finally(() => loadingMore.current = false)
        }
        return () => { valid = false }
    }, [rows, visibility.max])

    useEffect(() => {
        const { min, max } = visibility
        if (isFinite(min))
            load.current?.onVisibilityChange?.call(load.current, min, max)
    }, [visibility])

    if (err) throw err

    return (
        <>
            <TreeNode
                size={rootSize}
                branch={branch}
                length={(done ? 0 : pageSize) + length.current}
                isVisible={isVisible}
                visible={true}
                rows={rows}
                render={children}
                loading={loading}
                dummy={dummy}
            />
            {done && length.current === 0 && empty}
        </>
    )
}
