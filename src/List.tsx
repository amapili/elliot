import { createClassComponent } from './util/component'

export const List = createClassComponent('ul')<{ variant?: 'list' | 'grid'} >((s, { variant = 'list', className, ...rest }) => [
    s('list', { [variant]: variant !== 'list', className }), rest
])

export default List
