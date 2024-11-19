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
import { FlagIcon, Home, Settings, Users } from "lucide-react";
import Link from "next/link";
import Logo from "../global/logo";
import UserDropdownMenu from "../global/user-avatar";

export function AppSidebar() {
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
          url: "/projects/flags",
          icon: FlagIcon,
          match: (path: string) => path.startsWith("/projects/flags"),
        },
        {
          title: "Team",
          url: "/team/general",
          icon: Users,
          match: (path: string) => path.startsWith("/team"),
        },
      ],
    },
    {
      title: "Release",
      url: "#",
      isActive: true,
      items: [
        {
          title: "Settings",
          url: "/settings/general",
          icon: Settings,
          match: (path: string) => path.startsWith("/settings"),
        },
      ],
    },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <div className="px-3 py-2">
          <Logo />
        </div>
        <div className="px-3 py-2">
          {/* <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-y-1.5">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "w-full justify-start gap-3 bg-primary px-4 py-2 text-sm font-medium",
                        item.match(pathname)
                          ? "bg-primary/85 text-background shadow-xl shadow-zinc-400/5 hover:bg-primary/90 hover:text-background/90"
                          : "bg-transparent text-primary/50 hover:text-primary/60",
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span className="text-base font-normal">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> */}
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item) => (
                // <Collapsible
                //   key={item.title}
                //   defaultOpen={index === 1}
                //   className="group/collapsible"
                // >
                //   <SidebarMenuItem>
                //     <CollapsibleTrigger asChild>
                //       <SidebarMenuButton>
                //         {item.title}
                //         <ChevronRight className="ml-auto group-data-[state=open]/collapsible:hidden" />
                //         <ChevronDown className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                //       </SidebarMenuButton>
                //     </CollapsibleTrigger>
                //     {item.items?.length ? (
                //       <CollapsibleContent>
                //         <SidebarMenuSub>
                //           {item.items.map((item) => (
                //             <SidebarMenuSubItem key={item.title}>
                //               <SidebarMenuSubButton asChild>
                //                 <Link href={item.url}>
                //                   <span className="text-base font-normal">
                //                     {item.title}
                //                   </span>
                //                 </Link>
                //               </SidebarMenuSubButton>
                //             </SidebarMenuSubItem>
                //           ))}
                //         </SidebarMenuSub>
                //       </CollapsibleContent>
                //     ) : null}
                //   </SidebarMenuItem>
                // </Collapsible>
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="font-medium">
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
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
