import { createClassComponent, Sizes, SizedProps, FlexContainerProps, extractProps } from './util/component'

export type ContainerProps = {
    fluid?: boolean | Exclude<Sizes, 'xs'>
} & SizedProps<FlexContainerProps, 'justify'>

const Container = createClassComponent('div')<ContainerProps>((s, props) => extractProps(s, props, 'container', {
    fluid: false,
    wrap: false,
    justify: 'flex-start',
    align: 'stretch',
}, 'justify'))

export default Container
