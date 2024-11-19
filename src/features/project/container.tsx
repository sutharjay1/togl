"use client";

import CreateTokenForm from "@/features/flags/components/create-flag-form";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { useProject } from "@/features/project/hooks/useProject";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
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
  showItems: boolean;
};

const Container = ({ children, showItems = false }: Props) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const { projectId } = useProject();

  const projectItems: ProjectItems[] = [
    {
      label: "Project",
      path: `/projects/flags/${projectId}/tokens`,
    },
    {
      label: "Members",
      path: `/projects/flags/${projectId}/members`,
    },
    {
      label: "Settings",
      path: `/projects/flags/${projectId}/settings/general`,
    },
  ];

  return (
    <div className="mt-24 flex-1 overflow-hidden">
      {/* <div className="mx-auto max-w-5xl px-4"> */}
      <div className="mx-auto w-full px-4">
        <div className="flex items-center justify-between border-b">
          <nav className="flex space-x-1">
            {projectItems && showItems && projectItems.length > 0 ? (
              projectItems.map((item) => (
                <Link
                  href={item.path}
                  key={item.path}
                  className={cn(
                    "inline-flex h-10 items-center justify-center whitespace-nowrap rounded-t-md px-4 py-2 pb-2 text-sm font-medium transition-all hover:text-foreground focus-visible:outline-none",
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
                  href={`/projects/flags`}
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
                  href={`/team/flags`}
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
                  href={`/settings/flags/general`}
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

          {projectItems && !showItems ? (
            <CreateProject show={false} />
          ) : (
            <Modal>
              <ModalTrigger asChild className="mb-2">
                {false ? (
                  <Button variant="shine" className="h-9 py-1">
                    <Plus className="mr-2 h-4 w-4" /> New Token
                  </Button>
                ) : (
                  <Button variant="shine" className="h-9 py-1">
                    <Plus className="mr-0 h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">New Token</span>
                  </Button>
                )}
              </ModalTrigger>
              <ModalContent>
                <ModalHeader>
                  <ModalTitle className="text-left">
                    Create new project
                  </ModalTitle>
                  <ModalDescription className="text-left">
                    Create a new project to get started
                  </ModalDescription>
                </ModalHeader>

                <CreateTokenForm />
              </ModalContent>
            </Modal>
          )}
        </div>
        <main className="w-full py-6">{children}</main>
      </div>
    </div>
  );
};

export default Container;
