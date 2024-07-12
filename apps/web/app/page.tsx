"use client";

import React, { Suspense } from "react";
import { LoadedAngularInServerError } from "../lib/loaded-angular-in-server-error";
import SuspendingLazyAngularWrapper from "../angular-helper-components/suspending-lazy-angular-wrapper";
import { DemoService } from "angular-module/dist/demo";
import { AngularUsingComponent } from "./demo-components/AngularUsingComponent";
import { SuspendingConsumeAngularModuleRef } from "../angular-helper-components/suspending-consume-angular-module-ref";

const angularComponentLoader =
  typeof IS_SERVER !== "undefined" && IS_SERVER
    ? () => Promise.reject(new LoadedAngularInServerError())
    : () => import("angular-module/dist/demo").then((m) => m.DemoComponent);

export default function Index() {
  return (
    <>
      <h1>Next.js with Angular Demo</h1>
      <AngularUsingComponent />
      <Suspense fallback={<p>Loading Angular...</p>}>
        <SuspendingConsumeAngularModuleRef>
          {(moduleRef) => (
            <button
              className="p-2"
              onClick={() =>
                moduleRef !== "IS_SERVER"
                  ? moduleRef.injector.get(DemoService).add$.next(1)
                  : null
              }
            >
              Count in React
            </button>
          )}
        </SuspendingConsumeAngularModuleRef>
      </Suspense>
      <Suspense fallback={<p>Loading Angular Component...</p>}>
        <SuspendingLazyAngularWrapper
          name="demo"
          serverFallback={<p>Loading Angular Component...</p>}
          componentLoader={angularComponentLoader}
        />
      </Suspense>
    </>
  );
}
