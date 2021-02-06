import { useState, useMemo, useCallback, useRef } from 'react'
import Dropdown from './Dropdown'
import Option from "./Option"
import { List } from 'immutable'
import { useStyle } from './hooks/useStyle'
import useInputId from "./hooks/useInputId"
import useFormInput from "./hooks/useFormInput"

export interface SelectProps<T> {
    label?: string
    labels: Iterable<string>
    values: Iterable<T>
    onChange?: (v: T) => unknown
    value?: T
    className?: string
    id?: string
    name?: string
}

export default function Select<T>({ label, labels: il, values: iv, onChange: oc, value: v, className, ...rest }: SelectProps<T>) {
    const [open, setOpen] = useState(false),
        [labels, values] = useMemo(() => [List(il), List(iv)], [il, iv]),
        [value, onChange] = useFormInput(values.get(0, '' as never), rest.name, v, oc),
        selected = useMemo(() => values.indexOf(value), [values, value]),
        ref = useRef<HTMLDivElement>(null),
        id = useInputId(rest),
        s = useStyle(),
        handleSelect = useCallback((i: number) => {
            if (onChange)
                onChange(values.get(i, undefined as never))
            setOpen(false)
        }, [onChange, values])
    return (
        <div className={s('field', 'text', 'select', { className })}>
            <Dropdown show={open} node={
                <div
                    className={s('input', 'filled')}
                    onFocus={() => setOpen(true)}
                    onClick={() => setOpen(true)}
                    tabIndex={0}
                    ref={ref}>
                    {labels.get(selected, '')}
                    {s.icons.select()}
                </div>}
                posRef={ref}
                selected={selected}
                onSelect={handleSelect}
                onClickOutside={() => setOpen(false)}>
                {labels.map((str, i) => <Option key={i}>{str}</Option>)}
            </Dropdown>
            <select className={s.validator} placeholder=" " id={id}>
                {labels.map((str, i) => <option key={i} value={'' + values.get(i)}>{str}</option>)}
            </select>
            {label && <label className={s.label} htmlFor={id}>{label}</label>}
        </div>
    )
}
