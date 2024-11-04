"use client";

import { useProject } from "@/hook/useProject";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import SettingsLayout from "../_components/settings-layout";

type ProjectLayoutProps = {
  children: React.ReactNode;
};

const ProjectLayout = ({ children }: ProjectLayoutProps) => {
  const pathname = usePathname();
  const { setProjectId } = useProject();

  useEffect(() => {
    setProjectId(pathname.split("/")[4]);
  }, [pathname, setProjectId]);

  return (
    <SettingsLayout>
      <div className="h-screen overflow-y-auto">{children}</div>a
    </SettingsLayout>
  );
};

export default ProjectLayout;
