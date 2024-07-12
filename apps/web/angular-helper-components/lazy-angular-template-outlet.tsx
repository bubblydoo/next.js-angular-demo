import { type NgModuleRef, type TemplateRef } from '@angular/core';
import { useCallback, useContext, useMemo } from 'react';
import LazyAngularModuleContext from '../lib/lazy-angular-module-context';
import { LoadedAngularInServerError } from '../lib/loaded-angular-in-server-error';
import LazyAngularModuleContextProvider from './lazy-angular-module-context-provider';
import LazyAngularWrapper from './lazy-angular-wrapper';

const angularComponentLoader =
  typeof IS_SERVER !== 'undefined' && IS_SERVER
    ? () => Promise.reject(new LoadedAngularInServerError())
    : () => import('@bubblydoo/angular-react').then((m) => m.TemplateOutletComponent);

type Props = {
  tmpl: TemplateRef<any>;
  tmplContext: Record<string, any>;
};

export const LazyAngularTemplateOutlet = ({ tmpl, tmplContext }: Props) => {
  const inputs = useMemo(() => ({ tmpl, tmplContext }), [tmpl, tmplContext]);

  return (
    <LazyAngularWrapper
      fallback={'Loading Template Outlet...'}
      name="template-outlet"
      componentLoader={angularComponentLoader}
      inputs={inputs}
    />
  );
};

const lazyFromAngularTemplateRef = (
  tmpl: TemplateRef<any>,
  tmplContext: Record<string, any> = {},
  moduleRefLoader: () => Promise<NgModuleRef<any> | 'IS_SERVER'>
) => (
  <LazyAngularModuleContextProvider moduleRefLoader={moduleRefLoader}>
    <LazyAngularTemplateOutlet tmpl={tmpl} tmplContext={tmplContext}></LazyAngularTemplateOutlet>
  </LazyAngularModuleContextProvider>
);

export const useLazyFromAngularTemplateRefFn = () => {
  const moduleRefLoader = useContext(LazyAngularModuleContext);
  return useCallback(
    (tmpl: TemplateRef<any>, tmplContext: Record<string, any> = {}) =>
      lazyFromAngularTemplateRef(tmpl, tmplContext, moduleRefLoader),
    [moduleRefLoader]
  );
};

export const useLazyFromAngularTemplateRef = (tmpl: TemplateRef<any>, tmplContext: Record<string, any> = {}) => {
  const fn = useLazyFromAngularTemplateRefFn();
  return useMemo(() => fn(tmpl, tmplContext), [fn, tmpl, tmplContext]);
};
