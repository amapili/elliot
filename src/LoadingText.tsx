import { ComponentProps, useMemo } from 'react'
import { useStyle } from './hooks/useStyle'

export interface LoadingTextProps extends ComponentProps<'div'> {
    length?: number
    sd?: number
    min?: number
}

function sampleLength(mu = 10, sigma = 2, min = Math.min(5, mu)) {
    const u1 = Math.random(),
        u2 = Math.random(),
        mag = sigma * Math.sqrt(-2.0 * Math.log(u1))
    return Math.max(min, mag * Math.cos(Math.PI * 2 * u2) + mu)
}

export default function LoadingText({ length, sd, min, className, style, ...rest }: LoadingTextProps) {
    const s = useStyle(),
        width = useMemo(() => sampleLength(length, sd, min) + 'em', [length, sd, min])
    return (
        <div className={s('loading-fade', 'text', { className })} style={{ width, ...style }} {...rest} />
    )
}
