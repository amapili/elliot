import { Key, Children, cloneElement, ComponentProps, useRef, useEffect } from 'react'
import Link from './Link'
import { isElements } from './util/is-element'
import { useStyle } from './hooks/useStyle'
import useDebouncedEvent from './hooks/useDebouncedEvent'
import Route from './Route'
import Button from './Button'

export interface TabsProps extends Omit<ComponentProps<'nav'>, 'onSelect'> {
    onSelect?: (k: Key) => unknown
    active?: Key
    route?: Route
}

export default function Tabs({ children, className, onSelect, active, route, ...rest }: TabsProps) {
    let i = 0, selected = 0
    const s = useStyle(),
        cont = useRef<HTMLDivElement>(null),
        resize = useDebouncedEvent('resize'),
        c = Children.map(children, child => {
            if (isElements([Link, Button], child)) {
                const key = child.key,
                    self = i++,
                    current = active != null && active === key || child.props.to instanceof Route && route?.item === child.props.to.item
                if (current)
                    selected = self
                return cloneElement(child, {
                    className: (child.props.className || '') + (current ? s.current : ''),
                    onClick: function () {
                        // setCurrent(Math.max(0, self - 1))
                        key != null && onSelect && onSelect(key)
                        child.props.onClick?.apply(null, arguments)
                    }
                })
            }
            return null
        })
    useEffect(() => {
        const p = cont.current, s = p?.children[0] as HTMLElement, c = p?.children[selected + 1] as HTMLElement
        if (!s || !p || !c)
            return
        const l = p.getBoundingClientRect().left,
            r = c.getBoundingClientRect()
        s.style.left = r.left - l + 'px'
        s.style.width = r.width + 'px'
    }, [selected, resize])
    return (
        <nav className={s('tabs', { className })} {...rest}>
            <div ref={cont}>
                <div className={s.show} />
                {c}
            </div>
        </nav>
    )
}
