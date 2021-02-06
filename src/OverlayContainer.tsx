import { PropsWithChildren, useState } from 'react'
import { OverlayContext } from './hooks/useOverlayNode'

export default function OverlayContainer({ children }: PropsWithChildren<{}>) {
    const [div, setDiv] = useState(undefined as any as HTMLDivElement)

    return (
        <OverlayContext.Provider value={div}>
            {children}
            <div ref={r => r && setDiv(r)} />
        </OverlayContext.Provider>
    )
}
