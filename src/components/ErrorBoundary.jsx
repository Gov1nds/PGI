import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error("[ErrorBoundary]", error, info); }
  render() {
    if (this.state.hasError) return this.props.fallback || <CrashScreen error={this.state.error} />;
    return this.props.children;
  }
}

function CrashScreen({ error }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-center">
      <div className="max-w-md px-6">
        <div className="mb-4 text-4xl">⚠</div>
        <h1 className="text-xl font-bold text-[#0A0A0A]">Something went wrong</h1>
        <p className="mt-2 text-sm text-[#6B7280]">The application encountered an unexpected error.</p>
        {error?.message && <p className="mt-2 text-xs text-red-500 font-mono">{error.message}</p>}
        <button onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-[#0A0A0A] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1A1A1A]">Reload Page</button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
