'use client';

import { type ComponentRef } from '@angular/core';
import { Ref, forwardRef, useContext, useMemo } from 'react';
import LazyAngularModuleContext from '../lib/lazy-angular-module-context';
import { AngularWrapperProps } from './lazy-angular-wrapper';
import { executeCachedLoader } from './loader-cache';
import SuspendingLazyAngularWrapperWithPromises from './suspending-lazy-angular-wrapper-with-promises';

function SuspendingLazyAngularWrapper(
  {
    componentLoader,
    name,
    serverFallback,
    ...props
  }: {
    componentLoader: () => Promise<any>;
    name: string;
    serverFallback?: any;
  } & AngularWrapperProps,
  ref: Ref<ComponentRef<any>>
) {
  const moduleRefLoader = useContext(LazyAngularModuleContext);

  if (!moduleRefLoader) throw new Error('No module ref loader on LazyAngularModuleContext');

  // need to lazy load promises because they are not awaited in the same microtask (can cause uncaught promise errors)
  const componentPromise = useMemo(() => executeCachedLoader(componentLoader, true), [componentLoader]);
  const moduleRefPromise = useMemo(() => executeCachedLoader(moduleRefLoader, true), [moduleRefLoader]);

  return (
    <SuspendingLazyAngularWrapperWithPromises
      componentPromise={componentPromise}
      moduleRefPromise={moduleRefPromise}
      name={name}
      serverFallback={serverFallback}
      ref={ref}
      {...props}
    />
  );
}

export default forwardRef(SuspendingLazyAngularWrapper);
