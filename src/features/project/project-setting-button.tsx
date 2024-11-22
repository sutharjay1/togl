"use client";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ProjectSettingButton = () => {
  const pathname = usePathname();

  return (
    <Button size="icon" variant="outline" asChild>
      <Link href={`/projects/${pathname.split("/")[3]}/settings/general`}>
        <Settings />
      </Link>
    </Button>
  );
};
