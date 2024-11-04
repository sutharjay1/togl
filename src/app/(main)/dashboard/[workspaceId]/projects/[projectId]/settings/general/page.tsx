"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { P } from "@/components/ui/typography";
import { useProject } from "@/hook/useProject";
import { useWorkspace } from "@/hook/useWorkspace";
import { trpc } from "@/trpc/client";
import { CircleIcon } from "lucide-react";

const ProjectSettings = () => {
  const { workspaceId } = useWorkspace();
  const { projectId } = useProject();

  const { data, isLoading } = trpc.project.getProjectById.useQuery({
    workspaceId,
    projectId,
  });

  return (
    <div className="container mx-auto flex gap-8 p-6">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Logo</h2>
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed">
              <CircleIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Recommended size is 256&nbsp;x&nbsp;256px.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">General</h2>
          <div className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="space-y-2">
                <Label htmlFor="project-name">Project name</Label>
                <Input
                  id="project-name"
                  value={data?.name}
                  // onChange={(e) => setProjectName(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Your project will be available as {data?.name}.
                </p>
              </div>
            )}
            {isLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="space-y-2">
                <Label htmlFor="project-description">Project description</Label>
                <Textarea
                  id="project-description"
                  placeholder="e.g. Acme UI"
                  value={data?.description || ""}
                  // onChange={(e) => setProjectDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            )}
            <Button>Update</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-destructive">
            Danger Zone
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Permanently delete this project</h3>
              <P className="text-sm text-muted-foreground [&:not(:first-child)]:mt-0">
                Permanently remove your project and all of its contents from the
                zigma platform. This action is not reversible — please continue
                with caution.
              </P>
            </div>
            <Button variant="destructive">Delete this project</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
