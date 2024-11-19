"use client";

import SettingsLayout from "@/features/flags/components/settings/settings-layout";
import React from "react";

type ProjectLayoutProps = {
  children: React.ReactNode;
};

const ProjectLayout = ({ children }: ProjectLayoutProps) => {
  return <SettingsLayout>{children}</SettingsLayout>;
};

export default ProjectLayout;
