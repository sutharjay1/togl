"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useProject } from "@/hook/useProject";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

const tokenSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  description: z.string().optional(),
  isEnabled: z.boolean().default(false),
  rules: z.string().optional(),
  projectId: z.string().optional(),
});

type TokenFormValues = z.infer<typeof tokenSchema>;

const CreateTokenForm = () => {
  const { projectId } = useProject();

  const { mutateAsync, isLoading } = trpc.token.create.useMutation({
    onSuccess: () => {
      toast.success("Token created successfully", {
        description: "Your token has been created",
        duration: 3000,
        position: "bottom-left",
        style: {
          backgroundColor: "rgba(0, 255, 0, 0.2)",
          borderColor: "rgba(0, 255, 0, 0.4)",
          color: "white",
        },
        className: "border",
      });
      form.reset();
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

  const form = useForm<TokenFormValues>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      isEnabled: false,
      rules: "",
      projectId: projectId,
    },
  });

  const handleSubmit = async (data: TokenFormValues) => {
    await mutateAsync({
      name: data.name,
      description: data.description ? data.description : "",
      isEnabled: data.isEnabled,
      rules: data.rules,
      projectId: projectId,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter token name" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter token description" {...field} />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isEnabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Enabled</FormLabel>
                <FormDescription>Enable or disable this token</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rules"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rules (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter JSON rules"
                  className="font-mono"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Enter the rules for this token in JSON format
              </FormDescription>
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
                <Input readOnly {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Token
        </Button>
      </form>
    </Form>
  );
};

export default CreateTokenForm;
