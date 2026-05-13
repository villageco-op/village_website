'use client';

import { AlertCircle, FileQuestion, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

import { Card } from './card';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BaseStateProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  className?: string;
}

interface ErrorStateProps extends BaseStateProps {
  onRetry?: () => void;
}

interface NotFoundStateProps extends BaseStateProps {
  showBackButton?: boolean;
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
  className,
}: BaseStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-ink-3">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="font-heading text-lg font-bold text-ink">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-ink-3">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function InlineErrorState({
  title = 'Failed to load data',
  description,
  icon: Icon = AlertCircle,
  onRetry,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex h-64 w-full flex-col items-center justify-center rounded-xl bg-destructive/10 p-6 text-center text-destructive",
        className
      )}
    >
      {Icon && <Icon className="mb-3 h-8 w-8 opacity-80" />}
      <p className="font-heading text-lg font-bold">{title}</p>
      {description && <p className="mt-2 max-w-md text-sm opacity-90">{description}</p>}
      
      {onRetry && !action && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="mt-5 border-destructive/30 bg-transparent text-destructive hover:bg-destructive/20 hover:text-destructive"
        >
          Try Again
        </Button>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function PageErrorState({
  title = 'Something went wrong',
  description = 'We encountered an issue loading this page. Please try again.',
  icon: Icon = AlertCircle,
  onRetry,
  action,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex min-h-[60vh] flex-col items-center justify-center p-6 text-center", className)}>
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-deep-forest">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h2 className="mb-2 font-heading text-2xl font-bold text-deep-forest">{title}</h2>
      {description && <p className="mb-6 max-w-md text-ink-3">{description}</p>}
      
      {onRetry && !action && (
        <Button onClick={onRetry}>Try Again</Button>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

export function NotFoundState({
  title = 'Not Found',
  description = "We couldn't find the resource you were looking for.",
  icon: Icon = FileQuestion,
  action,
  showBackButton = true,
  className,
}: NotFoundStateProps) {
  const router = useRouter();

  return (
    <div className={cn("flex min-h-[60vh] flex-col items-center justify-center p-6 text-center", className)}>
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-deep-forest">
          <Icon className="h-8 w-8" />
        </div>
      )}
      <h2 className="mb-2 font-heading text-2xl font-bold text-deep-forest">{title}</h2>
      {description && <p className="mb-6 max-w-md text-ink-3">{description}</p>}
      
      <div className="flex items-center gap-3">
        {showBackButton && !action && (
          <Button onClick={() => router.back()}>Go Back</Button>
        )}
        {action}
      </div>
    </div>
  );
}

interface FormErrorStateProps extends ErrorStateProps {
  onClose?: () => void;
}

export function FormErrorState({
  title = 'Failed to load details',
  description = 'There was an error retrieving the information. Please try again.',
  icon: Icon = AlertCircle,
  onRetry,
  onClose,
  action,
  className,
}: FormErrorStateProps) {
  return (
    <Card className={cn("relative flex flex-col items-center justify-center p-12 text-center", className)}>
      {onClose && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-2 text-ink-3 hover:text-ink" 
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      )}
      
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-deep-forest">
          <Icon className="h-7 w-7" />
        </div>
      )}
      
      <h3 className="mb-2 font-heading text-xl font-bold text-deep-forest">{title}</h3>
      {description && <p className="mb-6 max-w-xs text-sm text-ink-3">{description}</p>}
      
      <div className="flex flex-col gap-3">
        {onRetry && !action && (
          <Button onClick={onRetry} variant="default">
            Try Again
          </Button>
        )}
        {action}
      </div>
    </Card>
  );
}
