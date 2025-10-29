import { VisibilityProvider } from "../integrations/providers/visibility.provider";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <VisibilityProvider>
      <></>
    </VisibilityProvider>
  );
}
