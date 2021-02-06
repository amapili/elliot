import { Component, ErrorInfo, ReactNode } from 'react'

export interface ErrorBoundaryProps {
    onError?: (e: Error, inf: ErrorInfo) => unknown
    render: (e: Error) => ReactNode
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps> {
    state = {
        error: undefined as Error | undefined
    }

    static getDerivedStateFromError(error: any) {
        return { error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (this.props.onError)
            this.props.onError(error, errorInfo)
    }

    render() {
        if (this.state.error)
            return this.props.render(this.state.error)

        return this.props.children
    }
}
