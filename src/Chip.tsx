import { ComponentProps } from 'react'
import { useStyle } from './hooks/useStyle'
import IconButton from "./IconButton"

export interface ChipProps extends ComponentProps<'div'> {
    onDelete?: () => unknown
}

export default function Chip({ onDelete, className, children, ...rest }: ChipProps) {
    const s = useStyle()
    return (
        <div className={s('chip', { className })} {...rest}>
            <span>{children}</span>
            {onDelete && <IconButton onClick={onDelete}>{s.icons.x()}</IconButton>}
        </div>
    )
}
