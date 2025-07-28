'use client';
import Link from 'next/link';
import React, { Component, ErrorInfo } from 'react';

import { Button } from './ui/button';
import { useTypedTranslations } from '@/hooks/useTypedTranslations';

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

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.errorDetail = info;

    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', info);

    // Update state with error info
    this.setState({
      errorInfo: info,
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <ClientErrorPage />;
    }

    return this.props.children;
  }
}

const ClientErrorPage = () => {
  const t = useTypedTranslations('GeneralPages');
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
      <h1 className="mt-6 mb-6 text-5xl font-semibold text-gray-400">
        {t('errorPage.title')}
      </h1>

      <p className="mb-8 w-full max-w-xl text-xl text-gray-400">
        {t('errorPage.subtitle')} <br />
        {t('errorPage.description')}
      </p>

      <div className="!mt-2 flex items-center justify-center gap-2">
        <Button onClick={() => window.location.reload()} className="!px-6">
          {t('errorPage.tryAgain')}
        </Button>

        <Link href="/">
          <Button variant="outline" className="!px-2">
            {t('errorPage.returnHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
};
