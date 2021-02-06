import { forwardRef, ReactNode, ComponentPropsWithRef } from 'react'
import { useStyle } from './hooks/useStyle'

export interface FieldProps extends ComponentPropsWithRef<'fieldset'> {
    label?: string
    message?: ReactNode
    error?: boolean
    text?: boolean
    component: ReactNode
    inputId: string
    labelProps?: ComponentPropsWithRef<'legend'>
}

const Field = forwardRef<HTMLFieldSetElement, FieldProps>(({ component, children, label, message, error, className, labelProps, inputId, text, ...rest }, ref) => {
    const s = useStyle()
    return (
        <fieldset className={s('field', { text, error, className })} ref={ref} {...rest}>
            {component}
            {label && <legend {...labelProps} className={s('label', { className: labelProps?.className })}><label htmlFor={inputId}>{label}</label></legend>}
            {message !== undefined ? <span className={s.msg}>{message}</span> : null}
            {children}
        </fieldset>
    )
})

export default Field
