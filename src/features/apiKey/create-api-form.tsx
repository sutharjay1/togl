import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

import { trpc } from "@/trpc/client";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { generateSlug } from "random-word-slugs";
import { toast } from "sonner";

const APIKeySchema = z.object({
  name: z.string().min(1, "API Key name is required"),
  projectId: z.array(z.object({ id: z.string(), name: z.string() })),
});

const CreateAPIKeyForm = () => {
  const router = useRouter();

  const { data: projects, isLoading: isLoadingProjects } =
    trpc.project.getProjects.useQuery();

  const { mutateAsync: createAPIKey, isLoading: pending } =
    trpc.apiKey.create.useMutation<{ id: string; name: string }>({
      onSuccess: (data) => {
        if (data) {
          toast.success("API Key Created", {
            description: "Your API key has been created",
            duration: 3000,
            position: "bottom-left",
            style: {
              backgroundColor: "rgba(0, 255, 0, 0.2)",
              borderColor: "rgba(0, 255, 0, 0.4)",
              color: "white",
            },
            className: "border",
          });

          router.refresh();
        }
      },
    });

  const form = useForm<z.infer<typeof APIKeySchema>>({
    mode: "onChange",
    resolver: zodResolver(APIKeySchema),
    defaultValues: {
      name: generateSlug(2),
      projectId: projects?.map((project) => {
        return {
          id: project.id,
          name: project.name,
        };
      }),
    },
  });

  const handleSubmit = async (values: z.infer<typeof APIKeySchema>) => {
    try {
      await createAPIKey({
        name: values.name,
        projectId: values.projectId[0].id,
      });
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
              <FormLabel className=" ">API Key Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="API Key Name"
                  disabled={pending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="projectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project ID</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={projects?.[0]?.id}
                  disabled={pending}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingProjects && <span>Loading...</span>}
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              "Create API Key"
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

export default CreateAPIKeyForm;
