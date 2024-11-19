"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { H3, H4, P } from "@/components/ui/typography";
import CreateFlag from "@/features/flags/components/create-flag";
import { useProject } from "@/features/project/hooks/useProject";
import { trpc } from "@/trpc/client";
import { ToggleRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const FlagRoot = () => {
  const { projectId } = useProject();
  const [isUpdated, setIsUpdated] = useState(false);

  const {
    data: flags,
    isLoading,
    refetch,
  } = trpc.token.getTokens.useQuery(
    {
      projectId,
    },
    {
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
    },
  );

  useEffect(() => {
    if (isUpdated) {
      refetch();
      setIsUpdated(false);
    }
  }, [isUpdated, refetch]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center space-y-2 pb-2">
      <H4 className="flex w-full items-center justify-start">Flags</H4>
      <div className="grid w-full gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {flags?.length === 0 ? (
          <Card className="col-span-full rounded-xl">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 rounded-full bg-primary/5 p-3 backdrop-blur-xl">
                  <ToggleRight className="h-6 w-6 text-primary" />
                </div>
                <H3 className="">Start a New Token</H3>
                <P className="mb-4 text-sm text-muted-foreground [&:not(:first-child)]:mt-1">
                  Create a new token to get started
                </P>
                <CreateFlag show setIsUpdated={setIsUpdated} />
              </div>
            </CardContent>
          </Card>
        ) : (
          flags?.map((flag: any) => (
            <Link key={flag.id} href={`/projects/flags/${flag.id}`}>
              <Card
                key={flag.id}
                className="h-40 flex-1 cursor-pointer border-border/25 bg-zinc-900/90 hover:border-[1px] hover:border-border/90"
              >
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <H4 className="font-medium leading-none">{flag.name}</H4>
                    <P className="text-sm text-muted-foreground [&:not(:first-child)]:mt-0">
                      No tokens
                    </P>
                  </div>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {isLoading && (
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
      )}
    </div>
  );
};

export default FlagRoot;
