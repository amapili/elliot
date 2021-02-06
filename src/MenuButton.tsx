import { useState, ReactNode } from 'react'
import Dropdown from './Dropdown'
import IconButton from './IconButton'
import { ButtonProps } from './Button'

export default function MenuButton({ children, icon, ...rest }: MenuButtonProps) {
	const [open, setOpen] = useState(false)
	return (
		<Dropdown show={open} node={<IconButton onClick={() => setOpen(true)} {...rest}>{icon}</IconButton>} onClickOutside={() => setOpen(false)} onSelect={() => setOpen(false)}>
			{children}
		</Dropdown>
	)
}

export type MenuButtonProps = ButtonProps & {
	icon: ReactNode
}
