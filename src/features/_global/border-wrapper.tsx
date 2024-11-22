import React from "react";
import { Plus } from "lucide-react";

interface BorderComponentProps {
  children: React.ReactNode;
  className?: string;
  cornerIcon?: React.ReactNode;
}

export default function BorderWrapper({
  children,
  className = "",
  cornerIcon = <Plus className="h-5 w-5" />,
}: BorderComponentProps) {
  return (
    <div className={`container mx-auto w-full max-w-5xl ${className}`}>
      <div className="z-10 mt-5 border">
        <div
          className="relative mx-auto py-14 text-center text-3xl font-bold"
          style={{
            backgroundImage:
              "radial-gradient(circle at bottom center, hsl(var(--secondary)), hsl(var(--background)))",
          }}
        >
          <div
            className="absolute -left-0 -top-0 h-5 w-5"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            {cornerIcon}
          </div>
          <div
            className="absolute -bottom-5 -right-5 h-5 w-5"
            style={{ transform: "translate(-50%, -50%)" }}
          >
            {cornerIcon}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
