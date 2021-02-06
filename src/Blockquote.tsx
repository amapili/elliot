import { PropsWithChildren } from 'react'
import { useStyle } from './hooks/useStyle'


export default function Blockquote({ children }: PropsWithChildren<{}>) {
    const s = useStyle()
    return (
        <blockquote className={`${s.blockquote}`}>
            {children}
        </blockquote>
    )
}
