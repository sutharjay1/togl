// "use client";

// import TokenAPIKey from "@/app/(main)/_components/token-api-key";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useProject } from "@/hook/useProject";
// import { useWorkspace } from "@/hook/useWorkspace";
// import { trpc } from "@/trpc/client";
// import { Check, Copy, Terminal } from "lucide-react";
// import React, { useEffect, useState } from "react";

// type Props = {
//   params: Promise<{
//     tokenId: string;
//   }>;
// };

// export default function TokenPage({ params }: Props) {
//   const resolvedParams = React.use(params);
//   const { tokenId } = resolvedParams;

//   const { workspaceId } = useWorkspace();
//   const { projectId } = useProject();
//   const { data, isLoading } = trpc.token.getTokenById.useQuery(
//     {
//       tokenId,
//       workspaceId,
//     },
//     {
//       enabled: !!workspaceId && !!tokenId && !!projectId,
//     },
//   );

//   // const { mutateAsync } = useMutation({
//   //   mutationFn: async ({ tokenId }: { tokenId: string }) => {
//   //     try {
//   //       await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/redis`, {
//   //         method: "PUT",
//   //         body: JSON.stringify({
//   //           flagId: tokenId,
//   //           projectId,
//   //         }),
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //       });
//   //     } catch (e) {
//   //       if (e instanceof TRPCClientError) {
//   //         throw new Error(e.message);
//   //       } else {
//   //         console.error("Unexpected error:", e);
//   //       }
//   //     }
//   //   },
//   //   onSuccess: () => {
//   //     toast.success(`Feature Updated`, {
//   //       description: "Your feature has been updated",
//   //       duration: 3000,
//   //       position: "bottom-left",
//   //       style: {
//   //         backgroundColor: "rgba(0, 255, 0, 0.2)",
//   //         borderColor: "rgba(0, 255, 0, 0.4)",
//   //         color: "white",
//   //       },
//   //       className: "border",
//   //     });
//   //   },
//   //   onError: (error: any) => {
//   //     toast.error(error.message, {
//   //       description: "Please try again",
//   //       duration: 3000,
//   //       position: "bottom-left",
//   //       style: {
//   //         backgroundColor: "rgba(255, 0, 0, 0.2)",
//   //         borderColor: "rgba(255, 0, 0, 0.4)",
//   //         color: "white",
//   //       },
//   //       className: "border-[1px]",
//   //     });
//   //   },
//   // });

//   return (
//     <div className="w-full space-y-2">
//       <h1 className="text-2xl font-semibold">Token</h1>
//       {isLoading ? (
//         <Card>
//           <CardHeader>
//             <Skeleton className="h-4 w-[250px]" />
//             <Skeleton className="h-4 w-[200px]" />
//           </CardHeader>
//           <CardContent>
//             <Skeleton className="mb-2 h-4 w-[300px]" />
//             <Skeleton className="mb-2 h-4 w-[250px]" />
//             <Skeleton className="h-4 w-[200px]" />
//           </CardContent>
//         </Card>
//       ) : data ? (
//         <div className="flex w-full flex-col gap-4">
//           <div className="flex flex-1 items-start justify-start gap-4"></div>
//           <API tokenId={data.id} projectId={projectId} />
//           <TokenAPIKey projectId={projectId} />
//         </div>
//       ) : (
//         <Card>
//           <CardContent>
//             <p className="py-4 text-center">No token data found.</p>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

// function API({ tokenId, projectId }: { tokenId: string; projectId: string }) {
//   const [copied, setCopied] = useState(false);
//   const [featureEnabled, setFeatureEnabled] = useState(false);

//   // Example feature flag check
//   // useEffect(() => {
//   //   const checkFeatureFlag = async () => {
//   //     try {
//   //       const response = await fetch("https://api.togl.io/v1/flags/check", {
//   //         headers: {
//   //           Authorization: "Bearer cm3b9379n000d7hbh5ewt5a5x",
//   //           "Project-ID": "cm3b92shf00097hbhb1pwhumr",
//   //         },
//   //       });
//   //       const data = await response.json();
//   //       setFeatureEnabled(data.enabled);
//   //     } catch (error) {
//   //       console.error("Error checking feature flag:", error);
//   //     }
//   //   };

