"use client";

import CreateProject from "@/app/(main)/_components/create-project";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { H3, H4, P } from "@/components/ui/typography";
import { useWorkspace } from "@/hook/useWorkspace";
import { trpc } from "@/trpc/client";
import { GitBranch, Loader2, MoreHorizontal, ToggleRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";

export default function ProjectSection() {
  const router = useRouter();
  const { workspaceId } = useWorkspace();

  const {
    data: projects,
    isLoading,
    refetch,
  } = trpc.project.getProjects.useQuery(
    {
      workspaceId,
    },
    {
      refetchIntervalInBackground: true,
    },
  );

  const { mutateAsync: deleteProject, isLoading: deleteLoading } =
    trpc.project.deleteProject.useMutation({
      onSuccess: (data) => {
        if (data) {
          toast.success("Project Deleted", {
            description: "Your project has been deleted",
            duration: 3000,
            position: "bottom-left",
            style: {
              backgroundColor: "rgba(0, 255, 0, 0.2)",
              borderColor: "rgba(0, 255, 0, 0.4)",
              color: "white",
            },
            className: "border",
          });
        }
      },
      onError: (error) => {
        toast.error(error.message, {
          description: "Please try again",
          duration: 3000,
          position: "bottom-left",
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            borderColor: "rgba(255, 0, 0, 0.4)",
            color: "white",
          },
          className: "border-[1px]",
        });
      },
    });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card
            key={i}
            className="h-40 flex-1 border-[1px] border-border/25 bg-accent/25"
          >
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <Card className="rounded-xl">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 rounded-full bg-primary/5 p-3 backdrop-blur-xl">
              <ToggleRight className="h-6 w-6 text-primary" />
            </div>
            <H3 className="">Start a New Project</H3>
            <P className="mb-4 text-sm text-muted-foreground [&:not(:first-child)]:mt-1">
              You haven&apos;t created any projects yet
            </P>

            <CreateProject />
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject({ workspaceId, projectId }).then(() => {
      refetch();
    });
  };

  const navigateToSettings = (projectId: string) => {
    router.push(
      `/dashboard/${workspaceId}/projects/${projectId}/settings/general`,
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/dashboard/${workspaceId}/projects/${project.id}/tokens`}
        >
          <Card
            key={project.id}
            className="h-40 flex-1 cursor-pointer border-border/25 bg-zinc-900/90 hover:border-[1px] hover:border-border/90"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <H4 className="font-medium leading-none">{project.name}</H4>
                <P className="text-sm text-muted-foreground [&:not(:first-child)]:mt-0">
                  No tokens
                </P>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 w-9 p-0">
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  side="bottom"
                  className="w-40 bg-zinc-900/90 p-2"
                >
                  <Button
                    variant={"ghost"}
                    className="w-full text-left text-sm"
                    onClick={() => navigateToSettings(project.id)}
                  >
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-left text-sm text-destructive hover:bg-destructive/25 hover:text-destructive"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    {deleteLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}{" "}
                    Delete Project
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter className="">
              <Button
                variant="link"
                className="mb-8 h-auto p-0 text-indigo-600"
                asChild
              >
                <Link href="#" className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Connect Git Repository
                </Link>
              </Button>
            </CardFooter>
          </Card>{" "}
        </Link>
      ))}
    </div>
  );
}
