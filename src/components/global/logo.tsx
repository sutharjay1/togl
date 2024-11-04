"use client";

import { useUser } from "@/hook/useUser";
import { useWorkspace } from "@/hook/useWorkspace";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  text?: string;
};

const Logo = ({ text }: Props) => {
  const { user } = useUser();
  const { workspaceId } = useWorkspace();
  return (
    <Link
      href={user ? `/dashboard/${workspaceId}/projects` : "/"}
      className="relative flex items-center space-x-2"
    >
      <div
        className={cn(
          "relative flex h-8 w-fit items-center justify-center rounded-md",
          // 'bg-primary/10'
        )}
      >
        <span className={cn("px-2 text-lg font-bold", text)}>Togl</span>
      </div>
    </Link>
  );
};

export default Logo;
