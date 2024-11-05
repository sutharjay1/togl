import Container from "@/app/(main)/_components/container";

export default function Tokens() {
  return (
    <Container showItems={true}>
      <div className="container mx-auto flex flex-col gap-4 p-6">
        <div className="w-64 space-y-1">
          <h1 className="text-2xl font-semibold">Tokens</h1>
          <p className="text-sm text-muted-foreground">
            View and manage project tokens
          </p>
        </div>
        <main className="flex-1"></main>
      </div>
    </Container>
  );
}
