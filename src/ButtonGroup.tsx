import { HTMLAttributes } from 'react'
import { useStyle } from './hooks/useStyle'

export default function ButtonGroup({ variant = 'text', color = 'secondary', className, children, ...rest }: ButtonGroupProps) {
	const s = useStyle()
	return (
		<div className={s('btn-group', variant, color, { className })} {...rest}>
			{children}
		</div>
	)
}

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
	variant?: 'text' | 'filled' | 'outlined'
	color?: 'secondary' | 'primary' | 'danger'
}
