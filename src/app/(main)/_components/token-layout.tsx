"use client";

import Container from "@/app/(main)/_components/container";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/hook/useProject";
import { useWorkspace } from "@/hook/useWorkspace";
import { trpc } from "@/trpc/client";
import Link from "next/link";

interface TokenLayoutProps {
  children: React.ReactNode;
}

const TokenLayout = ({ children }: TokenLayoutProps) => {
  const { workspaceId } = useWorkspace();
  const { projectId } = useProject();

  const { data, isLoading } = trpc.token.getTokens.useQuery(
    {
      projectId,
      workspaceId,
    },
    {
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
    },
  );

  return (
    <Container showItems={true}>
      <div className="mx-auto flex gap-8 px-3 md:px-0">
        <aside className="hidden w-64 space-y-6 md:block">
          <div>
            <h1 className="text-2xl font-semibold">Project</h1>
          </div>
          <nav className="flex flex-col space-y-1">
            {isLoading && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-3/5" />
                  </div>
                </CardContent>
              </Card>
            )}

            {!isLoading &&
              data &&
              data.length > 0 &&
              data?.map((token: any) => {
                return (
                  <Link
                    key={token.id}
                    href={`/dashboard/${workspaceId}/projects/${projectId}/tokens/${token.id}`}
                    className="block"
                  >
                    <Card className=" ">
                      <CardContent className="flex items-center justify-center pt-6">
                        <h2 className="text-base font-medium">{token.name}</h2>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </Container>
  );
};

export default TokenLayout;
