'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { Component, ErrorInfo } from 'react';

import { Button } from './ui/button';

type TProps = {
  children: React.ReactNode;
};

type TState = {
  hasError: boolean;
  error: string;
  errorInfo: ErrorInfo;
};

export class ErrorBoundary extends Component<TProps, TState> {
  public errorDetail: ErrorInfo = {};
  constructor(props: TProps) {
    super(props);

    this.state = {
      hasError: false,
      error: '',
      errorInfo: {},
    };
  }

  static getDerivedStateFromError(error: Error): {
    hasError: boolean;
    error: string;
  } {
    return {
      hasError: true,
      error: error?.toString(),
    };
  }

  componentDidCatch(_: Error, info: ErrorInfo): void {
    this.errorDetail = info;
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      <ClientErrorPage />;
    }

    return this.props.children;
  }
}

const ClientErrorPage = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
      <h1 className="mt-6 mb-4 text-4xl font-semibold text-gray-800">
        Whoops! There Was a Problem
      </h1>

      <p className="mb-8 w-full max-w-xl text-lg text-gray-600">
        Sorry for the inconvenience. <br />
        An unexpected error occurred. Try refreshing the page. <br />
        If the issue persists, please contact support and let us know what you
        were doing when the error occurred.
      </p>

      <div className="!mt-2 flex items-center justify-center gap-2">
        <Link href={pathname}>
          <Button className="!px-6">Try Again</Button>
        </Link>

        <Link href="/">
          <Button variant="outline" className="!px-2">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
