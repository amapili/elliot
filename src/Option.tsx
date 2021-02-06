import { PropsWithChildren } from 'react'
import Link from './Link'
import Route from './Route'
import { useStyle } from './hooks/useStyle'


export default function Option(props: PropsWithChildren<OptionProps>) {
    const { to, onClick, selected, hovered, setHovered, className, children } = props as PropsWithChildren<OptionProps>,
        s = useStyle(),
        cn = s('menuItem', { hovered, selected, className })
    return to ? <Link to={to} onMouseEnter={setHovered} onClick={onClick} className={cn}>{children}</Link> : <div onMouseEnter={setHovered} onClick={onClick} className={cn}>{children}</div>
}

export interface OptionProps {
    className?: string
    to?: Route
    onClick?: () => void
    selected?: boolean
    hovered?: boolean
    setHovered?: () => void
}
