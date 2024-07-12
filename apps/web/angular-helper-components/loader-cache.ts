import LazyPromise from 'p-lazy';

const loaderCache = new WeakMap<() => any, Promise<any>>();

export function executeCachedLoader<T>(loader: () => Promise<T>, lazy?: boolean): Promise<T> {
  if (typeof loader !== 'function') throw new Error('loader must be a function');
  if (loaderCache.has(loader)) return loaderCache.get(loader)!;
  // lazy means loader will be executed on await (or on ".then" or ".catch")
  const result = lazy ? LazyPromise.from(loader) : loader();
  loaderCache.set(loader, result);
  return result;
}
