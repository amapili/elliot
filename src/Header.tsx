import { PropsWithChildren, HTMLAttributes } from 'react'
import { useStyle } from './hooks/useStyle'

export interface HeaderProps<T extends keyof HTMLElementTagNameMap> extends HTMLAttributes<HTMLElementTagNameMap[T]> {
    as?: T
    banner?: boolean
}

export default function Header<T extends keyof HTMLElementTagNameMap = 'header'>({ as, banner, className, children, ...rest }: PropsWithChildren<HeaderProps<T>>) {
    const Elem: any = as || 'header',
        s = useStyle()

    return (
        <Elem className={s('header', { banner, className })} {...rest}>
            {children}
        </Elem>
    )
}
