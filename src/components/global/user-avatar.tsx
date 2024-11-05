import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hook/useUser";
import { useWorkspace } from "@/hook/useWorkspace";
import { cn } from "@/lib/utils";
import {
  Command,
  Home,
  LogOut,
  Monitor,
  Moon,
  Plus,
  Settings,
  Sun,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { P } from "../ui/typography";
import Hint from "./hint";

const UserDropdownMenu = ({
  className,
  variant = "gooeyRight",
}: {
  className?: string;
  variant?: "gooeyRight" | "gooeyLeft";
}) => {
  const { user } = useUser();
  const { setTheme } = useTheme();
  const { workspaceId, setWorkspaceId } = useWorkspace();
  const handleLogout = () => {
    signOut({
      callbackUrl: "/",
    });
    setWorkspaceId("");
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
              <AvatarFallback className="bg-gradient-to-tl from-[#2BC0E4] to-[#EAECC6] text-zinc-900">
                {user?.name ? user?.name[0].toUpperCase() : "?"}
              </AvatarFallback>
            )}
          </Avatar>

          <Hint label={`Hello, ${user?.name}`} side="bottom">
            <div className="hidden min-w-0 flex-1 md:flex">
              <P className="truncate text-sm font-medium leading-none text-slate-900 dark:text-slate-200">
                {user?.email ?? "No Email"}
              </P>
            </div>
          </Hint>
        </Button>
      </DropdownMenuTrigger>

      {/* <DropdownMenuContent className="mb-2 ml-4 w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <P className="text-sm font-medium leading-none">{user?.name}</P>
            <P className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </P>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <div className="flex w-full items-center">
            <BrushIcon className="mr-2 h-4 w-4" />
            <P className="text-sm [&:not(:first-child)]:mt-0">Toggle Theme</P>
          </div>
        </DropdownMenuItem>
         
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent> */}
      <DropdownMenuContent
        className="w-64 space-y-1 bg-zinc-900 p-2 text-zinc-300"
        align="end"
      >
        <div className="mb-2 px-2 py-1.5">
          <P className="text-sm font-medium leading-none text-accent">
            {user?.name}
          </P>
          <P className="text-sm leading-none text-muted-foreground [&:not(:first-child)]:mt-2">
            {user?.email}
          </P>
        </div>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem className="px-2 py-1.5 focus:bg-zinc-800 focus:text-white">
          <Link
            href={`/dashboard/${workspaceId}/projects`}
            className="flex w-full items-center"
          >
            <Monitor className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-2 py-1.5 focus:bg-zinc-800 focus:text-white">
          <Link href="/settings" className="flex w-full items-center">
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-2 py-1.5 focus:bg-zinc-800 focus:text-white">
          <div className="flex w-full items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Team
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <DropdownMenuItem className="px-2 py-1.5 focus:bg-zinc-800 focus:text-white">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Command className="mr-2 h-4 w-4" />
              Command Menu
            </div>
            <span className="text-xs text-zinc-500">Ctrl K</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-2 py-1.5 focus:bg-zinc-800 focus:text-white">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center">
              <Sun className="mr-2 h-4 w-4" />
              Theme
            </div>
            <div className="flex space-x-1">
              <Button
                onClick={() => setTheme("light")}
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setTheme("dark")}
                variant="ghost"
                size="icon"
                className="h-6 w-6"
              >
                <Moon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="px-2 py-1.5 focus:bg-zinc-800 focus:text-white">
          <Link href="/home" className="flex w-full items-center">
            <Home className="mr-2 h-4 w-4" />
            Home Page
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer px-2 py-1.5 text-red-400 focus:bg-zinc-800 focus:text-red-400"
          onClick={handleLogout}
        >
          <div className="flex w-full items-center">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-zinc-800" />
        <div className="px-2 py-1.5">
          <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700">
            Upgrade to Pro
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
