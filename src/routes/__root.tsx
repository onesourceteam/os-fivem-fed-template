import { Outlet, createRootRoute } from "@tanstack/react-router";

import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { VisibilityProvider } from "@/integrations/providers/visibility.provider";

const RootLayout = () => (
  <>
    <TanStackRouterDevtools />
    <VisibilityProvider>
      <Outlet />
    </VisibilityProvider>
  </>
);

export const Route = createRootRoute({ component: RootLayout });
