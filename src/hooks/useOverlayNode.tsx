import { useRef, createContext, useContext, useEffect } from 'react'

export const OverlayContext = createContext((typeof document === 'undefined' ? null : document.body) as any as HTMLDivElement)

export default function useOverlayNode() {
    const root = useContext(OverlayContext),
        node = useRef((typeof document === 'undefined' ? null as any : document.createElement('div')) as HTMLDivElement)
    useEffect(() => {
        if (!root) return
        root.appendChild(node.current)
        return () => node.current.remove()
    }, [root])
    return node.current
}
