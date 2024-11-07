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

import { trpc } from "@/trpc/client";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProject } from "@/hook/useProject";

const APIKeySchema = z.object({
  name: z.string().min(1, "API Key name is required"),
  projectId: z.string(),
});

const CreateAPIKeyForm = () => {
  const router = useRouter();
  const { projectId } = useProject();

  const { mutateAsync: createAPIKey, isLoading: pending } =
    trpc.apiKey.create.useMutation({
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
      name: "",
      projectId: projectId,
    },
  });

  const handleSubmit = async (values: z.infer<typeof APIKeySchema>) => {
    try {
      await createAPIKey(values);
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
              <FormLabel className=" ">Project ID</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Project ID"
                  disabled={pending}
                  readOnly
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
