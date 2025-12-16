import { NextResponse } from "next/server";
import s3Client from "@/lib/s3Client";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

const BUCKET = process.env.S3_BUCKET_NAME;

export async function GET() {
  try {
    const listCmd = new ListObjectsV2Command({ Bucket: BUCKET });
    const listResp = await s3Client.send(listCmd);
    const contents = listResp.Contents ?? [];

    // Optimize: Only return necessary metadata (Key, Size)
    // We do NOT generate signed URLs here to avoid N+1 slow operations.
    // The frontend will request a signed URL on demand for the specific file the user wants to play.
    const items = contents.map((obj) => ({
      key: obj.Key,
      size: obj.Size,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching S3 objects:", error);
    return NextResponse.json(
      { error: "Failed to fetch S3 objects" },
      { status: 500 },
    );
  }
}
