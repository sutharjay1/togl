"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { P } from "@/components/ui/typography";

import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Check, ChevronDown } from "lucide-react";
import { useProject } from "./hooks/useProject";

export function ProjectDropDown({ className }: { className?: string }) {
  const { user } = useUser();
  const { projectId, setProjectId } = useProject();

  const { data: projects } = trpc.project.getProjects.useQuery();

  const { data: currentProject, isLoading: loadingCurrentProject } =
    trpc.project.getProjectById.useQuery(
      {
        projectId,
      },
      { enabled: !!user && !!projectId },
    );

  const handleSelectProject = (projectId: string) => {
    setProjectId(projectId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "my-2 flex w-full items-center gap-2 bg-transparent py-2 md:w-full",
            className,
          )}
        >
          <Avatar className="h-8 w-8">
            {loadingCurrentProject ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : (
              <AvatarFallback className="bg-gradient-to-tl from-[#2BC0E4] to-[#EAECC6] text-zinc-900">
                {currentProject?.name
                  ? currentProject?.name[0].toUpperCase()
                  : "?"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="hidden flex-col items-start md:flex">
            {loadingCurrentProject ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <P className="text-sm font-medium">
                {currentProject?.name || "Select Workspace"}
              </P>
            )}
          </div>
          <ChevronDown className="ml-auto h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 space-y-1 bg-zinc-900/90 p-2 text-zinc-300"
        align="end"
      >
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        {loadingCurrentProject ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          projects?.map((workspace: any) => (
            <DropdownMenuItem
              key={workspace.id}
              className="jc mb-4 flex w-full items-center px-2 py-1.5 focus:bg-zinc-800 focus:text-white"
              onSelect={() => handleSelectProject(workspace.id)}
            >
              <Avatar className="mr-2 h-6 w-6">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                  {workspace.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex w-full items-center justify-between">
                <P className="[&:not(:first-child)]:mt-0">{workspace.name}</P>
                {workspace.id === currentProject?.id && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
