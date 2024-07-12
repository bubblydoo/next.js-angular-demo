import { useObservable } from "@bubblydoo/angular-react";
import { DemoService } from "angular-module/dist/demo";
import { EMPTY } from "rxjs";
import useLazyInjected from "../../lib/use-lazy-injected";

export function AngularUsingComponent() {
  const service = useLazyInjected(DemoService);
  const value$ = service?.value$ || EMPTY;
  const [value] = useObservable<string | number>(value$, "Loading...");
  return <p>Counter display in React: {value}</p>;
}
