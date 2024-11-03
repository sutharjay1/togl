import { appRouter } from "@/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { NextResponse } from "next/server";

const handler = async (req: Request) => {
  console.log("tRPC request received:", req.url);

  try {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: () => ({}),
    });
    console.log("tRPC response:", response.status);
    return response;
  } catch (error) {
    console.error("tRPC error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export { handler as GET, handler as POST };
