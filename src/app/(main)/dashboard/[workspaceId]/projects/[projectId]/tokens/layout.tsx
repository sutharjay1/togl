"use client";

import TokenLayout from "@/app/(main)/_components/token-layout";
import { useProject } from "@/hook/useProject";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";

type ProjectLayoutProps = {
  children: React.ReactNode;
};

const ProjectLayout = ({ children }: ProjectLayoutProps) => {
  const pathname = usePathname();
  const { setProjectId } = useProject();

  useEffect(() => {
    setProjectId(pathname.split("/")[4]);
  }, [pathname, setProjectId]);

  return <TokenLayout>{children}</TokenLayout>;
};

export default ProjectLayout;
