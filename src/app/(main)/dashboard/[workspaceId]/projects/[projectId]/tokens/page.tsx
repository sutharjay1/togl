"use client";

import Container from "@/app/(main)/_components/container";
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

  console.log({
    data,
  });

  return (
    <Container showItems={true}>
      <div className="container mx-auto flex flex-col gap-4 p-6">
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
                <TableHead>Enabled</TableHead>
                <TableHead>Rules</TableHead>
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
                data?.map((token: any) => (
                  <TableRow key={token.id}>
                    <TableCell className="gap-2 font-medium">
                      <Switch checked={token.isEnabled} />
                      {token.isEnabled ? "Enabled" : "Disabled"}
                    </TableCell>

                    <TableCell>{JSON.stringify(token.rules)}</TableCell>
                    <TableCell className="text-right">
                      {new Date(token.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </main>
      </div>
    </Container>
  );
}
