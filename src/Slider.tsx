import { useState, useRef, useCallback, useEffect, HTMLAttributes, MouseEvent as ReactMouseEvent , TouchEvent as ReactTouchEvent } from 'react'
import { useStyle } from './hooks/useStyle'

export interface SliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value: number
    min: number
    max: number
    onChange: (v: number) => unknown
}

export default function Slider({ className, value, min, max, onChange, ...rest }: SliderProps) {
    const s = useStyle(),
        [active, setActive] = useState(false),
        [num, setNum] = useState(Math.min(max, Math.max(min, value || 0))),
        [left, setLeft] = useState((num - min) / (max - min)),
        handle = useRef<HTMLDivElement>(null),
        bar = useRef<HTMLDivElement>(null),
        mouseDown = useCallback((e: ReactMouseEvent) => {
            if (!bar.current || !handle.current) return
            setActive(true)
            e.preventDefault()
            let n = value || 0
            const l = handle.current.offsetLeft + 12,
                w = bar.current.getBoundingClientRect().width,
                ms = e.clientX,
                mm = (e: MouseEvent) => {
                    const p = Math.min(1, Math.max(0, (l + e.pageX - ms) / w))
                    setLeft(p)
                    setNum(n = Math.round(p * (max - min)) + min)
                }, mu = () => {
                    window.removeEventListener('mousemove', mm)
                    window.removeEventListener('mouseup', mu)
                    onChange(n)
                    setActive(false)
                }
            window.addEventListener('mousemove', mm)
            window.addEventListener('mouseup', mu)
        }, [value]), touchStart = useCallback((e: ReactTouchEvent) => {
            const t = e.touches[0]
            if (!bar.current || !handle.current || !t) return
            e.preventDefault()
            setActive(true)
            let n = value || 0
            const l = handle.current.offsetLeft + 12,
                w = bar.current.getBoundingClientRect().width,
                ms = t.screenX,
                mm = (e: TouchEvent) => {
                    const t = e.touches[0]
                    if (!t) return
                    const p = Math.min(1, Math.max(0, (l + t.screenX - ms) / w))
                    setLeft(p)
                    setNum(n = Math.round(p * (max - min)) + min)
                }, mu = () => {
                    window.removeEventListener('touchmove', mm)
                    window.removeEventListener('touchend', mu)
                    onChange(n)
                    setActive(false)
                }
            window.addEventListener('touchmove', mm)
            window.addEventListener('touchend', mu)
        }, [])
    useEffect(() => {
        setNum(Math.min(max, Math.max(min, value || 0)))
        setLeft(((value || 0) - min) / (max - min))
    }, [value])

    return (
        <div className={s('slider', { className })} {...rest}>
            <div className={s.background} ref={bar} />
            <div style={{ left: left * 100 + '%' }} ref={handle} className={s('handle', { active })} onMouseDown={mouseDown} onTouchStart={touchStart}>
                <span>{num}</span>
            </div>
            <input className={s.validator} type="range" min={min} max={max} value={value} onChange={e => onChange(e.target.valueAsNumber)} />
        </div>
    )
}
