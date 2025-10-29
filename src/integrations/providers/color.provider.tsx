import type { ReactNode } from "react";
import { hexToRgb } from "@/utils/misc";
import { primaryColor } from "@/stores/primary-color.store";
import { useObserve } from "os-fivem-fed-modules";

export default function ColorProvider({ children }: { children: ReactNode }) {
  useObserve<string>("setColor", (c) => {
    let color = c;
    if (c.startsWith("#")) {
      color = hexToRgb(c);
    }
    primaryColor.setState(color);
    document.documentElement.style.setProperty("--primary-color", color);
  });
  return <>{children}</>;
}
