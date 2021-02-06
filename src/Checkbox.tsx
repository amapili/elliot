import { InputHTMLAttributes, ReactNode } from 'react'
import { useStyle } from './hooks/useStyle'
import useFormInput from "./hooks/useFormInput"

export default function Checkbox({ style, className, type, label, children, onChange: oc, checked: v, ...rest }: CheckboxProps) {
    const s = useStyle(),
        [value, onChange] = useFormInput(false, rest.name, v, oc)
    return (
        <label className={s('field', { className })}>
            <div className={`${s.check} ${type === 'radio' ? s.radio : ''}`}>
                <input type="checkbox" onChange={onChange && (e => onChange(e.target.checked))} checked={value} {...rest} />
                <div className={s.box}>
                    {type === 'radio' ? s.icons.radio() : s.icons.checkmark()}
                </div>
            </div>
            {label && <div className={s.label}>{label}</div>}
            {children}
        </label>
    )
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
    type?: 'radio' | 'checkbox'
    label?: ReactNode
    onChange?: (c: boolean) => void
}
