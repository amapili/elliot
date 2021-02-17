import { createContext, SetStateAction, useContext } from 'react'
import { Map } from 'immutable'

export interface FormState {
    error?: Error
    success: boolean
    loading: boolean
}

export interface FormData extends FormState {
    id: string
    clearError: () => void
    data: Map<string, unknown>
    setData: (cb: (m: Map<string, unknown>) => Map<string, unknown>) => void,
    submit: (modify?: SetStateAction<Map<string, unknown>>) => Promise<void>
}

export const FormContext = createContext<FormData>({
    id: '',
    loading: false,
    success: false,
    clearError: () => { },
    data: Map(),
    setData: () => { },
    submit: async () => { }
})

export default function useFormData() {
    return useContext(FormContext)
}
