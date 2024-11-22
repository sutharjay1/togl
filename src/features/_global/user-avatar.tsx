import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";

import { cn } from "@/lib/utils";
import { LogOut, Monitor, Moon, Plus, Settings, Sun } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { P } from "../../components/ui/typography";
import Hint from "./hint";
import { useTheme } from "next-themes";

const UserDropdownMenu = ({
  className,
  variant = "gooeyRight",
}: {
  className?: string;
  variant?: "gooeyRight" | "gooeyLeft";
}) => {
  const { user } = useUser();
  const { setTheme } = useTheme();
  const handleLogout = () => {
    signOut({
      callbackUrl: "/",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          className={cn(
            "flex w-fit items-center gap-3 bg-transparent p-0 px-1 py-2 md:w-full md:px-3",
            className,
          )}
        >
          <Avatar className="h-8 w-8 md:h-7 md:w-7">
            {user?.image ? (
              <AvatarImage src={user?.image} />
            ) : (
              <AvatarFallback className="bg-gradient-to-tl from-[#2BC0E4] to-[#EAECC6] text-zinc-400">
                {user?.name ? user?.name[0].toUpperCase() : "?"}
              </AvatarFallback>
            )}
          </Avatar>

          <Hint label={`Hello, ${user?.name}`} side="bottom">
            <div className="hidden min-w-0 flex-1 md:flex">
              <P className="truncate text-sm font-medium leading-none text-slate-200">
                {user?.email ?? "No Email"}
              </P>
            </div>
          </Hint>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 space-y-1 bg-zinc-900 p-2 text-zinc-300"
        align="end"
      >
        <div className="mb-2 px-2 py-1.5">
          <P className="text-sm font-medium leading-none">{user?.name}</P>
          <P className="text-sm leading-none text-muted-foreground [&:not(:first-child)]:mt-2">
            {user?.email}
          </P>
        </div>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem className="px-2 py-1.5 focus:bg-zinc-800 focus:text-white">
          <Link href={`/dashboard`} className="flex w-full items-center">
            <Monitor className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem className="px-2 py-1.5 focus:bg-zinc-800 focus:text-white">
          <Link href="/settings" className="flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Link>
        </DropdownMenuItem> */}

        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem
          className="cursor-pointer px-2 py-3 text-red-400 focus:bg-zinc-800 focus:text-red-400"
          onClick={handleLogout}
        >
          <div className="flex w-full items-center">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
