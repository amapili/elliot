import { forwardRef, ReactElement, useState, useEffect, ChangeEvent, FocusEvent } from 'react'
import useFormInput from "./hooks/useFormInput"
import TextField, { TextFieldProps } from './TextField'

export class InputValidationError extends Error { }

export type ValidatedTextFieldProps<T = string, U = T extends string ? '' : undefined> = TextFieldProps<T, U> & {
    validate: (str: string) => T
    format?: (v: T) => string
    undef?: U
}

const ValidatedTextField = forwardRef<HTMLInputElement, ValidatedTextFieldProps<any, any>>(({ onChange: oc, value: v, undef, validate, format, children, message, onFocus, onBlur, error, ...rest }, ref) => {
    const [err, setErr] = useState(false),
        [msg, setMsg] = useState(''),
        [focus, setFocus] = useState(false),
        [value, onChange] = useFormInput(undef, rest.name, v, oc),
        [str, setStr] = useState(() => value !== undef ? format ? format(value) : '' + value : ''),
        onfocus = (e: FocusEvent<HTMLInputElement>) => {
            setFocus(true)
            onFocus && onFocus(e)
        },
        onblur = (e: FocusEvent<HTMLInputElement>) => {
            setFocus(false)
            onBlur && onBlur(e)
        },
        onchange = (s: string) => {
            setStr(s)
            if (s === '') {
                setErr(false)
                setMsg('')
                onChange && onChange(undef)
            } else {
                try {
                    const v = validate(s)
                    setErr(false)
                    setMsg(format ? format(v) : '')
                    onChange && onChange(v)
                } catch (e) {
                    setErr(true)
                    setMsg(e instanceof InputValidationError ? e.message : 'Invalid')
                    onChange && onChange(undef)
                }
            }
        }
    useEffect(() => {
        if (focus)
            return
        setStr(value !== undef ? format ? format(value) : '' + value : '')
        if (value !== undef) {
            setMsg('')
            setErr(false)
        }
    }, [value, focus])
    return (
        <TextField
            value={str}
            onChange={onchange}
            onFocus={onfocus}
            onBlur={onblur}
            error={error ?? (!focus && err)}
            message={message ?? (err ? msg : msg !== str ? msg : '')}
            {...rest}
        >{children}</TextField>
    )
}) as (<T, U = undefined>(p: ValidatedTextFieldProps<T, U>) => ReactElement)

export default ValidatedTextField
