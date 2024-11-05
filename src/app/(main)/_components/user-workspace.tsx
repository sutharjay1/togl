"use client";

import CreateWorkspace from "@/app/(main)/_components/create-workspace";
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
import { useUser } from "@/hook/useUser";
import { useWorkspace } from "@/hook/useWorkspace";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function UserWorkspace({
  className,
  variant = "gooeyRight",
}: {
  className?: string;
  variant?: "gooeyRight" | "gooeyLeft";
}) {
  const { user } = useUser();
  const { workspaceId } = useWorkspace();

  const { data: workspaces, isLoading: loadingWorkspaces } =
    trpc.workspace.getAll.useQuery();

  const { data: currentWorkspace, isLoading: loadingCurrentWorkspace } =
    trpc.workspace.getById.useQuery(
      {
        workspaceId: workspaceId!,
      },
      { enabled: !!user && !!workspaceId },
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            "ml-4 flex w-fit items-center gap-2 bg-transparent md:w-full",
            className,
          )}
        >
          <Avatar className="h-8 w-8">
            {loadingCurrentWorkspace ? (
              <Skeleton className="h-8 w-8 rounded-full" />
            ) : (
              <AvatarFallback className="bg-gradient-to-tl from-[#2BC0E4] to-[#EAECC6] text-zinc-900">
                {currentWorkspace?.workspace?.name
                  ? currentWorkspace.workspace.name[0].toUpperCase()
                  : "?"}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="hidden flex-col items-start md:flex">
            {loadingCurrentWorkspace ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <P className="text-sm font-medium">
                {currentWorkspace?.workspace?.name || "Select Workspace"}
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
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-800" />
        {loadingWorkspaces ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          workspaces?.workspaces?.map((workspace) => (
            <DropdownMenuItem
              key={workspace.id}
              className="mb-4 px-2 py-1.5 focus:bg-zinc-800 focus:text-white"
            >
              <Link
                href={`/dashboard/${workspace.id}/projects`}
                className="flex w-full items-center"
              >
                <Avatar className="mr-2 h-6 w-6">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    {workspace.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-between">
                  <P className="[&:not(:first-child)]:mt-0">{workspace.name}</P>
                  {workspace.id === currentWorkspace?.workspace?.id && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </div>
              </Link>
            </DropdownMenuItem>
          ))
        )}

        <CreateWorkspace className="my-2 w-full" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
