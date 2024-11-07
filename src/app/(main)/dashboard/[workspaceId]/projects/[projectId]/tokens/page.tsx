"use client";

import Container from "@/app/(main)/_components/container";
import JsonFormatter from "@/components/global/json-formatter";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProject } from "@/hook/useProject";
import { useWorkspace } from "@/hook/useWorkspace";
import { trpc } from "@/trpc/client";

export default function Tokens() {
  const { workspaceId } = useWorkspace();
  const { projectId } = useProject();
  const { data, isLoading } = trpc.token.getTokens.useQuery({
    projectId,
    workspaceId,
  });

  return (
    <Container showItems={true}>
      <div className="mx-auto flex flex-col gap-4 px-2 py-6">
        <div className="w-64 space-y-1">
          <h1 className="text-2xl font-semibold">Tokens</h1>
          <p className="text-sm text-muted-foreground">
            View and manage project tokens
          </p>
        </div>
        <main className="flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ProjectID</TableHead>
                <TableHead>TokenID</TableHead>
                <TableHead className="cursor-pointer">Rules</TableHead>
                <TableHead>Enabled</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex items-center justify-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="flex flex-col space-y-2">
                        <Skeleton className="h-4 w-96" />
                        <Skeleton className="h-4 w-96" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !data || data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No Tokens found.
                  </TableCell>
                </TableRow>
              ) : (
                !isLoading &&
                data &&
                data.length > 0 &&
                data?.map((token: any) => {
                  return (
                    <TableRow key={token.id}>
                      <TableCell>{projectId}</TableCell>
                      <TableCell>{token.id}</TableCell>
                      <TableCell>
                        <JsonFormatter jsonString={token.rules} />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-4">
                          <Switch checked={token.isEnabled} className="mr-2" />
                          {token.isEnabled ? "Enabled" : "Disabled"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {new Date(token.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </main>
      </div>
    </Container>
  );
}
