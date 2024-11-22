"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { H4 } from "@/components/ui/typography";
import { useProject } from "@/features/project/hooks/useProject";

import { trpc } from "@/trpc/client";

export default function Members() {
  const { projectId } = useProject();
  const { data, isLoading } = trpc.project.getProjectMembers.useQuery({
    projectId,
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center space-y-2 pb-2">
      <H4 className="flex w-full items-center justify-start">Flags</H4>
      <main className="w-full flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>

              <TableHead className="text-right">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex flex-col space-y-2">
                      <Skeleton className="h-4 w-[95%]" />
                      <Skeleton className="h-4 w-[95%]" />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && (!data || data?.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No members found.
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              data &&
              data?.map((member: any) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage
                        src={member?.avatar || ""}
                        alt={member?.name}
                      />
                      <AvatarFallback>
                        {member?.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{member?.name}</TableCell>
                  <TableCell>{member?.email}</TableCell>

                  <TableCell className="text-right">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
