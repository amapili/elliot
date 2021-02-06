import { ComponentProps, useState, useEffect } from 'react'
import { useStyle } from './hooks/useStyle'

export interface SpinnerProps extends ComponentProps<'div'> {
    size?: number
    delay?: number
    inline?: boolean
}

export default function Spinner({ inline, size, delay, className, style, ...rest }: SpinnerProps) {
    const [hidden, setHidden] = useState(!!delay),
        st = size ? { fontSize: size, ...style } : style,
        s = useStyle()
    useEffect(() => {
        let valid = true
        if (delay) {
            setTimeout(() => {
                if (!valid)
                    return
                setHidden(false)
            }, delay)
        }
        return () => { valid = false }
    }, [])
    if (hidden)
        return null
    const sp = (
        <svg viewBox="22 22 44 44">
            <circle
                cx={44}
                cy={44}
                r={20}
                fill="none"
                stroke="currentColor"
                strokeWidth={4} />
        </svg>
    )
    return inline ? (
        <div className={s('spinner', { className })} style={st} {...rest}>
            {sp}
        </div>
    ) : (
            <div className={s('loading', { className })} style={st} {...rest}>
                <div className={s.spinner}>{sp}</div>
            </div>
        )
}
