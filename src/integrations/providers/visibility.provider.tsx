import {
  Post,
  isEnvBrowser,
  useListen,
  useObserve,
} from "os-fivem-fed-modules";
import { useLocation, useNavigate } from "@tanstack/react-router";

import { cn } from "@/utils/misc";
import { useEffect } from "react";

export const VisibilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const visible = location.pathname.includes("/ui");
  useObserve<boolean>("setVisibility", (n) => {
    if (n) {
      navigate({ to: "/ui" });
    } else {
      navigate({ to: "/" });
    }
  });
  useObserve<string>("setColor", (data) => {
    document.documentElement.style.setProperty("--primary-color", data);
  });
  useListen<KeyboardEvent>("keydown", (e) => {
    if (visible && ["Escape"].includes(e.code)) {
      navigate({ to: "/" });
    }
  });
  useEffect(() => {
    if (!visible && !isEnvBrowser()) {
      Post.create("removeFocus");
    }
  }, [visible]);
  return (
    <div
      className={cn("h-screen w-screen", {
        "bg-gray-600": isEnvBrowser(),
      })}
    >
      {children}
    </div>
  );
};
