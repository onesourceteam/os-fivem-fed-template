import { Listen, Observe, Post, isEnvBrowser } from "fivem-frontend-lib";
import { useLocation, useNavigate } from "@tanstack/react-router";

import { cn } from "../../utils/misc";
import { useEffect } from "react";

export const VisibilityProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const visible = location.pathname.includes("/ui");
  Observe<boolean>("setVisibility", (n) => {
    if (n) {
      navigate({ to: "/ui" });
    } else {
      navigate({ to: "/" });
    }
  });
  Observe<string>("setColor", (data) => {
    document.documentElement.style.setProperty("--primary-color", data);
  });
  Listen<KeyboardEvent>("keydown", (e) => {
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
