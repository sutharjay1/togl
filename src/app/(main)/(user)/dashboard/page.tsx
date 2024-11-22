"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { H3, H4, P } from "@/components/ui/typography";
import CreateProject from "@/features/project/create-project";

import { trpc } from "@/trpc/client";
import { Loader2, MoreHorizontal, ToggleRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Dashboard = () => {
  const [isUpdated, setIsUpdated] = useState(false);

  const {
    data: projects,
    isLoading,
    refetch,
  } = trpc.project.getProjects.useQuery();

  useEffect(() => {
    if (isUpdated) {
      refetch();
      setIsUpdated(false);
    }
  }, [isUpdated, refetch]);

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
  const handleDeleteProject = async (projectId: string) => {
    await deleteProject({ projectId }).then(() => {
      refetch();
    });
  };

  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center space-y-2 pb-2">
        <H4 className="flex w-full items-center justify-start">Projects</H4>
        <div className="grid w-full gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects?.length === 0 ? (
            <Card className="col-span-full rounded-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-primary/5 p-3 backdrop-blur-xl">
                    <ToggleRight className="h-6 w-6 text-primary" />
                  </div>
                  <H3 className="">Start a New Project</H3>
                  <P className="mb-4 text-sm text-muted-foreground [&:not(:first-child)]:mt-1">
                    Get started by creating a new project
                  </P>
                  <CreateProject show={true} setIsUpdated={setIsUpdated} />
                </div>
              </CardContent>
            </Card>
          ) : (
            projects?.map((project: any) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}/flags`}
                className="block"
              >
                <Card
                  key={project.id}
                  className="h-40 flex-1 cursor-pointer border-border/25 bg-zinc-900/90 hover:border-[1px] hover:border-border/90"
                >
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <H4 className="font-medium leading-none">
                        {project.name}
                      </H4>
                      <P className="text-sm text-muted-foreground [&:not(:first-child)]:mt-0">
                        No tokens
                      </P>
                    </div>{" "}
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
                          // onClick={() => navigateToSettings(project.id)}
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
                </Card>
              </Link>
            ))
          )}
        </div>

        {isLoading && (
          <div className="grid w-full gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
        )}
      </div>
    </>
  );
};

export default Dashboard;
