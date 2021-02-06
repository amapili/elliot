import { ReactNode, ReactElement, JSXElementConstructor, Children } from 'react'

type Props<T> = T extends JSXElementConstructor<infer P> ? P : never

export function isElement<T extends JSXElementConstructor<any>, P extends Props<T> = Props<T>>(elem: T, child: unknown): child is ReactElement<P, T> {
    return (child as any)?.type === elem
}

export function isElements<T extends JSXElementConstructor<any>, P extends Props<T> = Props<T>>(elems: readonly T[], child: unknown): child is ReactElement<P, T> {
    return elems.indexOf((child as any)?.type) !== -1
}

export function isReactElement(child: unknown): child is ReactElement {
    return !!(child as any)?.type
}

export function mapChildrenOfType<T extends JSXElementConstructor<any>, C extends ReactNode, U>(elem: T, children: C | C[], fn: (child: ReactElement<Props<T>, T>, index: number) => U) {
    return Children.map(children, (child, i) => {
        return isElement(elem, child) ? fn(child, i) : child
    })
}

export function mapChildrenOfTypes<T extends JSXElementConstructor<any>, C extends ReactNode, U>(elems: readonly T[], children: C | C[], fn: (child: ReactElement<Props<T>, T>, index: number) => U) {
    return Children.map(children, (child, i) => {
        return elems.indexOf((child as any)?.type) !== -1 ? fn(child as any, i) : child
    })
}
