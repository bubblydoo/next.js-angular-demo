import type { NgModuleRef, StaticProvider } from '@angular/core';
import { LoadedAngularInServerError } from './loaded-angular-in-server-error';

const map = new WeakMap<any, Promise<NgModuleRef<any>>>();

const localeDataLoaders: Record<string, () => Promise<unknown>> = {
  // 'da-DK': () => import('@angular/common/locales/da').then((m) => m.default),
  // 'de-AT': () => import('@angular/common/locales/de-AT').then((m) => m.default),
  // 'de-CH': () => import('@angular/common/locales/de-CH').then((m) => m.default),
  // 'de-DE': () => import('@angular/common/locales/de').then((m) => m.default),
  // 'en-CA': () => import('@angular/common/locales/en-CA').then((m) => m.default),
  // 'en-GB': () => import('@angular/common/locales/en-GB').then((m) => m.default),
  'en-US': () => import('@angular/common/locales/en').then((m) => m.default),
  // 'es-ES': () => import('@angular/common/locales/es').then((m) => m.default),
  // 'es-US': () => import('@angular/common/locales/es-US').then((m) => m.default),
  // 'fr-BE': () => import('@angular/common/locales/fr-BE').then((m) => m.default),
  // 'fr-CA': () => import('@angular/common/locales/fr-CA').then((m) => m.default),
  // 'fr-CH': () => import('@angular/common/locales/fr-CH').then((m) => m.default),
  // 'fr-FR': () => import('@angular/common/locales/fr').then((m) => m.default),
  // 'hu-HU': () => import('@angular/common/locales/hu').then((m) => m.default),
  // 'it-CH': () => import('@angular/common/locales/it-CH').then((m) => m.default),
  // 'it-IT': () => import('@angular/common/locales/it').then((m) => m.default),
  // 'nl-BE': () => import('@angular/common/locales/nl-BE').then((m) => m.default),
  // 'nl-NL': () => import('@angular/common/locales/nl').then((m) => m.default),
  // 'nb-NO': () => import('@angular/common/locales/nb').then((m) => m.default),
  // 'pl-PL': () => import('@angular/common/locales/pl').then((m) => m.default),
  // 'sv-SE': () => import('@angular/common/locales/sv').then((m) => m.default),
  // 'zh-CN': () => import('@angular/common/locales/zh-Hans').then((m) => m.default),
};

export default function loadAngularModule(
  mod: any,
  localeForLocaleData: string,
  providers: StaticProvider[] = []
): Promise<NgModuleRef<any> | 'IS_SERVER'> {
  if (typeof IS_SERVER !== 'undefined' && IS_SERVER) {
    return Promise.resolve('IS_SERVER' as const);
    // const moduleRefPromise = (async () => {
    //   try {
    //   const { platformServer } = await import("@angular/platform-server");
    //   const platformRef = platformServer();
    //   const { enableProdMode } = await import("@angular/core"); //.then(m => m.enableProdMode());
    //   enableProdMode();
    //   return await platformRef.bootstrapModule(mod, { ngZone: 'noop' });
    // } catch (e) {throw e.stack}
    // })();
    // return moduleRefPromise;
  }
  if (map.has(mod)) return map.get(mod);
  const moduleRefPromise = (async () => {
    const localeLoader = localeDataLoaders[localeForLocaleData];
    if (!localeLoader) throw new Error(`No locale data for ${localeForLocaleData} found`);
    const localeDataPromise = localeLoader();

    const { platformBrowserDynamic, enableProdMode, registerLocaleData } =
      typeof IS_SERVER !== 'undefined' && IS_SERVER
        ? ({
            platformBrowserDynamic: () => {
              throw new LoadedAngularInServerError();
            },
            enableProdMode: () => {
              throw new LoadedAngularInServerError();
            },
            registerLocaleData: () => {},
          } as Awaited<typeof import('./angular-packages')>)
        : await import('./angular-packages');

    registerLocaleData(await localeDataPromise, localeForLocaleData);

    const platformRef = platformBrowserDynamic(providers);
    enableProdMode();
    return await platformRef.bootstrapModule(mod);
  })();
  map.set(mod, moduleRefPromise);
  return moduleRefPromise;
}
