import { forwardRef, ReactNode } from 'react'
import { useStyle } from './hooks/useStyle'
import useInputId from "./hooks/useInputId"
import TextInput, { TextInputProps } from './TextInput'

export type TextFieldProps<T = string, U = T extends string ? '' : undefined> = Omit<TextInputProps, 'value' | 'onChange'> & {
    value?: T | U
    onChange?: (v: T | U) => unknown
    label?: string
    message?: ReactNode
    error?: boolean
}


const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({ children, label, message, error, className, ...rest }, ref) => {
    const s = useStyle(),
        id = useInputId(rest)
    return (
        <fieldset className={s('field', 'text', { error, className })}>
            <TextInput id={id} ref={ref} {...rest} />
            {label && <legend className={s.label}><label htmlFor={id}>{label}</label></legend>}
            {message !== undefined ? <span className={s.msg}>{message}</span> : null}
            {children}
        </fieldset>
    )
})

export default TextField
