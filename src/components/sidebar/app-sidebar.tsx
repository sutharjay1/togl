"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useProject } from "@/features/project/hooks/useProject";
import { ProjectDropDown } from "@/features/project/project-dropdown";
import { FlagIcon, Home, Users } from "lucide-react";
import Link from "next/link";
import UserDropdownMenu from "../../features/_global/user-avatar";

export function AppSidebar() {
  const { projectId } = useProject();

  const items = [
    {
      title: "Togl",
      url: "#",
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: Home,
          match: (path: string) => path === "/dashboard",
        },
      ],
    },
    {
      title: "Release",
      url: "#",
      isActive: true,
      items: [
        {
          title: "Flags",
          url: `/projects/${projectId}/flags`,
          icon: FlagIcon,
          match: (path: string) => path.startsWith("/projects/flags"),
        },
        {
          title: "Team",
          url: `/projects/${projectId}/team`,
          icon: Users,
          match: (path: string) => path.startsWith("/team"),
        },
        {
          title: "Settings",
          url: `/projects/${projectId}/settings/general`,
          icon: Users,
          match: (path: string) => path.startsWith("/team"),
        },
      ],
    },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <ProjectDropDown />
        <div className="px-2 py-2">
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="font-medium">
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub className="ml-2 border-l-0 px-1.5">
                      {item.items.map((item) => (
                        <SidebarMenuSubItem key={item.title}>
                          <SidebarMenuSubButton asChild>
                            <Link href={item.url}>{item.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </div>
        <div className="mt-auto px-3 py-2">
          <UserDropdownMenu />
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
