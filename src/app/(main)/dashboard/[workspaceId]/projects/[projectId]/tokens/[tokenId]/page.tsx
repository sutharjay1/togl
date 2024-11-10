"use client";

import TokenAPIKey from "@/app/(main)/_components/token-api-key";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import { useProject } from "@/hook/useProject";
import { useWorkspace } from "@/hook/useWorkspace";
import { trpc } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { toast } from "sonner";

type Props = {
  params: {
    tokenId: string;
  };
};

export default function TokenPage({ params }: Props) {
  const { tokenId } = params;
  const { workspaceId } = useWorkspace();
  const { projectId } = useProject();
  const { data, isLoading } = trpc.token.getTokenById.useQuery({
    tokenId,
    workspaceId,
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ tokenId }: { tokenId: string }) => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/redis`, {
          method: "PUT",
          body: JSON.stringify({
            flagId: tokenId,
            projectId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (e) {
        if (e instanceof TRPCClientError) {
          throw new Error(e.message);
        } else {
          console.error("Unexpected error:", e);
        }
      }
    },
    onSuccess: () => {
      toast.success(`Feature Updated`, {
        description: "Your feature has been updated",
        duration: 3000,
        position: "bottom-left",
        style: {
          backgroundColor: "rgba(0, 255, 0, 0.2)",
          borderColor: "rgba(0, 255, 0, 0.4)",
          color: "white",
        },
        className: "border",
      });
    },
    onError: (error: any) => {
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

  return (
    <div className="w-full">
      <h1 className="mb-6 text-3xl font-bold">Token Details</h1>
      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-4 w-[300px]" />
            <Skeleton className="mb-2 h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </CardContent>
        </Card>
      ) : data ? (
        <div className="flex w-full flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Token Information</CardTitle>
              <CardDescription>Details about the current token</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="">
                <P className="font-semibold [&:not(:first-child)]:mt-0">
                  Token ID:
                </P>
                <span>{data.id}</span>
                <P className="font-semibold [&:not(:first-child)]:mt-2">
                  Project ID:
                </P>
                <span>{data.projectId || "N/A"}</span>
                <P className="font-semibold [&:not(:first-child)]:mt-2">
                  Created At:
                </P>
                <span>{new Date(data.createdAt).toLocaleString()}</span>
                <P className="font-semibold [&:not(:first-child)]:mt-2">
                  Updated At:
                </P>
                <span>{new Date(data.updatedAt).toLocaleString()}</span>
                <P className="font-semibold [&:not(:first-child)]:mt-2">
                  Status:
                </P>
                <span>
                  <Badge variant={data.isEnabled ? "success" : "destructive"}>
                    {data.isEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Switch
                    checked={data.isEnabled}
                    className="mr-2"
                    onClick={() =>
                      mutateAsync({
                        tokenId: data.id,
                      })
                    }
                  />
                </span>
              </div>
            </CardContent>
          </Card>
          <TokenAPIKey projectId={projectId} />
        </div>
      ) : (
        <Card>
          <CardContent>
            <p className="py-4 text-center">No token data found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
