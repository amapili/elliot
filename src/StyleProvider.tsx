import { createContext, PropsWithChildren, ReactNode, useContext, useMemo } from 'react'

export interface IconConfig {
    info: () => ReactNode
    warning: () => ReactNode
    error: () => ReactNode
    success: () => ReactNode
    x: () => ReactNode
    checkmark: () => ReactNode
    radio: () => ReactNode
    external: () => ReactNode
    add: () => ReactNode
    select: () => ReactNode
}

type Styles = { [k: string]: string } & { icons: IconConfig }
type Arg = string | false | undefined | Arg[] | { [k: string]: any }

export type Style = ((...args: Arg[]) => string) & Styles
export const StyleContext = createContext<Style>(Object.assign(() => '', {
    icons: {
        info: () => null,
        warning: () => null,
        error: () => null,
        success: () => null,
        x: () => null,
        checkmark: () => null,
        radio: () => null,
        external: () => null,
        add: () => null,
        select: () => null,
    }
}) as Style)

function mergeClasses(p: Styles, n: Styles) {
    const out: Styles = Object.assign({}, p)
    for (const k in n) {
        if (k in out)
            out[k] += ' ' + n[k]

        else
            out[k] = n[k]
    }
    return out
}

function getClassNames(s: Styles) {
    return Object.assign(function cn(...args: Arg[]) {
        const classes = []

        for (const arg of args) {
            if (!arg)
                continue

            if (typeof arg === 'string') {
                classes.push(s[arg])
            } else if (Array.isArray(arg)) {
                if (arg.length) {
                    const inner = cn.apply(null, arg)
                    if (inner)
                        classes.push(s[inner])
                }
            } else {
                for (const key in arg) {
                    if (arg[key]) {
                        classes.push(key === 'className' ? arg[key] : s[key])
                    }
                }
            }
        }

        return classes.join(' ')
    }, s)
}


function mergeConfig(prev: Styles, icons?: Partial<IconConfig>) {
    if (!icons)
        return prev
    const out = { ...prev.icons }
    for (const k in icons) {
        const i = icons[k as keyof IconConfig]
        if (!i)
            continue
        out[k as keyof IconConfig] = i
    }
    prev.icons = out
    return prev
}

export interface StyleProviderProps {
    value: Styles
    icons?: Partial<IconConfig>
}

export default function StyleProvider({ value, icons, children }: PropsWithChildren<StyleProviderProps>) {
    const prev = useContext(StyleContext),
        current = useMemo(() => getClassNames(mergeConfig(mergeClasses(prev, value), icons)), [value, icons])
    return (
        <StyleContext.Provider value={current}>
            {children}
        </StyleContext.Provider>
    )
}
