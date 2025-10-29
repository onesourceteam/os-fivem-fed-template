import "./styles/global.css";

import { RouterProvider, createRouter } from "@tanstack/react-router";

import ColorProvider from "./integrations/providers/color.provider";
import { Debugger } from "fivem-frontend-lib";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

new Debugger([
  {
    action: "setColor",
    data: "#ff0000",
  },
  {
    action: "setVisibility",
    data: true,
  },
]);

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ColorProvider>
        <RouterProvider router={router} />
      </ColorProvider>
    </StrictMode>
  );
}
