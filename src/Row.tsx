import { createClassComponent, SizedProps, FlexContainerProps, extractProps, FlexChildProps } from './util/component'

export type RowProps = {
    gutter?: boolean
} & SizedProps<{ display?: boolean } & FlexContainerProps & FlexChildProps, 'span'>

const Row = createClassComponent('div')<RowProps>((s, props) => extractProps(s, props, 'row', {
    gutter: true,
    display: true,
    pad: false,
    wrap: true,
    justify: 'flex-start',
    align: 'flex-start',
    order: 0,
    alignSelf: 'auto',
    span: 'auto',
}, 'span'))

export default Row
