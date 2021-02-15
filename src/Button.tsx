import { useMemo, MouseEvent, useState, useEffect, ComponentPropsWithRef, forwardRef } from 'react'
import useLinkClick, { LinkableProps } from "./hooks/useLinkClick"
import Spinner from "./Spinner"
import { useStyle } from './hooks/useStyle'

type PR<T, P extends keyof T> = Partial<Omit<T, P>> & Required<Pick<T, P>>

export type ButtonProps = Omit<ComponentPropsWithRef<'button'>, 'onClick'> & {
	loading?: boolean
	variant?: 'text' | 'filled' | 'outlined'
	color?: 'secondary' | 'primary' | 'danger'
	size?: 'small' | 'medium' | 'large'
	containerClass?: string
} & ({
	onClick?: (ev: MouseEvent<HTMLButtonElement>) => unknown
	to?: undefined
	replace?: undefined
	back?: undefined
	external?: undefined
} | PR<LinkableProps, 'to'>)

const noClick = (ev: MouseEvent) => ev.preventDefault()

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = 'text', color, size, disabled: isDisabled, className, loading: isLoading, to, replace, back, external, containerClass, onClick, children, ...others }: ButtonProps, ref) {
	const s = useStyle(),
		[promise, setPromise] = useState<Promise<unknown>>(),
		loading = isLoading ?? !!promise,
		disabled = isDisabled || loading,
		cn = s('button', variant, color, size, { disabled, className }),
		linkClick = useLinkClick({ onClick, to, replace, back } as any),
		btnClick = useMemo(() => onClick ? (ev: MouseEvent<HTMLButtonElement>) => {
			ev.preventDefault()
			const v = onClick.call(null, ev)
			if (v instanceof Promise)
				setPromise(v)
		} : undefined, [onClick])

	useEffect(() => {
		if (!promise) return
		let valid = true
		promise.finally(() => valid && setPromise(undefined))
		return () => { valid = false }
	}, [promise])

	return to ? (
		<a href={to.toString()} onClick={disabled ? noClick : linkClick} className={s('btn-container', { className: containerClass })}>
			<button disabled={disabled} className={cn} ref={ref} {...others}>
				{children}
			</button>
		</a>
	) : (
		<span className={s('btn-container', { className: containerClass })}>
			<button disabled={disabled} className={cn} onClick={btnClick} ref={ref} {...others}>
				{children}
				{loading && <Spinner />}
			</button>
		</span>
	)
})

export default Button
