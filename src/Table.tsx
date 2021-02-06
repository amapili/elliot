import { HTMLAttributes } from 'react'
import { useStyle } from './hooks/useStyle'


export function Table({ children, className, ...rest }: HTMLAttributes<HTMLTableElement>) {
    const s = useStyle()
    return (
        <table className={`${s.table} ${className || ''}`} {...rest}>
            {children}
        </table>
    )
}
