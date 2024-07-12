'use client';

import { createContext, useContext } from 'react';

const LocaleContext = createContext<string>(null!);

export const LocaleContextProvider = ({ locale, children }: { locale: string; children: any }) => (
  <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
);

export const useLocale = () => {
  const locale = useContext(LocaleContext);
  if (!locale) throw new Error('LocaleContext not found');
  return locale;
};
