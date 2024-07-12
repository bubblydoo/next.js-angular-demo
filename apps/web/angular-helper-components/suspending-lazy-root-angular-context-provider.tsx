import { NgModuleRef } from '@angular/core';
import { RootAngularContextProvider } from '@bubblydoo/angular-react';
import { use, useMemo } from 'react';
import { executeCachedLoader } from './loader-cache';

export function SuspendingLazyRootAngularContextProvider({
  moduleRefLoader,
  children,
}: {
  moduleRefLoader: () => Promise<NgModuleRef<any> | 'IS_SERVER'>;
  children: any;
}) {
  const moduleRefPromise = useMemo(() => executeCachedLoader(moduleRefLoader), [moduleRefLoader]);
  const moduleRef = use(moduleRefPromise);

  // needed for hydration
  if (moduleRef === 'IS_SERVER') {
    return null;
  }

  return <RootAngularContextProvider moduleRef={moduleRef}>{children}</RootAngularContextProvider>;
}
