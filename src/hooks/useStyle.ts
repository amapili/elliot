import { useContext } from 'react'
import { StyleContext } from '../StyleProvider'

export function useStyle() {
    return useContext(StyleContext)
}


