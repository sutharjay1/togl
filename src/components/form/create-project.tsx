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
import { generateSlug } from "random-word-slugs";
import { trpc } from "@/trpc/client";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProjectSchema as ProjectSchema } from "@/trpc/api/project";

const CreateProjectForm = ({
  setIsUpdated,
}: {
  setIsUpdated: (value: boolean) => void;
}) => {
  const router = useRouter();

  const { mutateAsync: createProject, isLoading: pending } =
    trpc.project.create.useMutation({
      onSuccess: (data) => {
        if (data) {
          toast.success("Project Created", {
            description: "Your project has been created",
            duration: 3000,
            position: "bottom-left",
            style: {
              backgroundColor: "rgba(0, 255, 0, 0.2)",
              borderColor: "rgba(0, 255, 0, 0.4)",
              color: "white",
            },
            className: "border",
          });

          setIsUpdated(true);

          router.push(`/projects/flags`);
        }
      },
    });

  const handleCreateProject = async (name: string) => {
    const loadId = toast.loading("Creating project...", {
      duration: 3000,
      position: "bottom-left",
    });

    try {
      await createProject({ name, description: "" });
    } catch (error) {
      if (error instanceof TRPCClientError) {
        toast.error(error.message, {
          description:
            error.message === "Project already exists in this workspace"
              ? "Change the project name and try again."
              : "Please try again",
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
    } finally {
      toast.dismiss(loadId);
    }
  };

  const form = useForm<z.infer<typeof ProjectSchema>>({
    mode: "onChange",
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      name: generateSlug(2),
      description: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof ProjectSchema>) => {
    await handleCreateProject(values.name);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="z-50 flex flex-col gap-6"
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
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
          <Button
            type="button"
            className="order-1 w-full sm:order-2 md:w-min md:self-center"
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
