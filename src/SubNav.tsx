import { cloneElement, ReactNode, useState, ComponentProps } from 'react'
import { isReactElement } from './util/is-element'
import { useStyle } from './hooks/useStyle'
import IconButton from './IconButton'
import Collapse from './Collapse'

export interface SubNavProps extends ComponentProps<'nav'> {
    current?: boolean
    item: ReactNode
    show?: 'active' | 'toggle' | true | false
    defaultToggle?: boolean
    icon?: (open: boolean) => ReactNode
}

export default function SubNav({ item, children, className, current, show = 'active', defaultToggle, icon, ...rest }: SubNavProps) {
    const s = useStyle(),
        [toggle, setToggle] = useState(defaultToggle ?? true)
    return (
        <>
            {show === 'toggle' && isReactElement(item) ? cloneElement(item, {
                children: <>
                    {item.props.children}
                    <IconButton className={s.toggle} onClickCapture={e => (e.preventDefault(), e.stopPropagation(), setToggle(t => !t))}>
                        {icon && icon(toggle)}
                    </IconButton>
                </>
            }) : item}
            <Collapse show={show === 'active' ? !!current : show === 'toggle' ? toggle : show}>
                <nav className={s('subNav', { current, className })} {...rest}>
                    {children}
                </nav>
            </Collapse>
        </>
    )
}
