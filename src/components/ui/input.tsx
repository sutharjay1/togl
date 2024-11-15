import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "relative flex h-10 w-full select-none appearance-none rounded-xl px-3 py-2 text-sm",
          "outline-none transition-all duration-200 ease-in-out",

          "text-text bg-neutral-300/50",
          "placeholder:text-textSecondary/80",
          "border-text/15 border",
          "focus:ring-3 focus:border-2 focus:border-ring/15 focus:ring-accent",

          "dark:placeholder:text-textSecondary/80",
          "focus:border focus:dark:border-2 focus:dark:border-ring focus:dark:ring-accent",
          "dark:focus:ring-3 dark:focus:border-neutral-900/75 dark:focus:ring-accent",
          "flex w-full items-center justify-start bg-slate-200/5 hover:text-accent-foreground",

          "file:border-0 file:bg-transparent file:text-sm file:font-medium",

          "disabled:cursor-not-allowed disabled:opacity-50",
          "font-geistSans text-base font-medium",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
