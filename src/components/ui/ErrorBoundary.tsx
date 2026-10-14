import { Component, type ErrorInfo, type ReactNode } from "react";
import Button from "./button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: any;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    try {
      (window as any).__LAST_ERROR__ = {
        message: error?.message || String(error),
        stack: error?.stack,
        componentStack: errorInfo?.componentStack,
      };
    } catch {}
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage =
        this.state.error?.message ||
        (typeof this.state.error === "string"
          ? this.state.error
          : this.state.error
          ? JSON.stringify(this.state.error)
          : "Unknown rendering error");

      return (
        <div className="min-h-[250px] flex flex-col items-center justify-center p-6 text-center rounded-3xl border border-rose-200 bg-white dark:border-rose-950/60 dark:bg-gray-900 shadow-sm my-4 max-w-lg mx-auto w-full">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 mb-3 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Something went wrong loading this section
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            We encountered a temporary rendering issue. Click below to reload.
          </p>

          <div className="mt-3 p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/90 dark:border-rose-900/60 max-w-md text-left w-full">
            <p className="text-xs font-mono font-semibold text-rose-700 dark:text-rose-300 break-words leading-relaxed">
              {errorMessage}
            </p>
            {this.state.error?.stack && (
              <details className="mt-2">
                <summary className="text-[10px] text-rose-500 hover:text-rose-700 cursor-pointer font-sans select-none">
                  Show stack trace
                </summary>
                <pre className="mt-1.5 p-2 bg-rose-100/50 dark:bg-rose-950/60 rounded-lg text-[10px] font-mono text-rose-800 dark:text-rose-200 overflow-x-auto max-h-36">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <Button
              size="sm"
              variant="outline"
              onClick={this.handleReset}
              className="text-xs gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload Content
            </Button>
            <button
              type="button"
              onClick={() => {
                const text = `${errorMessage}\n\n${this.state.error?.stack || ""}\n\n${this.state.errorInfo?.componentStack || ""}`;
                navigator.clipboard?.writeText(text);
                toast.success("Error details copied to clipboard!");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 transition-colors shadow-xs"
            >
              Copy Error
            </button>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false, error: undefined, errorInfo: undefined });
                window.location.href = "/feed";
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 transition-colors shadow-xs"
            >
              <Home className="w-3.5 h-3.5" />
              Go to Feed
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
