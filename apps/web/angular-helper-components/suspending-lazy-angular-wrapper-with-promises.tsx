'use client';

import { type ComponentRef, type NgModuleRef } from '@angular/core';
import { type AngularWrapper } from '@bubblydoo/angular-react';
import React, { Ref, forwardRef, lazy, use } from 'react';

const AngularWrapperWithModule = lazy(() =>
  import('@bubblydoo/angular-react').then((m) => ({ default: m.AngularWrapperWithModule }))
);

function SuspendingLazyAngularWrapperWithPromises(
  {
    moduleRefPromise,
    componentPromise,
    name,
    serverFallback,
    ...props
  }: {
    moduleRefPromise: Promise<NgModuleRef<any> | 'IS_SERVER'>;
    componentPromise: Promise<any>;
    serverFallback: any;
    name: string;
  } & Omit<Parameters<typeof AngularWrapper>[0], 'component'>,
  ref: Ref<ComponentRef<any>>
) {
  const moduleRef = use(moduleRefPromise);

  // // needed for hydration
  if (moduleRef === 'IS_SERVER') {
    return React.createElement(name, {}, serverFallback);
  }

  const component = use(componentPromise);

  if (!component) throw new Error('SuspendingLazyAngularWrapperWithPromises needs a component, but none was provided');

  return (
    <AngularWrapperWithModule
      component={component}
      moduleRef={moduleRef}
      name={name}
      injector={moduleRef.injector}
      serverFallback={serverFallback}
      ref={ref as any}
      {...props}
    />
  );
}

export default forwardRef(SuspendingLazyAngularWrapperWithPromises);
