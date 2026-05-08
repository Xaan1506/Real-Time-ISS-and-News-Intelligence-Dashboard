import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-slate-950 p-6 text-slate-100">
          <div className="glass max-w-lg p-6 text-center">
            <h1 className="text-2xl font-bold">Dashboard encountered an error</h1>
            <p className="mt-2 text-slate-300">Please refresh the page to recover the session.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
