import { useState, useEffect, PropsWithChildren, Children, cloneElement } from 'react'
import Popover, { PopoverProps } from './Popover'
import { isElement } from './util/is-element'
import Option, { OptionProps } from './Option'

export interface DropdownProps extends PopoverProps {
    onSelect?: (i: number) => void
    selected?: number
}

export default function Dropdown({ show, onSelect, children: c, selected, onClickOutside, ...others }: PropsWithChildren<DropdownProps>) {
    let items = 0
    const [hovered, setHovered] = useState(-1),
        children = Children.map(c, child => {
            if (isElement<typeof Option, OptionProps>(Option, child)) {
                const i = items++
                return cloneElement(child, {
                    selected: selected === i,
                    hovered: hovered === i,
                    setHovered: () => setHovered(i),
                    onClick: () => (onSelect?.call(null, i), child.props.onClick?.call(null))
                })
            }
            return child
        }),
        handleKeyDown = (e: KeyboardEvent) => {
            if (items === 0) return
            let incr = -1
            switch (e.key) {
                case 'Enter':
                    if (hovered !== -1) {
                        e.preventDefault()
                        if (onSelect)
                            onSelect(hovered)
                    }

                    break
                case 'ArrowDown':
                    e.preventDefault()
                    incr = 1
                // fallthrough
                case 'ArrowUp':
                    e.preventDefault()
                    setHovered(hovered === -1 ? selected ? selected : 0 : ((hovered + incr + items) % items))
                    break
                case 'Tab':
                    onClickOutside && onClickOutside(e as any)
            }
        }
    useEffect(() => {
        if (!show) return
        window.addEventListener('keydown', handleKeyDown, false)
        return () => { window.removeEventListener('keydown', handleKeyDown, false) }
    }, [show, handleKeyDown])
    return <Popover show={show} onClickOutside={onClickOutside} {...others}>
        {children}
    </Popover>
}
