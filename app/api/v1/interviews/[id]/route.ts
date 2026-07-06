import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const interview = await prisma.interview.findUnique({
    where: { id },
    include: {
      questions: { orderBy: { createdAt: "asc" } },
      evaluation: true,
    },
  });

  if (!interview) {
    return Response.json({ error: "Interview not found" }, { status: 404 });
  }

  return Response.json({ interview });
}
