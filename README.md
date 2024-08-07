# Next.js with Angular components

This is a demo to show a Next.js project which loads Angular components using [@bubblydoo/angular-react](https://github.com/bubblydoo/angular-react).

It is configured to lazily load any Angular component. Angular SSR is not supported, but fallbacks are rendered using Next.js SSR. The Angular components are rendered on the client-side only and use Suspense boundaries to be rendered.

## Examples

#### Loading an Angular component

```tsx
const angularComponentLoader =
  typeof IS_SERVER !== 'undefined' && IS_SERVER
    ? () => Promise.reject(new LoadedAngularInServerError())
    : () => import('angular-module/dist/demo').then((m) => m.DemoComponent);

export default function Index() {
  return (
    <Suspense fallback={<p>Loading Angular Component...</p>}>
      <SuspendingLazyAngularWrapper
        name="demo"
        serverFallback={<p>Loading Angular Component...</p>}
        componentLoader={angularComponentLoader}
      />
    </Suspense>
  );
}
```

#### Using an Angular Service in React

```tsx
import { useInjected, useObservable } from "@bubblydoo/angular-react";
import { DemoService } from "angular-module/dist/demo";

export default function AngularUsingComponent() {
  const service = useInjected(DemoService);
  const [value] = useObservable(service.value$);
  return <div>{value}</div>;
}

export default function Index() {
  return (
    <ResolveAngularModuleContext fallback={<div>Loading Angular context...</div>}>
      <AngularUsingComponent />
    </ResolveAngularModuleContext>
  );
}
```

## Troubleshooting

### `inject() must be called from an injection context` or `NG0203`

This is probably because of a version mismatch between @angular/* inside `packages/angular-module` or `apps/web`. Make sure they're the same.

For this reason we also set `compilerOptions.preserveSymlinks: true` and `config.resolveLoader.symlinks = false` (in Webpack), this corresponds to [this](https://stackoverflow.com/questions/51485868/inject-must-be-called-from-an-injection-context) setting inside Angular CLI.

### `The Angular Compiler requires TypeScript >=4.4.2 and <4.6.0 but 4.6.2 was found instead.`

This is also because of a version mismatch of `typescript` between `packages/angular-module` or `apps/web`. Ensure that they're using the same version.

### Usage with `@angular/animations`

Hot reloading with `@angular/animations` seems buggy because element removal works differently.
