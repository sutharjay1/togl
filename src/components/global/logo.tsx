"use client";

import { useUser } from "@/hook/useUser";
import { useWorkspace } from "@/hook/useWorkspace";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

type Props = {
  text?: string;
};

const Logo = ({ text }: Props) => {
  const { user } = useUser();
  const { workspaceId } = useWorkspace();
  const { theme } = useTheme();
  return (
    <Link
      href={user ? `/dashboard/${workspaceId}/projects` : "/"}
      className="relative flex items-center"
    >
      <div
        className={cn(
          "relative flex h-8 w-fit items-center justify-center rounded-md",
          // 'bg-primary/10'
        )}
      >
        <span className={cn("px-2 text-lg font-bold", text)}>Togl</span>
        <Image
          src={
            theme === "light"
              ? "https://res.cloudinary.com/sutharjay/image/upload/v1731225429/togl/togl-dark.svg"
              : "https://res.cloudinary.com/sutharjay/image/upload/v1731225430/togl/togl-light.svg"
          }
          alt="logo"
          className={cn("mx-auto")}
          width={25}
          height={25}
        />
      </div>
    </Link>
  );
};

export default Logo;
