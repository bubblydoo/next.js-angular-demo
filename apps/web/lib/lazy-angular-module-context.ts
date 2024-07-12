import type { NgModuleRef } from '@angular/core';
import { createContext } from 'react';

const LazyAngularModuleContext = createContext<() => Promise<NgModuleRef<any> | 'IS_SERVER'>>(null);

LazyAngularModuleContext.displayName = 'LazyAngularModuleContext';

export default LazyAngularModuleContext;
