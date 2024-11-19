import { SidebarInset } from "@/components/ui/sidebar";
import TopBar from "@/features/project/topbar";
import React from "react";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SidebarInset>
        <TopBar />
        <div className="px-3 py-4 md:px-6">{children}</div>
      </SidebarInset>
    </>
  );
};

export default ProjectLayout;
