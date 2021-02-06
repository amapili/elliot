import { Sizes } from '../util/component'
import useDebouncedEvent from './useDebouncedEvent'

export function breakpoint({ min, max }: { min?: boolean | Sizes; max?: boolean | Sizes }) {
    const outMin = min === true ? true : window.innerWidth >= breakpoints[min || 'xs'],
        outMax = !max || max === true ? true : window.innerWidth < breakpoints[max]
    return outMax && outMin
}

export const breakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
}

function useBreakpointClient(bp: { min?: boolean | Sizes; max?: boolean | Sizes }) {
    useDebouncedEvent('resize')
    return breakpoint(bp)
}

const useBreakpoint = (typeof window === 'undefined' ? () => false : useBreakpointClient) as typeof useBreakpointClient
export default useBreakpoint 
