import { use, useContext, useMemo } from "react";
import LazyAngularModuleContext from "../lib/lazy-angular-module-context";
import { executeCachedLoader } from "./loader-cache";
import { NgModuleRef } from "@angular/core";

export function SuspendingConsumeAngularModuleRef({
  children
}: {
  children: (moduleRef: NgModuleRef<any> | "IS_SERVER") => any;
}) {
  const moduleRefLoader = useContext(LazyAngularModuleContext);
  const moduleRefPromise = useMemo(() => executeCachedLoader(moduleRefLoader, true), [moduleRefLoader]);
  const moduleRef = use(moduleRefPromise);
  return children(moduleRef);
}
