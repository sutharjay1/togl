"use client";

import { useProject } from "@/hook/useProject";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ProjectIdLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { setProjectId } = useProject();
  useEffect(() => {
    setProjectId(pathname?.split("/")[4]);
  }, [pathname, setProjectId]);

  return <> {children}</>;
};

export default ProjectIdLayout;
