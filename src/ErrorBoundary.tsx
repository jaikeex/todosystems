import { Component, type ReactNode } from 'react';
import { Button, Typography } from '@/ui';
import { IoWarningOutline } from 'react-icons/io5';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-surface-800">
          <div className="max-w-md w-full bg-surface-700 border border-surface-600 rounded-lg p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger-500/10 mb-8">
                <IoWarningOutline className="w-8 h-8 text-danger-500" />
              </div>

              <Typography as="h1" variant="heading-lg" className="mb-6">
                Something went wrong
              </Typography>

              <Typography variant="body" className="text-text-secondary">
                An unexpected error occurred. You can try reloading the page.
              </Typography>
            </div>

            <Button
              onClick={this.handleReload}
              color="primary"
              className="w-full"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
