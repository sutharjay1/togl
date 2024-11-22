"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import CreateProject from "@/features/project/create-project";
import { trpc } from "@/trpc/client";
import { Loader2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GrOrganization } from "react-icons/gr";
import { toast } from "sonner";
import { useProject } from "./hooks/useProject";

export function Project() {
  const router = useRouter();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { setProjectId } = useProject();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isUpdated, setIsUpdated] = useState(false);

  const {
    data: projects,
    isLoading,
    refetch,
  } = trpc.project.getProjects.useQuery();
  const deleteProjectMutation = trpc.project.deleteProject.useMutation({
    onSuccess: () => {
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
      refetch();
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

  useEffect(() => {
    if (projects?.length) {
      setProjectId(projects[0].id);
    }
  }, [projects, setProjectId]);

  const handleDeleteProject = async (projectId: string) => {
    setDeleteLoading(true);
    await deleteProjectMutation.mutateAsync({ projectId });
    setDeleteLoading(false);
  };

  const navigateToSettings = (projectId: string) => {
    router.push(`/projects/${projectId}/settings/general`);
  };

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
              <GrOrganization className="h-6 w-6 text-primary" />
            </div>
            <H3>Start a New Project</H3>
            <P className="mb-4 text-sm text-muted-foreground [&:not(:first-child)]:mt-1">
              You haven&apos;t created any projects yet
            </P>
            <CreateProject setIsUpdated={setIsUpdated} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project: any) => (
        <Link key={project.id} href={`/projects/flags/${project.id}`}>
          <Card className="relative h-40 flex-1 cursor-pointer border-border/25 bg-zinc-900/90 hover:border-[1px] hover:border-border/90">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <H4 className="font-medium leading-none">
                  {project.name || "No token name"}
                </H4>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="absolute right-4 top-4">
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
                    ) : null}
                    Delete Project
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>

            <CardFooter>
              <Avatar>
                <AvatarFallback>{project.user?.name[0]}</AvatarFallback>
              </Avatar>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
