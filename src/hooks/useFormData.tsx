import { createContext, useContext } from 'react'
import { Map } from 'immutable'

export interface FormState {
    error?: Error
    success: boolean
    loading: boolean
}

export type FormData = FormState & { id: string; clearError: () => void } & ({
    data: Map<string, unknown>
    setData: (cb: (m: Map<string, unknown>) => Map<string, unknown>) => void
} | { data?: undefined; setData?: undefined })

export const FormContext = createContext<FormData>({ id: '', loading: false, success: false, clearError: () => { } })

export default function useFormData() {
    return useContext(FormContext)
}
