import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('FMCG Suite runtime error:', error, info);
  }

  handleReset = () => {
    // Clears demo data in case stale/corrupt localStorage caused the crash
    Object.keys(localStorage)
      .filter(k => k.startsWith('fmcg_'))
      .forEach(k => localStorage.removeItem(k));
    window.location.href = '/';
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div className="glass-panel" style={{ maxWidth: 640, padding: 28 }}>
          <h2 style={{ marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
            The page hit a runtime error. Details are below and in the browser console.
          </p>
          <pre style={{
            background: 'rgba(0,0,0,0.35)', padding: 14, borderRadius: 10, fontSize: 12,
            color: '#FCA5A5', whiteSpace: 'pre-wrap', marginBottom: 18, fontFamily: 'var(--font-mono)'
          }}>
            {String(this.state.error?.stack || this.state.error)}
          </pre>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" onClick={() => window.location.reload()}>Reload</button>
            <button className="btn btn-primary" onClick={this.handleReset}>Reset Demo Data & Reload</button>
          </div>
        </div>
      </div>
    );
  }
}
