import { ReactNode } from 'react'
import { createClassComponent } from './util/component'


export const ListItem = createClassComponent('li')<{ selected?: boolean} >((s, { selected, className, ...rest }) => [
    s('listItem', { selected, className }), rest
])

export const ListItemAction = createClassComponent('div')((s, { className, ...rest }) => [
    s('listItemAction', { className }), rest
])

export const ListItemImage = createClassComponent('div')((s, { className, ...rest }) => [
    s('listItemImage', { className }), rest
])

export const ListItemText = createClassComponent('div')<{
    primary: ReactNode
    secondary?: ReactNode
    children?: undefined
}>((s, { primary, secondary, className, ...rest }) => [
    s('listItemText', { className }),
    rest,
    <span>{primary}</span>,
    secondary && <span>{secondary}</span>
])
