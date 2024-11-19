"use client";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { H4, P } from "@/components/ui/typography";
import CreateAPIKey from "@/features/apiKey/create-api";
import { useUser } from "@/hooks/useUser";
import { updateProjectSchema } from "@/trpc/api/project";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { TRPCClientError } from "@trpc/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ProjectSettings = () => {
  const { user } = useUser();
  const router = useRouter();

  const { data, isFetching } = trpc.project.getProjectById.useQuery({
    projectId: user.projectId,
  });

  const { mutateAsync: updateProject, isLoading: isUpdating } =
    trpc.project.updateProject.useMutation({
      onSuccess: (data) => {
        if (data) {
          toast.success("Project Updated", {
            description: "Your project has been updated",
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
      },
    });

  const handleUpdateProject = async ({
    name,

    description,
    projectId,
  }: z.infer<typeof updateProjectSchema>) => {
    const loadId = toast.loading("Updating project...", {
      duration: 3000,
      position: "bottom-left",
    });

    try {
      const updatePayload = {
        name,

        projectId,
      };

      if (description) {
        (updatePayload as { description?: string }).description = description;
      }

      await updateProject(updatePayload);
    } catch (error) {
      if (error instanceof TRPCClientError) {
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
      }
    } finally {
      toast.dismiss(loadId);
    }
  };

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    mode: "onChange",
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: "",
      description: "",

      projectId: user.projectId,
    },
  });

  const handleSubmit = async (values: z.infer<typeof updateProjectSchema>) => {
    await handleUpdateProject(values);
  };

  const { mutateAsync: deleteProject, isLoading: deleteLoading } =
    trpc.project.deleteProject.useMutation({
      onSuccess: (data) => {
        if (data) {
          toast.success("Project Deleted", {
            description: "Your project has been deleted",
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
      },
      onError: (error) => {
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

  const handleDeleteProject = async () => {
    await deleteProject({ projectId: user.projectId }).then(() => {
      router.push(`/projects`);
    });
  };

  const { data: apiKeys, isLoading: apiKeysLoading } =
    trpc.apiKey.getAPIKeys.useQuery({
      projectId: user.projectId,
    });

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/projects/flag">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {/* <BreadcrumbPage>{tokenData?.name}</BreadcrumbPage> */}
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Settings</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-6">
          <H4>Generate API Key</H4>
          <CreateAPIKey />
        </div>
        <Separator className="my-4" />
        <div className="flex items-center gap-6">
          <H4>API Keys</H4>
          {apiKeysLoading ? (
            <Skeleton className="h-8 w-40" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              {apiKeys && apiKeys.apiKeys.length > 0 ? (
                apiKeys?.apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="bg-muted-200 flex items-center gap-2 rounded-md p-2"
                  >
                    <p>{key.key}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No API keys found
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <Separator className="my-4" />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">General</h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Project Name"
                      disabled={isUpdating || isFetching}
                      value={field?.value || data?.name}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="e.g. Acme UI"
                      className="min-h-[100px]"
                      disabled={isUpdating || isFetching}
                      value={field?.value || (data?.description as string)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-1 gap-x-2 sm:flex-row sm:gap-x-2 sm:space-y-0">
              <Button
                variant="shine"
                className="order-2 w-full sm:order-1 md:w-min md:self-center"
                type="submit"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Project"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Separator className="my-4" />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Permanently delete this project</h3>
            <P className="text-sm text-muted-foreground [&:not(:first-child)]:mt-0">
              Permanently remove your project and all of its contents from the
              zigma platform. This action is not reversible — please continue
              with caution.
            </P>
          </div>
          <Button variant="destructive" onClick={handleDeleteProject}>
            Delete this project
            {deleteLoading ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            ) : null}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSettings;
