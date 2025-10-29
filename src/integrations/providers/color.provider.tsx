import { Observe } from "fivem-frontend-lib";
import { hexToRgb } from "../../utils/misc";
import { primaryColor } from "../../stores/primary-color.store";

export default function ColorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  Observe<string>("setColor", (c) => {
    let color = c;
    if (c.startsWith("#")) {
      color = hexToRgb(c);
    }
    primaryColor.setState(color);
    document.documentElement.style.setProperty("--primary-color", color);
  });
  return <>{children}</>;
}
