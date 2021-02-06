import { useCallback, useState, useEffect, ReactNode, RefObject, FormEvent, ComponentPropsWithRef, forwardRef, useRef } from 'react'
import { Map } from 'immutable'
import { useStyle } from './hooks/useStyle'
import { FormData, FormState, FormContext } from './hooks/useFormData'

interface KnownMap<T extends { [k: string]: unknown }> {
    get<K extends string, NSV = undefined>(name: K, nsv: NSV): (K extends keyof T ? T[K] : never) | NSV
}

export type FormProps<T extends { [k: string]: unknown }> = Omit<ComponentPropsWithRef<'form'>, 'onSubmit' | 'onError' | 'children' | 'id' | 'defaultValue'> & {
    id: string
    onError?: (e: Error) => void
    children?: ReactNode | ((state: FormData) => ReactNode)
    dataRef?: RefObject<KnownMap<T>>
    defaultValues?: T
    onSubmit: (v: T, e: FormEvent) => void | Promise<void>
}

const Form = forwardRef<HTMLFormElement>(function Form<T extends { [k: string]: unknown }>({ children, className, dataRef, defaultValues, onSubmit, onError, id, ...rest }: FormProps<T>, ref: any) {
    const [state, setState] = useState<FormState>({ loading: false, success: false }),
        [data, setData] = useState<Map<string, unknown>>(() => defaultValues ? Map(defaultValues) : Map()),
        unmounting = useRef(false),
        onsubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            if (state.loading)
                return
            setState(s => ({ ...s, loading: true, success: false }))
            try {
                if (onSubmit)
                    await onSubmit(data.toJS() as any, e)
                if (unmounting.current)
                    return
                setState(s => ({ ...s, loading: false, success: true }))
            } catch (error) {
                onError && onError(error)
                setState(s => ({ ...s, loading: false, error }))
            }
        }, [onSubmit, onError, data, state]),
        s = useStyle()
    if (dataRef)
        (dataRef as any).current = data
    const formData = { ...state, clearError: () => setState(s => ({ ...s, error: undefined })), data, setData, id: id + '-' }
    useEffect(() => () => {
        unmounting.current = true
    }, [])
    return (
        <form onSubmit={onsubmit} className={s('form', { className })} id={id} {...rest} ref={ref}>
            <FormContext.Provider value={formData}>
                {typeof children === 'function' ? children(formData) : children}
            </FormContext.Provider>
        </form>
    )
}) as (<T extends { [k: string]: unknown } >(props: FormProps<T>) => JSX.Element)

export default Form
