import InterfacePage from "@/pages/interface.page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ui")({
  component: InterfacePage,
});
