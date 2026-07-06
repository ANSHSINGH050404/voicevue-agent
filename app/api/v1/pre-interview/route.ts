import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { extractGitHubUsername, fetchGitHubData } from "@/lib/github";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { github } = body as { github: string };

  if (!github || typeof github !== "string") {
    return Response.json({ error: "GitHub URL is required" }, { status: 400 });
  }

  const username = extractGitHubUsername(github);
  if (!username) {
    return Response.json({ error: "Invalid GitHub URL" }, { status: 400 });
  }

  const interview = await prisma.interview.create({
    data: {
      githubUrl: github.trim(),
      status: "fetching_repos",
    },
  });

  const githubData = await fetchGitHubData(username);

  const updated = await prisma.interview.update({
    where: { id: interview.id },
    data: {
      githubData: githubData ? JSON.parse(JSON.stringify(githubData)) : undefined,
      status: githubData ? "ready" : "pending",
    },
  });

  return Response.json({ id: updated.id });
}
