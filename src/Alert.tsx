import { ComponentProps, ReactNode } from 'react'
import { EventEmitter } from 'events'
import { useStyle } from './hooks/useStyle'
import IconButton from './IconButton'
import Collapse from './Collapse'

const events = new EventEmitter()
events.setMaxListeners(0)

export interface AlertProps extends ComponentProps<'div'> {
    severity?: 'info' | 'warning' | 'error' | 'success'
    color?: 'primary' | 'secondary' | 'warning' | 'danger' | 'success'
    icon?: ReactNode
    action?: ReactNode
    onClose?: () => unknown
    show?: boolean
}

const colors = {
    info: 'secondary',
    warning: 'warning',
    error: 'danger',
    success: 'success',
}

export default function Alert({ icon: propIcon, color: propColor, action, severity = 'info', onClose, show, className, children, ...rest }: AlertProps) {
    const s = useStyle(),
        icon = propIcon === undefined ? s.icons[severity]() : propIcon,
        color = propColor ?? colors[severity],
        Elem = show === undefined ? 'div' : Collapse
    return (
        <Elem show={show as any} className={s('alert', color, { show, className })} {...rest}>
            <div>
                {icon && <div className={s.icon}>{icon}</div>}
                <div className={s.content}>{children}</div>
                {action && <div className={s.action} onClick={onClose && (() => onClose())}>{action}</div>}
                {onClose && <IconButton onClick={onClose} className={s.close}>{s.icons.x()}</IconButton>}
            </div>
        </Elem>
    )
}
