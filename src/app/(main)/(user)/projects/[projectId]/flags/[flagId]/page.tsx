"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/trpc/client";
import { Check, Copy } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  params: Promise<{
    flagId: string;
  }>;
};

export default function TokenPage({ params }: Props) {
  const resolvedParams = React.use(params);

  const { data, isLoading, refetch } = trpc.token.getTokenById.useQuery({
    tokenId: resolvedParams.flagId,
  });

  const updateTokenMutation = trpc.token.toggle.useMutation();

  const handleToggle = async () => {
    const loadingToast = toast.loading("Setting it up...", {
      duration: 3000,
      position: "bottom-left",
      style: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderColor: "rgba(0, 0, 0, 0.6)",
        color: "white",
      },
      className: "border-[1px]",
    });

    try {
      if (data) {
        await updateTokenMutation.mutateAsync({
          tokenId: data.id,
        });

        refetch();
        toast.success("Token updated successfully!", {
          id: loadingToast,
          description: "The token has been updated successfully.",
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
    } catch (error) {
      toast.error("Failed to update token. Please try again.", {
        id: loadingToast,
        duration: 3000,
        position: "bottom-left",
        style: {
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          borderColor: "rgba(255, 0, 0, 0.4)",
          color: "white",
        },
        className: "border-[1px]",
      });

      console.error("Failed to update token:", error);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects/flag">Projects</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects/flag">Token</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {isLoading ? (
        <TokenSkeleton />
      ) : data ? (
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium">{data.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {data.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="token-enabled"
                    checked={data.isEnabled}
                    onCheckedChange={handleToggle}
                  />
                  <Label htmlFor="token-enabled">
                    {data.isEnabled ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
          <API tokenId={data.id} />
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

function TokenSkeleton() {
  return (
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
  );
}

function API({ tokenId }: { tokenId: string }) {
  const [copied, setCopied] = useState(false);

  const reactCode = `import { useEffect, useState } from 'react'

function MyFeature() {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    const checkFeatureFlag = async () => {
      const response = await fetch('${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/token/${tokenId}', {
        headers: {
          'Authorization': 'Bearer <API_KEY>', 
        }
      })
      const data = await response.json()
      setIsEnabled(data.enabled)
    }

    checkFeatureFlag()
  }, [])

  return isEnabled ? <NewFeature /> : <OldFeature />
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reactCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="w-full max-w-3xl border-border">
      <CardContent className="p-0">
        <div className="border-b border-border">
          <div className="flex items-center justify-between px-4">
            <CardTitle className="text-sm font-medium">
              React Implementation
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div
          className="max-h-[550px] overflow-auto bg-card"
          style={{
            scrollbarWidth: "none",
          }}
        >
          <pre className="bg-background p-4">
            <code className="flex-wrap text-sm text-foreground">
              {reactCode}
            </code>
          </pre>
        </div>
        {/* <div className="border-t border-border p-4">
          <h3 className="mb-4 text-lg font-semibold">Live Example</h3>
          <div className="rounded-lg border border-border bg-card p-4">
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
        </div> */}
      </CardContent>
    </Card>
  );
}
