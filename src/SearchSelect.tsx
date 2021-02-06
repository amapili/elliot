import { useState, useRef, useCallback, useEffect, ReactNode, Suspense } from 'react'
import { List, Seq } from 'immutable'
import Dialog from './Dialog'
import IconButton from "./IconButton"
import Dropdown from './Dropdown'
import Option from "./Option"
import { useStyle } from './hooks/useStyle'
import FieldButtons from "./FieldButtons"
import Chip from './Chip'
import useInputId from "./hooks/useInputId"

type SelectOptions<T> = Iterable<{ value: T, label: string }> | ((q: string) => Promise<Iterable<T>> | Iterable<T>)
type Val<T> = T extends SelectOptions<infer V> ? V : any

export type SearchSelectProps<Opts extends SelectOptions<any>> = {
    id?: string
    name?: string
    label?: string
    placeholder?: string
    required?: boolean
    add?: (q: string, done: (c: Val<Opts>) => unknown) => ReactNode
    className?: string
    options: Opts
    render?: (value: Val<Opts>) => ReactNode
} & ({
    multi: true
    value?: List<Val<Opts>>
    onChange: (v: List<Val<Opts>>) => unknown
} | {
    multi?: undefined
    value?: Val<Opts>
    onChange: (v: Val<Opts> | undefined) => unknown
})

export default function SearchSelect<Opts extends SelectOptions<any>, T extends Val<Opts> = Val<Opts>>(props: SearchSelectProps<Opts>) {
    const { placeholder, label, options, required, add: addNew, className, value, onChange, multi } = props as SearchSelectProps<SelectOptions<T>>,
        [text, setText] = useState(''),
        [adding, setAdding] = useState(false),
        [focus, setFocus] = useState(false),
        containerRef = useRef<HTMLDivElement>(null),
        inputRef = useRef<HTMLInputElement>(null),
        [list, setList] = useState(Seq.Indexed<T>()),
        s = useStyle(),
        render = props.render ?? ((val: T) => {
            if (typeof options !== 'function') {
                for (const { value, label } of options) {
                    if (value === val)
                        return label
                }
            }
            return '' + val
        }),
        load = useRef<(q: string) => Promise<Seq.Indexed<T>>>(undefined as any),
        add = useCallback((v?: T) => {
            if (!v) return
            setText('')
            if (props.multi) {
                const value = props.value ?? List<T>()
                if (value.indexOf(v) === -1)
                    props.onChange((value).concat(v))
            } else {
                props.onChange(v)
            }
            setAdding(false)
        }, [multi, value, onChange]),
        handleSelect = (v: number) => (add(list.get(v)), setFocus(false)),
        remove = useCallback((id: T) => () => {
            if (props.multi) {
                const value = props.value ?? List<T>()
                props.onChange(value.splice(value.indexOf(id), 1))
            }
        }, [value, onChange, multi]),

        uid = useInputId(props)
    load.current = async (q: string) => {
        if (typeof options === 'function')
            return Seq(await options(q))
        else
            return Seq(options).filter(({ label }) => label.toLowerCase().includes(q.toLowerCase())).map(a => a.value)
    }
    useEffect(() => {
        let valid = true
        if (!(focus || adding))
            setTimeout(() => valid && (setText(''), setList(Seq.Indexed<T>())), 10)
        return () => { valid = false }
    }, [focus, adding])
    useEffect(() => {
        if (!focus) return
        let valid = true
        setTimeout(() => valid && load.current(text).then(v => valid && setList(v), e => console.warn(e)), text === '' ? 1 : 100)
        return () => { valid = false }
    }, [text, focus])

    return (
        <div className={s('field', 'text', { className })} onFocus={() => setFocus(true)} onBlur={() => setFocus(true)}>
            <Dialog show={text && adding && addNew} onClose={() => (inputRef.current?.focus(), setAdding(false))}>{addNew =>
                addNew(text, c => add(c))
            }</Dialog>
            <Dropdown node={(
                <div className={s('input', 'search-select')} ref={containerRef}>
                    <div className={s.chips}>
                        {props.multi && props.value?.map((i, j) => (
                            <Chip key={j} onDelete={remove(i)}>{render(i)}</Chip>
                        ))}
                        <input
                            type="text"
                            onChange={e => setText(e.target.value)}
                            value={text}
                            placeholder={placeholder}
                            autoComplete="off"
                            ref={inputRef}
                            id={uid}
                            style={multi ? { flexBasis: Math.max(4, text.length) + 'em' } : undefined}
                        />
                    </div>
                    <FieldButtons>
                        {!text && !props.multi && value !== undefined
                            ? <IconButton onClick={() => (inputRef.current?.focus(), props.onChange(undefined))}>{s.icons.x()}</IconButton>
                            : text && addNew ? <IconButton title="Create New" color="primary" onClick={() => setAdding(true)}>{s.icons.add()}</IconButton> : null}
                    </FieldButtons>
                    {!props.multi && props.value !== undefined && !text && <div className={s.input}>{render(props.value)}</div>}
                </div>
            )} show={!!list.count()} pos={{ y: 'bottom' }} posRef={containerRef} onSelect={handleSelect} onClickOutside={() => setFocus(false)}>
                {list.map((a, i) => <Option key={i}><Suspense fallback={null}>{render(a)}</Suspense></Option>)}
            </Dropdown>
            <input
                className={s.validator}
                type="text"
                required={required}
                value={text || (props.multi ? props.value?.size : props.value !== undefined) ? '1' : ''}
                onChange={() => { }}
                placeholder=" " />
            {label && <label className={s.label} htmlFor={uid}>{label}</label>}
        </div>
    )
}
