import { ComponentProps } from 'react'
import { useStyle } from './hooks/useStyle'
import Backdrop, { BackdropProps } from './Backdrop'

export type DrawerProps = ComponentProps<'aside'> & Pick<BackdropProps, 'onClose' | 'overlay' | 'alwaysShow' | 'hideUntil' | 'portal'> & {
    show: boolean
    side: 'left' | 'right' | 'bottom' | 'top'
}

export default function Drawer({ show, side, overlay, alwaysShow, hideUntil, onClose, className, children, portal = false, ...rest }: DrawerProps) {
    const s = useStyle()
    return (
        <Backdrop show={show} overlay={overlay} alwaysShow={alwaysShow} hideUntil={hideUntil} onClose={onClose} portal={portal}>
            <aside className={s('drawer-' + side, { className })} {...rest}>
                {children}
            </aside>
        </Backdrop>
    )
}
