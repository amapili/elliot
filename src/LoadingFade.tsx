import { ComponentProps } from 'react'
import { useStyle } from './hooks/useStyle'

export default function LoadingFade({ className, ...rest }: ComponentProps<'div'>) {
    const s = useStyle()
    return (
        <div className={s('loading-fade', { className })} {...rest} />
    )
}
