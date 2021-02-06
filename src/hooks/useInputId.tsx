import useFormData from './useFormData'

export default function useInputId({ id, name }: { id?: string; name?: string} ) {
    const d = useFormData(),
        i = id ?? (name ? d.id + name : '')
    if (process.env.NODE_ENV === 'development') {
        if (!i) {
            try {
                throw new Error('no id field')
            } catch (e) {
                console.warn(e)
            }
        }
    }
    return i
}
