import { NextResponse } from "next/server";
import { Types } from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db/client";
import { SavedRepo } from "@/lib/db/models/SavedRepo";
import { parseRepoInput } from "@/lib/validators";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const repos = await SavedRepo.find({ userId: session.user.id })
    .sort({ savedAt: -1 })
    .lean();

  return NextResponse.json({
    repos: repos.map((r) => ({
      _id: r._id.toString(),
      owner: r.owner,
      repo: r.repo,
      savedAt: r.savedAt,
    })),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { input?: string; owner?: string; repo?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed =
    body.input ? parseRepoInput(body.input) : null;
  const owner = (parsed?.owner ?? body.owner ?? "").trim();
  const repo = (parsed?.repo ?? body.repo ?? "").trim();

  if (!owner || !repo) {
    return NextResponse.json(
      { error: "Provide a repo as 'owner/repo' or a github.com URL" },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const saved = await SavedRepo.create({
      userId: new Types.ObjectId(session.user.id),
      owner,
      repo,
    });

    return NextResponse.json(
      {
        repo: {
          _id: saved._id.toString(),
          owner: saved.owner,
          repo: saved.repo,
          savedAt: saved.savedAt,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    // Duplicate (unique index on userId+owner+repo) — idempotent success
    if (
      err &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: number }).code === 11000
    ) {
      const existing = await SavedRepo.findOne({
        userId: session.user.id,
        owner,
        repo,
      }).lean();
      return NextResponse.json(
        {
          repo: existing && {
            _id: existing._id.toString(),
            owner: existing.owner,
            repo: existing.repo,
            savedAt: existing.savedAt,
          },
        },
        { status: 200 }
      );
    }
    return NextResponse.json({ error: "Failed to save repo" }, { status: 500 });
  }
}
