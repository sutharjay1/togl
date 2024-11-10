import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80  my-2",
        outline: "text-foreground",
        success:
          "border-transparent bg-teal-500 text-zinc-50 hover:bg-teal-600 my-2",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        info: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        purple:
          "border-transparent bg-purple-500 text-white hover:bg-purple-600",
        pink: "border-transparent bg-pink-500 text-white hover:bg-pink-600",
        gradient:
          "border-transparent bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600",
      },
      size: {
        default: "text-xs px-2.5 py-0.5",
        sm: "text-[10px] px-2 py-0.5",
        lg: "text-sm px-3 py-1",
      },
      rounded: {
        default: "rounded-full",
        sm: "rounded-md",
        lg: "rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, rounded, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size, rounded }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
