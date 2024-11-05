import Container from "@/app/(main)/_components/container";
import { buttonVariants } from "@/components/ui/button";
import { useProject } from "@/hook/useProject";
import { useWorkspace } from "@/hook/useWorkspace";
import { cn } from "@/lib/utils";
import { AppWindowIcon, CircleIcon, GitBranchIcon } from "lucide-react";
import Link from "next/link";

interface SettingsLayoutProps {
  children: React.ReactNode;
  pathname: string;
}

const SettingsLayout = ({ children, pathname }: SettingsLayoutProps) => {
  const { workspaceId } = useWorkspace();
  const { projectId } = useProject();

  const tabs = [
    {
      title: "General",
      href: `/dashboard/${workspaceId}/projects/${projectId}/settings/general`,
      icon: CircleIcon,
    },
    {
      title: "Git",
      href: `/dashboard/${workspaceId}/projects/${projectId}/settings/git`,
      icon: GitBranchIcon,
    },
    {
      title: "Integrations",
      href: `/dashboard/${workspaceId}/projects/${projectId}/settings/integrations`,
      icon: AppWindowIcon,
      disabled: true,
      soon: true,
    },
  ];

  return (
    <Container showItems={true}>
      <div className="container mx-auto flex gap-8 p-6">
        <aside className="w-64 space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-muted-foreground">
              Customize your project settings.
            </p>
          </div>
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.href}
                  href={tab.disabled ? "#" : tab.href}
                  className={cn(
                    buttonVariants({
                      variant: pathname === tab.href ? "shine" : "ghost",
                    }),
                    "justify-start",
                    tab.disabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.title}
                  {tab.soon && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      Soon
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </Container>
  );
};

export default SettingsLayout;
