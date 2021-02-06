import { createContext, useContext } from 'react'
import Route from '../Route'

export interface RoutingInterface {
    goTo(route: Route): void
    replaceTo(route: Route, update?: boolean): void
    backTo(route: Route): void
}

export const RoutingContext = createContext({} as any as RoutingInterface)

export default function useRouting() {
    return useContext(RoutingContext)
}

