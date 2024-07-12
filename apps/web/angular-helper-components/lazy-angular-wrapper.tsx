'use client';

import { type ComponentRef } from '@angular/core';
import { type AngularWrapper } from '@bubblydoo/angular-react';
import { forwardRef, lazy, Ref, Suspense } from 'react';

export type AngularWrapperProps = Omit<Parameters<typeof AngularWrapper>[0], 'component'>;

const SuspendingLazyAngularWrapper = lazy(() => import('./suspending-lazy-angular-wrapper'));

function LazyAngularWrapper(
  {
    componentLoader,
    fallback,
    name,
    ...props
  }: {
    componentLoader: () => Promise<any>;
    fallback: any;
    name: string;
  } & AngularWrapperProps,
  ref: Ref<ComponentRef<any>>
) {
  return (
    <Suspense fallback={fallback}>
      <SuspendingLazyAngularWrapper
        name={name}
        componentLoader={componentLoader}
        ref={ref as any}
        serverFallback={fallback}
        {...props}
      />
    </Suspense>
  );
}

export default forwardRef(LazyAngularWrapper);
