import { useState, ReactNode, useRef, useCallback, useEffect, ComponentPropsWithRef, forwardRef, ReactElement, MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { useStyle } from './hooks/useStyle'
import useOverlayNode from './hooks/useOverlayNode'
import useBreakpoint from './hooks/useBreakpoint'
import { Sizes } from './util/component'

export interface BackdropProps<T = never> extends ComponentPropsWithRef<'div'> {
    onClose?: () => unknown
    show: T | false | null | undefined | '' | 0
    enterOnMount?: boolean
    children: ReactNode | ((t: T) => ReactNode)
    overlay?: boolean | Sizes
    alwaysShow?: Exclude<Sizes, 'xs'>
    hideUntil?: Exclude<Sizes, 'xl'>
    portal?: boolean
}

const Backdrop = forwardRef<HTMLDivElement, BackdropProps<any>>(function Backdrop({ show, onClose, overlay = true, portal = true, enterOnMount, alwaysShow, hideUntil, className, children, ...props }: BackdropProps<any>, refProp) {
    const [state, setState] = useState<'entering' | 'entered' | 'exiting'>(!show || enterOnMount ? 'entering' : 'entered'),
        node = useOverlayNode(),
        refOwn = useRef<HTMLDivElement>(null),
        ref = typeof refProp === 'object' && refProp ? refProp : refOwn,
        close = useCallback((e: MouseEvent) => {
            if (!onClose || !ref.current || state === 'entering')
                return
            if (e.target === ref.current)
                onClose()
        }, [onClose, state]),
        s = useStyle(),
        locked = useRef(false),
        lock = useBreakpoint({ max: overlay }) && overlay,
        child = useRef(show ? typeof children === 'function' ? children(show) : children : null)
    if (show)
        child.current = typeof children === 'function' ? children(show) : children
    useEffect(() => {
        if (show && state !== 'entered') {
            const t = window.setTimeout(() => setState('entered'), 1)
            return () => { window.clearTimeout(t) }
        }
        if (!show && state !== 'entering') {
            setState('exiting')
            const t = window.setTimeout(() => setState('entering'), 200)
            return () => { window.clearTimeout(t) }
        }
        return
    }, [show])
    useEffect(() => {
        if (lock && state === 'entered' && !locked.current)
            locked.current = lockScroll(s)
        if (locked.current && (state === 'exiting' || !lock))
            locked.current = unlockScroll()
    }, [state, lock])
    useEffect(() => {
        if (locked.current)
            locked.current = unlockScroll()
    }, [])
    const out = (
        <div className={s('backdrop', state, alwaysShow && ('show-' + alwaysShow), hideUntil && ('hide-' + hideUntil), overlay && ('overlay' + (overlay !== true && overlay !== 'xs' ? '-' + overlay : '')), { className })} ref={ref} onClick={close} {...props}>
            {alwaysShow ? children : child.current}
        </div>
    )
    return show || alwaysShow || state !== 'entering' ? portal ? createPortal(out, node) : out : null
}) as <T>(props: BackdropProps<T>) => ReactElement | null

export default Backdrop

let lock = 0, lockRestore = () => { }

function getScrollbarSize(): number {
    const div = document.createElement('div')
    div.style.width = '99px'
    div.style.height = '99px'
    div.style.position = 'absolute'
    div.style.top = '-9999px'
    div.style.overflow = 'scroll'

    document.body.appendChild(div)
    const scrollbarSize = div.offsetWidth - div.clientWidth
    document.body.removeChild(div)

    return scrollbarSize
}

function getPaddingRight(element: Element): number {
    return parseInt(window.getComputedStyle(element).paddingRight, 10) || 0
}

function lockScroll(s: any) {
    if (lock++) return true
    const container = document.body
    const restoreStyle: Array<{ property: string, el: HTMLElement, value: string }> = []
    if (window.innerWidth > document.documentElement.clientWidth) {
        const scrollbarSize = getScrollbarSize()

        restoreStyle.push({
            value: container.style.paddingRight,
            property: 'padding-right',
            el: container,
        })
        container.style.paddingRight = `${getPaddingRight(container) + scrollbarSize}px`

        const fixedElements = document.querySelectorAll(`.${s.overlay}, .${s['drawer-top']}, .${s['drawer-bottom']}, .${s['drawer-right']}`);
        [].forEach.call(fixedElements, (el: HTMLElement) => {
            restoreStyle.push({
                value: el.style.paddingRight,
                property: 'padding-right',
                el: el,
            })
            el.style.paddingRight = `${getPaddingRight(el) + scrollbarSize}px`
        })
    }

    const parent = container.parentElement
    const scrollContainer =
        parent?.nodeName === 'HTML' && window.getComputedStyle(parent).overflowY === 'scroll'
            ? parent
            : container

    restoreStyle.push({
        value: scrollContainer.style.overflow,
        property: 'overflow',
        el: scrollContainer,
    })
    scrollContainer.style.overflow = 'hidden'

    lockRestore = () => {
        restoreStyle.forEach(({ value, el, property }) => {
            if (value) {
                el.style.setProperty(property, value)
            } else {
                el.style.removeProperty(property)
            }
        })
    }
    return true
}

function unlockScroll() {
    if ((lock = Math.max(0, lock - 1)) === 0)
        lockRestore()
    return false
}
