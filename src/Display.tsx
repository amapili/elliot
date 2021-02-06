import { createClassComponent, SizedProps, extractProps } from './util/component'

export type DisplayProps = SizedProps<{ display?: boolean }, 'display'>

const Display = createClassComponent('div')<DisplayProps>((s, props) => extractProps(s, props, '', {
    display: true
}, 'display'))

export default Display
