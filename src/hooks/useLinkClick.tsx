import { MouseEvent, useCallback } from 'react'
import Route from '../Route'
import useRouting from "./useRouting"

export interface LinkableProps<E = HTMLAnchorElement> {
	to?: Route | string
	replace?: boolean
	back?: boolean
	external?: boolean
	onClick?: (e: MouseEvent<E>) => unknown
}

export default function useLinkClick({ onClick, to, replace, back, external }: LinkableProps) {
	const { replaceTo, backTo, goTo } = useRouting()
	return useCallback((ev: MouseEvent<HTMLAnchorElement>) => {
		if (!to && onClick) {
			ev.preventDefault()

			onClick && onClick(ev)
		}
		if (!(to instanceof Route) || external || ev.button !== 0 || ev.ctrlKey || ev.shiftKey || ev.metaKey) {
			return
		}
		ev.preventDefault()

		onClick && onClick(ev)
		if (to) {
			if (replace)
				replaceTo(to)
			else if (back)
				backTo(to)

			else
				goTo(to)
		}
	}, [onClick, to, replace, back])
}
