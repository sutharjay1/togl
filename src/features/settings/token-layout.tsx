"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Container from "@/features/project/container";
import { useProject } from "@/features/project/hooks/useProject";
import { trpc } from "@/trpc/client";
import Link from "next/link";

interface TokenLayoutProps {
  children: React.ReactNode;
}

const TokenLayout = ({ children }: TokenLayoutProps) => {
  const { projectId } = useProject();

  const { data, isLoading } = trpc.token.getTokens.useQuery(
    {
      projectId,
    },
    {
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
    },
  );

  return (
    <Container showItems={true}>
      <div className="mx-auto flex gap-4 px-3 md:px-0">
        <aside className="hidden w-56 space-y-6 md:block">
          <div>
            <h1 className="text-2xl font-semibold">Project</h1>
          </div>
          <nav className="flex flex-col space-y-2">
            {isLoading && (
              <Card>
                <CardContent className="p-4 pt-4">
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
                    href={`/projects/${projectId}/tokens/${token.id}`}
                    className="block"
                  >
                    <Card className=" ">
                      <CardContent className="flex items-center justify-center p-4 pt-4">
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
