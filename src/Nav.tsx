import { Key, Children, cloneElement, ReactNode, ComponentProps } from 'react'
import Link from './Link'
import { isElement, isElements } from './util/is-element'
import { useStyle } from './hooks/useStyle'
import Route from './Route'
import Button from './Button'
import IconButton from './IconButton'
import SubNav from "./SubNav"

export interface NavProps extends Omit<ComponentProps<'nav'>, 'onSelect'> {
    onSelect?: (k: Key) => unknown
    active?: Key
    route?: Route
    vertical?: boolean
    justify?: boolean
    fill?: boolean
}

export default function Nav({ children, className, onSelect, active, route, vertical, justify, fill, ...rest }: NavProps) {
    const s = useStyle()
    return (
        <nav className={s('nav', { vertical, fill, justify, className })} {...rest}>
            {mapNavChildren(children, s, { active, route, onSelect })}
        </nav>
    )
}


function mapNavChildren<C>(c: C | C[], s: any, { active, route, onSelect }: { active?: Key; route?: Route; onSelect?: (k: Key) => unknown }): ReactNode {
    return Children.map(c, child => {
        if (isElements([Link, Button, IconButton], child)) {
            const key = child.key
            return cloneElement(child, {
                className: (child.props.className || '') + (active != null && active === key || child.props.to && route?.toString().startsWith(child.props.to.toString()) ? ' ' + s.current : ''),
                onClick: key != null && onSelect ? function () {
                    onSelect(key)
                    child.props.onClick?.apply(null, arguments)
                } : child.props.onClick as any
            })
        }
        if (isElement(SubNav, child)) {
            const item = child.props.item
            if (!isElement(Link, item))
                return
            const key = item.key,
                current = !!(active != null && active === item.key || item.props.to && route?.toString().startsWith(item.props.to.toString()))
            return cloneElement(child, {
                item: current || onSelect ? cloneElement(item, {
                    className: (item.props.className || '') + ' ' + s.current,
                    onClick: key != null && onSelect ? function () {
                        onSelect(key)
                        item.props.onClick?.apply(null, arguments)
                    } : item.props.onClick
                }) : item,
                children: mapNavChildren(child.props.children, s, { active, route, onSelect }),
                current
            })
        }
        return child
    })
}
