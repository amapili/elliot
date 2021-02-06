import { ComponentProps, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { useStyle } from './hooks/useStyle'
import useIsomorphicEffect from './hooks/useIsomorphicEffect'

export interface CollapseProps extends ComponentProps<'div'> {
    show: boolean
    dim?: 'height' | 'width'
    fade?: boolean
}

function CollapseImpl({ show: toggle, children, className, style, fade, dim = 'height', ...rest }: PropsWithChildren<CollapseProps>) {
    const [size, setSize] = useState(0),
        [show, setShow] = useState(toggle),
        [anim, setAnim] = useState(false),
        [measure, setMeasure] = useState(false),
        ref = useRef<HTMLDivElement>(null),
        scrollDim = dim === 'height' ? 'scrollHeight' : 'scrollWidth',
        s = useStyle()
    useEffect(() => {
        if (show === toggle) return
        setShow(toggle)
        setSize(toggle ? 0 : ref.current!.getBoundingClientRect()[dim])
        setMeasure(true)
        setAnim(true)
    }, [toggle])
    useIsomorphicEffect(() => {
        if (!measure) return
        setMeasure(false)
        setSize((ref.current!.offsetHeight, show ? ref.current![scrollDim] : 0))
    }, [measure])
    useEffect(() => {
        if (!anim) return
        const t = setTimeout(() => setAnim(false), 150)
        return () => { clearTimeout(t) }
    }, [anim])
    return (
        <div
            className={s('collapse', { hide: !show && !anim, anim, className })}
            style={{ [dim]: anim ? size : undefined, opacity: fade && anim ? (size ? 1 : 0) : undefined, ...style }}
            ref={ref} {...rest}
        >
            {children}
        </div>
    )
}

export default function Collapse(props: PropsWithChildren<CollapseProps>) {
    const [show, setShow] = useState(props.show)
    useEffect(() => setShow(true), [])
    return show ? <CollapseImpl {...props} /> : null
}
