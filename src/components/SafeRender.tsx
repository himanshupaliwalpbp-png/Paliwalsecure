'use client';

import React, { Component, type ReactNode } from 'react';

interface SafeRenderProps {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface SafeRenderState {
  hasError: boolean;
  error: Error | null;
}

/**
 * SafeRender — Lightweight error boundary that catches crashes in child components.
 * Prevents one broken component from crashing the entire page.
 */
export class SafeRender extends Component<SafeRenderProps, SafeRenderState> {
  constructor(props: SafeRenderProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): SafeRenderState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const componentName = this.props.name || 'Unknown';
    console.error(`[SafeRender] Error in "${componentName}":`, error.message, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      // Default: render nothing (invisible) instead of crashing the whole page
      return null;
    }
    return this.props.children;
  }
}
