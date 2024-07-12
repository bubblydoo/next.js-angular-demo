'use client';

import type { NgModuleRef } from '@angular/core';
import { useCallback } from 'react';
import LazyAngularModuleContext from '../lib/lazy-angular-module-context';
import { executeCachedLoader } from './loader-cache';

export default function LazyAngularModuleContextProvider(props: {
  children: any;
  moduleRefLoader: () => Promise<NgModuleRef<any> | 'IS_SERVER'>;
}) {
  const moduleRefLoader = props.moduleRefLoader;

  if (!moduleRefLoader) throw new Error('No moduleRefLoader passed to LazyAngularModuleContextProvider');

  const cachedModuleRefLoader = useCallback(() => {
    return executeCachedLoader(moduleRefLoader);
  }, [moduleRefLoader]);

  return (
    <LazyAngularModuleContext.Provider value={cachedModuleRefLoader}>
      {props.children}
    </LazyAngularModuleContext.Provider>
  );
}
