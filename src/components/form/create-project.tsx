"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { useWorkspace } from "@/hook/useWorkspace";
import { trpc } from "@/trpc/client";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  workspaceId: z.string(),
});

const CreateProjectForm = () => {
  const router = useRouter();
  const { workspaceId } = useWorkspace();

  const { mutateAsync: createProject, isLoading: pending } =
    trpc.project.create.useMutation({
      onSuccess: (data) => {
        if (data) {
          toast.success("Project Created", {
            description: "Your project has been created",
            duration: 3000,
            style: {
              backgroundColor: "rgba(0, 255, 0, 0.2)",
              borderColor: "rgba(0, 255, 0, 0.4)",
              color: "white",
            },
            className: "border",
          });

          router.push(`/dashboard/${workspaceId}/projects`);
        }
      },
    });

  const handleCreateProject = async (name: string) => {
    const loadId = toast.loading("Creating project...", {
      duration: 3000,
    });

    try {
      await createProject({ name, workspaceId, description: "" });
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message, {
          description: "Please try again",
          duration: 3000,
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            borderColor: "rgba(255, 0, 0, 0.4)",
            color: "white",
          },
          className: "border",
        });
      } else {
        toast.error("Unexpected Error", {
          description: "Something went wrong. Please try again.",
          duration: 3000,
          style: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
            borderColor: "rgba(255, 0, 0, 0.4)",
            color: "white",
          },
          className: "border",
        });
      }
    } finally {
      toast.dismiss(loadId);
    }
  };

  const form = useForm<z.infer<typeof ProjectSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      workspaceId,
    },
  });

  const handleSubmit = async (values: z.infer<typeof ProjectSchema>) => {
    await handleCreateProject(values.name);
  };

  return (
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
              <FormLabel className=" ">Project Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Project Name"
                  disabled={pending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-1 gap-x-2 sm:flex-row sm:gap-x-2 sm:space-y-0 md:justify-end">
          <Button
            variant="shine"
            className="order-2 w-full sm:order-1 md:w-min md:self-center"
            type="submit"
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving
              </>
            ) : (
              "Create Project"
            )}
          </Button>
          <Button
            type="button"
            className="order-1 h-11 w-full sm:order-2 md:w-min md:self-center"
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateProjectForm;
