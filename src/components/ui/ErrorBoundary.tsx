import { Component, type ErrorInfo, type ReactNode } from "react";
import Button from "./button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[250px] flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-xs my-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Something went wrong loading this section
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            We encountered a temporary rendering issue. Click below to reload.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={this.handleReset}
            className="mt-4 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Reload Content
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
