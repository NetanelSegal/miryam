import { Component, type ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Heading, Text, Button, Container } from '@/components/ui'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  retryKey: number
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, retryKey: 0 }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    if (import.meta.env.DEV) console.error('ErrorBoundary caught:', error)
  }

  handleRetry = () => {
    this.setState((s) => ({ hasError: false, retryKey: s.retryKey + 1 }))
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" className="py-20 min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-6">
            <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
            <Heading level={3} className="text-white">משהו השתבש</Heading>
            <Text variant="secondary">אירעה שגיאה בטעינת הדף. נסו שוב.</Text>
            <Button
              variant="primary"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={this.handleRetry}
            >
              נסו שנית
            </Button>
          </div>
        </Container>
      )
    }

    return <div key={this.state.retryKey}>{this.props.children}</div>
  }
}
