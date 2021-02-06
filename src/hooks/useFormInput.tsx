import useFormData from './useFormData'

export default function useFormInput<T, U = T>(def: U, name?: string, value?: T | U, onChange?: (v: T | U) => void): [T | U, undefined | ((v: T | U) => void)] {
    const d = useFormData()
    if (!name || !d.data || onChange !== undefined)
        return [value ?? def, onChange]
    const val = (d.data.get(name) ?? def) as T | U
    return [val, (v: T | U) => d.setData(d => d.set(name, v))]
}
