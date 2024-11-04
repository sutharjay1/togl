"use client";

import { useWorkspace } from "@/hook/useWorkspace";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import CreateProject from "./create-project";

export type ProjectItems = {
  label: string;
  path: string;
};

type Props = {
  children: React.ReactNode;
  projectItems?: ProjectItems[];
};

const Container = ({ children, projectItems }: Props) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { workspaceId } = useWorkspace();

  return (
    <div className="mt-24 flex-1 overflow-hidden">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex items-center justify-between border-b pb-2">
          <nav className="flex space-x-1">
            {projectItems && projectItems.length > 0 ? (
              projectItems.map((item) => (
                <Link
                  href={item.path}
                  key={item.path}
                  className={cn(
                    "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-t-md px-4 py-2 text-sm font-medium transition-all hover:text-foreground focus-visible:outline-none",
                    isActive(item.path)
                      ? "border-b-2 border-foreground text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                <Link
                  href={`/dashboard/${workspaceId}/projects`}
                  className={cn(
                    "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-t-md px-4 py-2 text-sm font-medium transition-all hover:text-foreground focus-visible:outline-none",
                    isActive("/dashboard/projects")
                      ? "border-b-2 border-foreground text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  Projects
                </Link>
                <Link
                  href={`/dashboard/${workspaceId}/team`}
                  className={cn(
                    "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-t-md px-4 py-2 text-sm font-medium transition-all hover:text-foreground focus-visible:outline-none",
                    isActive("/dashboard/team")
                      ? "border-b-2 border-foreground text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  Team
                </Link>
                <Link
                  href={`/dashboard/${workspaceId}/settings`}
                  className={cn(
                    "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-t-md px-4 py-2 text-sm font-medium transition-all hover:text-foreground focus-visible:outline-none",
                    isActive(`"/dashboard/settings"`)
                      ? "border-b-2 border-foreground text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  Settings
                </Link>
              </>
            )}
          </nav>
          <CreateProject show={false} />
        </div>
        <main className="w-full py-6">{children}</main>
      </div>
    </div>
  );
};

export default Container;
