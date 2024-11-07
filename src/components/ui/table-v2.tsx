import React from "react";
import { cn } from "@/lib/utils";

interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<{ [key: string]: string | number }>;
  columns: Array<{ key: string; header: string }>;
}

export default function Table({
  data,
  columns,
  className,
  ...props
}: TableProps) {
  return (
    <div
      className={cn("w-full overflow-auto rounded-xl border", className)}
      {...props}
    >
      <div className="w-full">
        {/* Header */}
        <div className="flex border-b bg-accent/50 font-medium">
          {columns.map((column) => (
            <div
              key={column.key}
              className="h-12 flex-1 px-4 py-2 text-left text-sm font-medium text-muted-foreground"
            >
              {column.header}
            </div>
          ))}
        </div>

        {/* Body */}
        <div>
          {data.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex border-b transition-colors last:border-0 hover:bg-accent/50"
            >
              {columns.map((column) => (
                <div key={column.key} className="flex-1 p-4 text-sm">
                  {row[column.key]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
