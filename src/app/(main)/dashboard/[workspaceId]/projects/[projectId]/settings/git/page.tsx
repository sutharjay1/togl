"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { H4, P } from "@/components/ui/typography";
import { useProject } from "@/hook/useProject";
import { useWorkspace } from "@/hook/useWorkspace";
import { trpc } from "@/trpc/client";
import { GitBranchIcon, GitMergeIcon, PlusIcon } from "lucide-react";

const Git = () => {
  const { workspaceId } = useWorkspace();
  const { projectId } = useProject();

  const { data: project } = trpc.project.getProjectById.useQuery({
    workspaceId,
    projectId,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Git Repository</h2>
        <p className="text-sm text-muted-foreground">
          Connect and manage your Git repository settings.
        </p>
      </div>

      <Card className="flex-1 cursor-pointer border-[1px] border-border/90 bg-accent/25 pt-6">
        {/* <CardHeader>
          <H4 className="font-medium leading-none">GitHub Integration</H4>
        </CardHeader> */}
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <P className="font-medium [&:not(:first-child)]:mt-0">
                Install GitHub App{" "}
              </P>
              <P className="text-sm text-muted-foreground [&:not(:first-child)]:mt-0">
                Connect your GitHub account to enable repository access
              </P>
            </div>
            <Button variant="outline" className="gap-2">
              <GitMergeIcon className="h-4 w-4" />
              Install GitHub App
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 border-[1px] border-border/90 bg-accent/25">
        <CardHeader>
          <H4 className="font-medium leading-none">Repository Settings</H4>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="repo-url">Repository URL</Label>
            <Input
              id="repo-url"
              placeholder="https://github.com/username/repo"
              value={project?.name || ""}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch">Default Branch</Label>
            <div className="flex items-center space-x-2">
              <GitBranchIcon className="h-4 w-4 text-muted-foreground" />
              <Input
                id="branch"
                placeholder="main"
                value={project?.name || ""}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 border-[1px] border-border/90 bg-accent/25">
        <CardHeader>
          <H4 className="font-medium leading-none">Production Branch</H4>
        </CardHeader>
        <CardContent className="space-y-4">
          <P className="[&:not(:first-child)]:mt-0text-sm text-muted-foreground">
            Select the branch you want to use for production deployments.
          </P>
          <div className="flex items-center space-x-2">
            <GitBranchIcon className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="production" />
            <Button variant="outline">Save</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Ignored Build Step</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add commands to ignore certain build steps when changes are pushed.
          </p>
          <div className="space-y-2">
            <Label htmlFor="ignore-build">Ignore Build Command</Label>
            <Input
              id="ignore-build"
              placeholder="git diff --quiet HEAD^ HEAD ./path/to/ignore"
            />
          </div>
          <Button className="gap-2">
            <PlusIcon className="h-4 w-4" />
            Add Ignore Command
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Git;
