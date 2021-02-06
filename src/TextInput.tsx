import { InputHTMLAttributes, forwardRef, TextareaHTMLAttributes } from 'react'
import { useStyle } from './hooks/useStyle'
import useFormInput from "./hooks/useFormInput"

export type TextInputType = 'date' | 'datetime-local' | 'email' | 'month' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'time' | 'url' | 'week' | 'textarea'

export type TextInputProps = Omit<({
    type?: Exclude<TextInputType, 'textarea'>
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) | ({
    type: 'textarea'
} & TextareaHTMLAttributes<HTMLInputElement>), 'onChange'> & {
    onChange?: (s: string) => void
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({ className, type = 'text', placeholder, onChange: oc, value: v, ...rest }, ref) => {
    const s = useStyle(),
        Component = type === 'textarea' ? 'textarea' as never : 'input',
        [value, onChange] = useFormInput('', rest.name, v, oc)
    return (
        <Component type={type === 'textarea' ? undefined : type} placeholder={placeholder ?? ' '} className={s('input', { placeholder, className })} ref={ref} value={value} onChange={e => onChange && onChange(e.target.value)} {...rest} />
    )
})

export default TextInput
