import { Alert } from 'react-native';

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown, context?: string): void {
  console.error(`Error in ${context || 'unknown context'}:`, error);
  
  let message = 'An unexpected error occurred';
  
  if (error instanceof AppError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  // Show user-friendly error message
  Alert.alert('Error', message);
}

export function createErrorBoundary() {
  return class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean }
  > {
    constructor(props: { children: React.ReactNode }) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(): { hasError: boolean } {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
              Something went wrong
            </Text>
            <Text style={{ textAlign: 'center', marginBottom: 20 }}>
              Please restart the app or contact support if the problem persists.
            </Text>
            <Pressable
              style={{
                backgroundColor: '#2563eb',
                padding: 12,
                borderRadius: 8,
              }}
              onPress={() => this.setState({ hasError: false })}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Try Again</Text>
            </Pressable>
          </View>
        );
      }

      return this.props.children;
    }
  };
}