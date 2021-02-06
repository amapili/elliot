import { PropsWithChildren, HTMLAttributes } from 'react'
import { useStyle } from './hooks/useStyle'

export type TitleProps = { center?: boolean}  & HTMLAttributes<HTMLHeadingElement> & ({ sub?: boolean; h?: undefined}  | { sub?: undefined; h: 1 | 2 | 3 | 4 | 5 | 6} )

export default function Title({ children, sub, h, className, center, ...rest }: PropsWithChildren<TitleProps>) {
    const Elem: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = sub ? 'h2' : h ? ('h' + h as any) : 'h1',
        s = useStyle()
    return (
        <Elem className={`${s.title} ${sub ? s.sub : ''} ${center ? s.center : ''} ${className || ''}`} {...rest}>{children}</Elem>
    )
}
