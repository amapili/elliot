import { HTMLAttributes } from 'react'
import { useStyle } from './hooks/useStyle'

export type FieldButtonsProps = Omit<HTMLAttributes<HTMLDivElement>, 'tabIndex'>

export default function FieldButtons({ className, children, ...rest }: FieldButtonsProps) {
    const s = useStyle()
    return (
        <div className={s('field-btns', { className })} tabIndex={-1} {...rest}>
            {children}
        </div>
    )
}
