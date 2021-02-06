import { createClassComponent, SizedProps, FlexContainerProps, extractProps, FlexChildProps } from './util/component'

export type ColProps = SizedProps<{ display?: boolean}  & FlexContainerProps & FlexChildProps, 'span'>

const Col = createClassComponent('div')<ColProps>((s, props) => extractProps(s, props, 'col', {
    display: true,
    pad: 'x',
    wrap: false,
    justify: 'flex-start',
    align: 'stretch',
    order: 0,
    alignSelf: 'auto',
    span: 'grow',
}, 'span'))

export default Col
