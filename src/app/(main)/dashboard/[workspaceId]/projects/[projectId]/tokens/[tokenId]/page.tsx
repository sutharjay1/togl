"use client";

import TokenAPIKey from "@/app/(main)/_components/token-api-key";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/hook/useProject";
import { useWorkspace } from "@/hook/useWorkspace";
import { trpc } from "@/trpc/client";
import { Check, Copy, Terminal } from "lucide-react";
import React, { useEffect, useState } from "react";

type Props = {
  params: Promise<{
    tokenId: string;
  }>;
};

export default function TokenPage({ params }: Props) {
  const resolvedParams = React.use(params);
  const { tokenId } = resolvedParams;

  const { workspaceId } = useWorkspace();
  const { projectId } = useProject();
  const { data, isLoading } = trpc.token.getTokenById.useQuery(
    {
      tokenId,
      workspaceId,
    },
    {
      enabled: !!workspaceId && !!tokenId && !!projectId,
    },
  );

  // const { mutateAsync } = useMutation({
  //   mutationFn: async ({ tokenId }: { tokenId: string }) => {
  //     try {
  //       await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/redis`, {
  //         method: "PUT",
  //         body: JSON.stringify({
  //           flagId: tokenId,
  //           projectId,
  //         }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });
  //     } catch (e) {
  //       if (e instanceof TRPCClientError) {
  //         throw new Error(e.message);
  //       } else {
  //         console.error("Unexpected error:", e);
  //       }
  //     }
  //   },
  //   onSuccess: () => {
  //     toast.success(`Feature Updated`, {
  //       description: "Your feature has been updated",
  //       duration: 3000,
  //       position: "bottom-left",
  //       style: {
  //         backgroundColor: "rgba(0, 255, 0, 0.2)",
  //         borderColor: "rgba(0, 255, 0, 0.4)",
  //         color: "white",
  //       },
  //       className: "border",
  //     });
  //   },
  //   onError: (error: any) => {
  //     toast.error(error.message, {
  //       description: "Please try again",
  //       duration: 3000,
  //       position: "bottom-left",
  //       style: {
  //         backgroundColor: "rgba(255, 0, 0, 0.2)",
  //         borderColor: "rgba(255, 0, 0, 0.4)",
  //         color: "white",
  //       },
  //       className: "border-[1px]",
  //     });
  //   },
  // });

  return (
    <div className="w-full space-y-2">
      <h1 className="text-2xl font-semibold">Token</h1>
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
          <div className="flex flex-1 items-start justify-start gap-4"></div>
          <API />
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

function API() {
  const [copied, setCopied] = useState(false);
  const [featureEnabled, setFeatureEnabled] = useState(false);

  // Example feature flag check
  useEffect(() => {
    const checkFeatureFlag = async () => {
      try {
        const response = await fetch("https://api.togl.io/v1/flags/check", {
          headers: {
            Authorization: "Bearer cm3b9379n000d7hbh5ewt5a5x",
            "Project-ID": "cm3b92shf00097hbhb1pwhumr",
          },
        });
        const data = await response.json();
        setFeatureEnabled(data.enabled);
      } catch (error) {
        console.error("Error checking feature flag:", error);
      }
    };

    checkFeatureFlag();
  }, []);

  const reactCode = `
import { useEffect, useState } from 'react'

function MyFeature() {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    const checkFeatureFlag = async () => {
      const response = await fetch('https://api.togl.io/v1/flags/check', {
        headers: {
          'Authorization': 'Bearer cm3b9379n000d7hbh5ewt5a5x',
          'Project-ID': 'cm3b92shf00097hbhb1pwhumr'
        }
      })
      const data = await response.json()
      setIsEnabled(data.enabled)
    }

    checkFeatureFlag()
  }, [])

  return isEnabled ? <NewFeature /> : <OldFeature />
}`;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="h-full w-full max-w-4xl">
      <CardContent>
        <Card className="">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-1">
            <CardTitle className="text-sm font-medium">
              React Implementation
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(reactCode)}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </CardHeader>

          <pre className="overflow-x-auto rounded-lg bg-muted p-4">
            <code className="text-sm">{reactCode}</code>
          </pre>
        </Card>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Live Example</h3>
          <div className="mt-4 rounded-lg border p-4">
            <div className="flex items-center gap-4">
              <Terminal className="h-6 w-6" />
              <div>
                <p className="font-medium">Feature Status</p>
                <p className="text-sm text-muted-foreground">
                  {featureEnabled
                    ? "Feature is enabled"
                    : "Feature is disabled"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
