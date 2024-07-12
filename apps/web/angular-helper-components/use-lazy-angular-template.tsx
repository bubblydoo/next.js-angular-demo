'use client';

import { type TemplateRef } from '@angular/core';
import { use, useContext, useEffect, useMemo, useState } from 'react';
import LazyAngularModuleContext from '../lib/lazy-angular-module-context';
import { LoadedAngularInServerError } from '../lib/loaded-angular-in-server-error';
import { executeCachedLoader } from './loader-cache';

const loadCreateReactWrapperTemplateRef = () =>
  import('@bubblydoo/angular-react').then((m) => m.createReactWrapperTemplateRef);

export function useLazyToAngularTemplateRef<C>(Component: (props: C) => any): TemplateRef<C> | undefined {
  const [templateRef, setTemplateRef] = useState<TemplateRef<C> | undefined>(undefined);
  const [updateComponent, setUpdateComponent] = useState<(component: (props: C) => any) => void>();

  const lazyAngularModuleContext = useContext(LazyAngularModuleContext);

  if (!lazyAngularModuleContext) throw new Error('no lazy angular module context (context undefined)');

  const moduleRefPromise = useMemo(() => executeCachedLoader(lazyAngularModuleContext), [lazyAngularModuleContext]);
  const moduleRef = use(moduleRefPromise);

  if (!moduleRef) throw new Error('no lazy angular module context (module undefined)');

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    if (moduleRef === 'IS_SERVER') throw new LoadedAngularInServerError();

    (async () => {
      const createReactWrapperTemplateRef = await loadCreateReactWrapperTemplateRef();
      if (ignore) return;
      const { templateRef, updateComponent } = await createReactWrapperTemplateRef(moduleRef, controller.signal);
      if (ignore) return;
      setTemplateRef(templateRef);
      setUpdateComponent(() => updateComponent);
    })();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [moduleRef]);

  useEffect(() => {
    if (!Component || !updateComponent) return;
    updateComponent((props) => <Component {...props} />);
  }, [Component, updateComponent]);

  return Component ? templateRef : undefined;
}
