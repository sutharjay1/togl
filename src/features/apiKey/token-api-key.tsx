"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/trpc/client";
import { Key, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { TRPCClientError } from "@trpc/client";
import CreateAPIKey from "./create-api";

export default function TokenAPIKey({
  projectId = "default-project-id",
}: {
  projectId?: string;
}) {
  const {
    data: apiKeysData,
    isLoading,
    refetch,
  } = trpc.apiKey.getAPIKeys.useQuery({ projectId });

  const deleteApiKey = trpc.apiKey.deleteAPIKey.useMutation();

  const handleDeleteApiKey = async (apiKeyId: string) => {
    try {
      await deleteApiKey.mutateAsync({ projectId, apiKeyId });
      await refetch();
      toast.success("API key deleted successfully", {
        description: "The API key has been deleted successfully.",
        duration: 3000,
        position: "bottom-left",
        style: {
          backgroundColor: "rgba(0, 255, 0, 0.2)",
          borderColor: "rgba(0, 255, 0, 0.4)",
          color: "white",
        },
        className: "border-[1px]",
      });
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error("Error deleting API key", {
          description: error.message,
          duration: 3000,
          position: "bottom-left",
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            borderColor: "rgba(255, 0, 0, 0.4)",
            color: "white",
          },
          className: "border-[1px]",
        });
      } else {
        toast.error("Unexpected Error", {
          description: "Something went wrong. Please try again.",
          duration: 3000,
          position: "bottom-left",
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            borderColor: "rgba(255, 0, 0, 0.4)",
            color: "white",
          },
          className: "border-[1px]",
        });
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>Manage API keys for your project</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : apiKeysData?.apiKeys.length ? (
          <ul className="space-y-2">
            {apiKeysData.apiKeys.map((key) => (
              <li key={key.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span>{key.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteApiKey(key.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-muted-foreground">No API keys found</p>
        )}
      </CardContent>
      {apiKeysData?.apiKeys.length === 0 && (
        <CardFooter className="justify-end">
          <CreateAPIKey />
        </CardFooter>
      )}
    </Card>
  );
}
