import { PropsWithChildren } from 'react'
import { useStyle } from './hooks/useStyle'


export default function Footer({ children }: PropsWithChildren<{}>) {
    const s = useStyle()
    return (
        <footer className={`${s.footer} ${s.container} ${s.sm}`}>
            {children}
        </footer>
    )
}
