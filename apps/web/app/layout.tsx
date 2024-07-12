import "../styles/globals.css";
import { RootAngularProvider } from "../lib/RootAngularProvider";
import { LocaleContextProvider } from "shared-contexts";

export default function Layout({ children }: { children: any }) {
  return (
    <html>
      <body>
        <LocaleContextProvider locale="en-US">
          <RootAngularProvider>
            {children}
          </RootAngularProvider>
        </LocaleContextProvider>
      </body>
    </html>
  );
}
