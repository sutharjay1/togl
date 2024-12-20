import { buttonVariants } from "@/components/ui/button";
import { useProject } from "@/features/project/hooks/useProject";

import { cn } from "@/lib/utils";
import { AppWindowIcon, CircleIcon, GitBranchIcon } from "lucide-react";
import Link from "next/link";
import Container from "../../../project/container";

interface SettingsLayoutProps {
  children: React.ReactNode;
  pathname?: string;
}

const SettingsLayout = ({ children, pathname }: SettingsLayoutProps) => {
  const { projectId } = useProject();

  const tabs = [
    {
      title: "General",
      href: `/projects/${projectId}/settings/general`,
      icon: CircleIcon,
    },
    {
      title: "Git",
      href: `/projects/${projectId}/settings/git`,
      icon: GitBranchIcon,
    },
    {
      title: "Integrations",
      href: `/projects/${projectId}/settings/integrations`,
      icon: AppWindowIcon,
      disabled: true,
      soon: true,
    },
  ];

  return (
    <Container showItems={true}>
      <div className="mx-auto flex gap-8 px-3 md:px-0">
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
