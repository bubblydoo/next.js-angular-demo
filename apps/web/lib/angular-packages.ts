import 'zone.js/dist/zone';
// we don't use ZoneAwarePromise which is technically needed in Angular,
// but we ignore the warning that it would throw
(window as any).Zone.assertZonePatched = function noop() {};
// also needed to prevent internals going haywire (namely nativeMicroTaskQueuePromise)
(window as any)['__zone_symbol__Promise'] = Promise;
export { registerLocaleData } from '@angular/common';
export { enableProdMode } from '@angular/core';
export { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
