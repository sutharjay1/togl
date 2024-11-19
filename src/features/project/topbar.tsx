"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import CreateFlag from "../flags/components/create-flag";
import CreateProject from "./create-project";
import { ProjectSettingButton } from "./project-setting-button";

type TimeLine = "Good Morning" | "Good Afternoon" | "Good Evening";

const getTimeGreeting = (): TimeLine => {
  const hours = new Date().getHours();
  if (hours < 12) return "Good Morning";
  if (hours < 16) return "Good Afternoon";
  return "Good Evening";
};

const formatDate = (): string => {
  const date = new Date();
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const TopBar = () => {
  const { user } = useUser();
  const pathname = usePathname();

  const greeting = useMemo(() => getTimeGreeting(), []);
  const date = useMemo(() => formatDate(), []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUpdated, setIsUpdated] = useState(false);

  return (
    <div className="my-2 flex items-center border-b border-zinc-800 px-4 pb-2">
      <SidebarTrigger className="left-4 top-4 mr-4" />
      <div className="flex flex-1 items-center justify-between p-0.5 font-geistSans">
        <div>
          <span className="block text-sm font-bold">
            🚀 {greeting}, {user?.name || "Guest"}!
          </span>
          <span className="block font-inter text-xs font-semibold text-stone-500">
            {date}
          </span>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <ProjectSettingButton />

          {(pathname === "/projects" || pathname === "/dashboard") && (
            <CreateProject show={false} setIsUpdated={setIsUpdated} />
          )}
          {pathname !== "/dashboard" && (
            <CreateFlag show={false} setIsUpdated={setIsUpdated} />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
