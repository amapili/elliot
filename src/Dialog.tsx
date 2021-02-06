import { ComponentProps, ReactNode } from 'react'
import IconButton from "./IconButton"
import { useStyle } from './hooks/useStyle'
import Title from "./Title"
import Backdrop from './Backdrop'

interface DialogProps extends ComponentProps<'div'> {
	onClose?: () => any
	title?: string
}

interface DialogShowProps<T> extends DialogProps {
	show: T | false | null | undefined | '' | 0
	children: ReactNode | ((t: T) => ReactNode)
}

export default function Dialog<T>({ show, onClose, children, title, className, ...rest }: DialogShowProps<T>) {
	const s = useStyle()
	return (
		<Backdrop show={show} onClose={onClose}>{show =>
			<div className={s('dialog', { className })} {...rest}>
				{title && <Title>{title}</Title>}
				{onClose ? <IconButton className={s.close} onClick={onClose}>{s.icons.x()}</IconButton> : null}
				{typeof children === 'function' ? children(show) : children}
			</div>
		}</Backdrop>
	)
}
