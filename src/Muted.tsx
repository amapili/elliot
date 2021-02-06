import { HTMLAttributes } from 'react'
import { useStyle } from './hooks/useStyle'


export default function Muted({ children, className }: HTMLAttributes<HTMLSpanElement>) {
    const s = useStyle()
    return (
        <small className={`${s.muted} ${className || ''}`}>{children}</small>
    )
}
