import { NextResponse } from "next/server";
import s3Client from "@/lib/s3Client";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "nodejs";
const BUCKET = process.env.S3_BUCKET_NAME;
const PRESIGN_EXPIRES = 60 * 15;

export async function GET(request: Request) {
  try {
    const urlObj = new URL(request.url);
    const key = urlObj.searchParams.get("key");
    if (!key) {
      return NextResponse.json(
        { error: "Missing key query parameter" },
        { status: 400 },
      );
    }

    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const url = await getSignedUrl(s3Client, cmd, {
      expiresIn: PRESIGN_EXPIRES,
    });

    return NextResponse.json({ key, url });
  } catch (error: any) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 },
    );
  }
}
