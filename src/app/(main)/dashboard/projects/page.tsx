import { Card, CardContent } from "@/components/ui/card";
import { H3, P } from "@/components/ui/typography";
import { ToggleRight } from "lucide-react";
import Container from "../../_components/container";
import CreateProject from "../../_components/create-project";

export default function Dashboard() {
  return (
    <Container>
      <Card className="rounded-xl">
        <CardContent>
          <div className="flex flex-col items-center justify-center bg-card p-6 text-center">
            <div className="mb-4 rounded-full bg-primary/5 p-3 backdrop-blur-xl">
              <ToggleRight className="h-6 w-6 text-primary" />
            </div>
            <H3 className="">Start a New Project</H3>
            <P className="mb-4 text-sm text-muted-foreground [&:not(:first-child)]:mt-1">
              You haven&apos;t created any projects yet
            </P>

            <CreateProject />
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
