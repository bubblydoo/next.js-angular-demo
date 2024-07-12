'use client';

import { LOCALE_ID, NgModuleRef } from '@angular/core';
import loadAngularModule from './load-angular-module';
import { useMemo } from 'react';
import LazyAngularModuleContextProvider from '../angular-helper-components/lazy-angular-module-context-provider';
import { useLocale } from "shared-contexts";
import configureZonejs from './configure-zonejs';
import { FiberProvider } from 'its-fine';

declare global {
  var IS_SERVER: boolean;
  var Zone: any;
}

typeof window !== 'undefined' && typeof window.Zone === 'undefined' && configureZonejs();

type ModuleInjectables = {
  locale: string;
};

const injectableModuleRefLoader =
  typeof IS_SERVER !== 'undefined' && IS_SERVER
    ? () => {
        return Promise.resolve('IS_SERVER' as const);
      }
    : (
        {
          locale
        }: ModuleInjectables,
        localeForLocaleData: string
      ): Promise<NgModuleRef<any> | 'IS_SERVER'> => {
        if (typeof window === 'undefined') return Promise.resolve('IS_SERVER' as const);
        const moduleRefPromise = import('angular-module/dist/demo').then((mod) =>
          loadAngularModule(mod.DemoModule, localeForLocaleData, [
            {
              provide: LOCALE_ID,
              useValue: locale,
            },
          ])
        );
        return moduleRefPromise;
      };

export const InjectableRootAngularProvider = ({
  children,
  localeForLocaleData,
  injectables,
}: {
  children: any;
  localeForLocaleData: string;
  injectables: ModuleInjectables;
}) => {
  const moduleRefLoader = useMemo(
    () => () => injectableModuleRefLoader(injectables, localeForLocaleData),
    [injectables, localeForLocaleData]
  );

  return (
    <LazyAngularModuleContextProvider moduleRefLoader={moduleRefLoader}>{children}</LazyAngularModuleContextProvider>
  );
};

export const RootAngularProvider = ({ children }: { children: any }) => {
  const locale = useLocale();
  const injectables = useMemo(
    () => ({
      locale,
    }),
    [
      locale,
    ]
  );

  return (
    <FiberProvider>
      <InjectableRootAngularProvider injectables={injectables} localeForLocaleData={locale}>
        {children}
      </InjectableRootAngularProvider>
    </FiberProvider>
  );
};
