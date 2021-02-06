import { ComponentPropsWithRef, forwardRef } from 'react'
import { useStyle } from './hooks/useStyle'
import useLinkClick, { LinkableProps } from './hooks/useLinkClick'

export type LinkProps = LinkableProps & Omit<ComponentPropsWithRef<'a'>, 'onClick'> & {
	color?: 'inherit' | 'primary' | 'secondary' | 'warning' | 'danger' | 'success'
	noIcon?: boolean
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(props: LinkProps, ref) {
	const { to, children, className, noIcon, color, onClick, replace, back, external, ...others } = props,
		s = useStyle()
	return (
		<a href={to && to.toString()} onClick={useLinkClick(props)} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className={s('link', color && color !== 'inherit' && color, { className })} {...others} ref={ref}>
			{children}{external && !noIcon && s.icons.external()}
		</a>
	)
})

export default Link
