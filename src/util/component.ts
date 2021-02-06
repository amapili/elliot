import { ComponentPropsWithRef, forwardRef, ComponentPropsWithoutRef, createElement, ReactNode } from 'react'
import { useStyle } from '../hooks/useStyle'
import { Style } from "../StyleProvider"

export function createClassComponent<T extends keyof JSX.IntrinsicElements>(defaultElem: T) {
    return function <P = {}>(fn: (s: Style, p: Omit<ComponentPropsWithoutRef<T>, keyof P> & P) => [string, Omit<ComponentPropsWithoutRef<T>, 'className'>, ...ReactNode[]]) {
        return forwardRef<any, any>(({ as: elem, ...props }, ref) => {
            const s = useStyle(),
                [className, rest, ...children] = fn(s, props)
            return createElement(elem ?? defaultElem, Object.assign({ ref, className }, rest as any), ...children)
        }) as (<E extends keyof JSX.IntrinsicElements = T>(props: Omit<ComponentPropsWithRef<E>, keyof P> & P & { as?: E }) => JSX.Element)
    }
}

type FlexBreak = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
type FlexJustify = 'flex-start' | 'flex-end' | 'center' | 'space-between'
type FlexAlign = 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline'
export type Sizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Dim = 'top' | 'left' | 'bottom' | 'right' | 'x' | 'y'

export type SizedProps<T, D extends keyof T> = {
    [K in Sizes | keyof T]?: K extends keyof T ? T[K] : T[D] | T
}

export interface FlexContainerProps {
    wrap?: boolean | 'reverse'
    justify?: FlexJustify
    align?: FlexAlign
}

export interface FlexChildProps {
    pad?: boolean | Dim
    order?: 0 | FlexBreak
    alignSelf?: 'auto' | FlexAlign
    span?: 'grow' | 'auto' | FlexBreak
}
const sizes = { xs: true, sm: true, md: true, lg: true, xl: true }
export function extractProps<P extends { [k: string]: any }>(s: Style, props: P, className: string, keyDefaults: {
    [K in keyof P]?: P[K] | null
}, defaultSizeKey: keyof P) {
    const rest: { [k: string]: any } = {},
        classes: { [k: string]: any } = { className: props.className }
    for (const k in props) {
        const value = props[k]
        if (value === undefined)
            continue
        const def = keyDefaults[k]
        if (def !== undefined) {
            classes[`${k}-${value}`] = value !== def
        } else if (k in sizes) {
            const sz = k === 'xs' ? '-' : '-' + k + '-'
            if (typeof value === 'object') {
                for (const vk in value) {
                    classes[vk + sz + value[vk]] = true
                }
            } else {
                classes[defaultSizeKey + sz + value] = true
            }
        } else if (k !== 'className') {
            rest[k] = value
        }
    }
    return [s(className, classes), rest] as [string, Omit<P, (keyof typeof keyDefaults) | Sizes>]
}