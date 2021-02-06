import { PropsWithChildren, HTMLAttributes } from 'react'
import Link, { LinkProps } from './Link'
import { useStyle } from './hooks/useStyle'

export interface CardProps<T extends keyof HTMLElementTagNameMap> extends HTMLAttributes<HTMLElementTagNameMap[T]> {
    as?: T
    body?: boolean
}

function CardContainer<T extends keyof HTMLElementTagNameMap = 'section'>({ as, body, className, children, ...rest }: PropsWithChildren<CardProps<T>>) {
    const Elem: any = as || 'section',
        s = useStyle()

    return (
        <Elem className={s('card', { className })} {...rest}>
            {body ? <CardBody>{children}</CardBody> : children}
        </Elem>
    )
}

export interface CardBodyProps<T extends keyof HTMLElementTagNameMap> extends HTMLAttributes<HTMLElementTagNameMap[T]> {
    as?: T
}

function CardBody<T extends keyof HTMLElementTagNameMap = 'div'>({ as, className, children, ...rest }: PropsWithChildren<CardBodyProps<T>>) {
    const Elem: any = as || 'div',
        s = useStyle()

    return (
        <Elem className={s('cardBody', { className })} {...rest}>
            {children}
        </Elem>
    )
}

export interface CardDeckProps<T extends keyof HTMLElementTagNameMap> extends HTMLAttributes<HTMLElementTagNameMap[T]> {
    as?: T
    group?: boolean
    columns?: boolean
}

function CardDeck<T extends keyof HTMLElementTagNameMap = 'div'>({ as, group, columns, className, children, ...rest }: PropsWithChildren<CardDeckProps<T>>) {
    const Elem: any = as || 'div',
        s = useStyle()

    return (
        <Elem className={s(group ? 'cardGroup' : columns ? 'cardCols' : 'cardDeck', { className })} {...rest}>
            {children}
        </Elem>
    )
}

function CardLink({ children, className, ...rest }: LinkProps) {
    const s = useStyle()
    return (
        <Link className={s('cardLink', { className })}  {...rest}>
            {children}
        </Link>
    )
}


const Card: typeof CardContainer & { Body: typeof CardBody, Deck: typeof CardDeck, Link: typeof CardLink } = ((l: any) => (l.Body = CardBody, l.Deck = CardDeck, l.Link = CardLink, l))(CardContainer)

export default Card
