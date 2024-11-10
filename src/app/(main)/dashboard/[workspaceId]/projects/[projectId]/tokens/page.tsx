"use client";

import CreateTokenForm from "@/components/form/create-token";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { H3, P } from "@/components/ui/typography";
import { useProject } from "@/hook/useProject";
import { useWorkspace } from "@/hook/useWorkspace";
import { trpc } from "@/trpc/client";
import { Loader2, Plus, ToggleRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function Tokens() {
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

  const router = useRouter();

  useEffect(() => {
    if (!data?.[0]?.id) return;
    router.push(
      `/dashboard/${workspaceId}/projects/${projectId}/tokens/${data?.[0]?.id}`,
    );
  }, [data, router, workspaceId, projectId]);

  return (
    <Suspense fallback={<Loader2 className="animate-spin" />}>
      <div className="mx-auto flex h-screen w-full flex-col items-center justify-start md:px-2">
        {!data?.[0] && (
          <Card className="w-full rounded-xl">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center px-6 py-3 text-center">
                <div className="mb-4 rounded-full bg-primary/5 p-3 backdrop-blur-xl">
                  <ToggleRight className="h-6 w-6 text-primary" />
                </div>
                <H3 className="">Start a New Token</H3>
                <P className="mb-4 text-sm text-muted-foreground [&:not(:first-child)]:mt-1">
                  You haven&apos;t created any tokens yet
                </P>
                <Modal>
                  <ModalTrigger asChild className="mb-2">
                    <Button variant="shine" className="h-9 py-1">
                      <Plus className="mr-2 h-4 w-4" /> New Token
                    </Button>
                  </ModalTrigger>
                  <ModalContent>
                    <ModalHeader>
                      <ModalTitle className="text-left">
                        Create new project
                      </ModalTitle>
                      <ModalDescription className="text-left">
                        Create a new project to get started
                      </ModalDescription>
                    </ModalHeader>

                    <CreateTokenForm />
                  </ModalContent>
                </Modal>{" "}
              </div>
            </CardContent>
          </Card>
        )}
        {isLoading ? <Loader2 className="animate-spin" /> : null}
      </div>
    </Suspense>
  );
}
