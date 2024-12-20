"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Container from "@/features/project/container";
import { trpc } from "@/trpc/client";

export default function Members() {
  const { data, isLoading } = trpc.project.getProjects.useQuery();

  return (
    <Container showItems={true}>
      <div className="mx-auto flex flex-col gap-4 px-3 py-6 md:px-0">
        <div className="w-64 space-y-1">
          <h1 className="text-2xl font-semibold">Members</h1>
          <p className="text-sm text-muted-foreground">
            View and manage project members
          </p>
        </div>
        <main className="flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
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
              {!isLoading && (!data || data.length === 0) && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No members found.
                  </TableCell>
                </TableRow>
              )}
              {/* {!isLoading &&
                data &&
                data.map((member: Member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage
                          src={member.user.avatar || undefined}
                          alt={member.user.name}
                        />
                        <AvatarFallback>
                          {member.user.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {member.user.name}
                    </TableCell>
                    <TableCell>{member.user.email}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell className="text-right">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))} */}
            </TableBody>
          </Table>
        </main>
      </div>
    </Container>
  );
}