//   //   checkFeatureFlag();
//   // }, []);

//   const reactCode = `
// import { useEffect, useState } from 'react'

// function MyFeature() {
//   const [isEnabled, setIsEnabled] = useState(false)

//   useEffect(() => {
//     const checkFeatureFlag = async () => {
//       const response = await fetch(${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/token/${tokenId}, {
//         headers: {
//           'Authorization': 'Bearer <API_KEY>',
//           'Project-ID': ${projectId}
//         }
//       })
//       const data = await response.json()
//       setIsEnabled(data.enabled)
//     }

//     checkFeatureFlag()
//   }, [])

//   return isEnabled ? <NewFeature /> : <OldFeature />
// }`;

//   const handleCopy = (code: string) => {
//     navigator.clipboard.writeText(code);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <Card className="h-full w-full max-w-4xl">
//       <CardContent>
//         <Card className="">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-1">
//             <CardTitle className="text-sm font-medium">
//               React Implementation
//             </CardTitle>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => handleCopy(reactCode)}
//             >
//               {copied ? (
//                 <Check className="h-4 w-4" />
//               ) : (
//                 <Copy className="h-4 w-4" />
//               )}
//             </Button>
//           </CardHeader>

//           <pre className="overflow-x-scroll rounded-lg bg-muted p-4">
//             <code className="text-sm">{reactCode}</code>
//           </pre>
//         </Card>

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold">Live Example</h3>
//           <div className="mt-4 rounded-lg border p-4">
//             <div className="flex items-center gap-4">
//               <Terminal className="h-6 w-6" />
//               <div>
//                 <p className="font-medium">Feature Status</p>
//                 <p className="text-sm text-muted-foreground">
//                   {featureEnabled
//                     ? "Feature is enabled"
//                     : "Feature is disabled"}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useProject } from "@/hook/useProject";
import { useWorkspace } from "@/hook/useWorkspace";
import { trpc } from "@/trpc/client";
import { Check, Copy, Terminal } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

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
  const { data, isLoading, refetch } = trpc.token.getTokenById.useQuery(
    { tokenId, workspaceId },
    { enabled: !!workspaceId && !!tokenId && !!projectId },
  );

  const updateTokenMutation = trpc.token.toggle.useMutation();

  // const handleToggle = async (checked: boolean) => {

  //   const loadingToast = toast.loading("Setting it up...");
  //   const loadingToastTwo = toast.loading("Applying it globally...");

  //   if (data) {
  //     try {
  //       await updateTokenMutation.mutateAsync({
  //         tokenId: data.id,
  //       });
  //       refetch();
  //     } catch (error) {
  //       console.error("Failed to update token:", error);
  //     }
  //   }
  // };

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
    <div className="flex min-h-screen flex-col space-y-4 bg-background p-4">
      <h1 className="text-2xl font-semibold">Token</h1>
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
          <API tokenId={data.id} featureEnabled={data.isEnabled} />
        </div>
      ) : (
        <Card>
          <CardContent>
            <p className="py-4 text-center">No token data found.</p>
          </CardContent>
        </Card>
      )}
    </div>

    // return (
    //   <div className="flex min-h-screen flex-col space-y-2 bg-background">
    //     <h1 className="text-2xl font-semibold">Token</h1>
    //     {isLoading ? (
    //       <TokenSkeleton />
    //     ) : data ? (
    //       <div className="space-y-6">
    //         <API tokenId={data.id} projectId={projectId} />
    //       </div>
    //     ) : (
    //       <Card>
    //         <CardContent>
    //           <p className="py-4 text-center">No token data found.</p>
    //         </CardContent>
    //       </Card>
    //     )}
    //   </div>
    // );
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

function API({
  tokenId,
  featureEnabled,
}: {
  tokenId: string;
  featureEnabled: boolean;
}) {
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
          <div className="flex items-center justify-between p-4">
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
        <div className="max-h-[500px] overflow-auto bg-card">
          <pre className="bg-background p-4">
            <code className="text-sm text-foreground">{reactCode}</code>
          </pre>
        </div>
        <div className="border-t border-border p-4">
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
        </div>
      </CardContent>
    </Card>
  );
}
