import { NextResponse } from "next/server";
import s3Client from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "nodejs";
const BUCKET = process.env.S3_BUCKET_NAME;

export async function POST(request: Request) {
  try {
    const { contentType, fileName } = await request.json();

    if (!contentType || !fileName) {
      return NextResponse.json(
        { error: "Missing contentType or fileName" },
        { status: 400 },
      );
    }

    // Generate a unique key for the file
    // Structure: uploads/{uuid}-{filename}
    // Sanitize filename to avoid weird character issues
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `uploads/${crypto.randomUUID()}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
      // ACL: "public-read", // Optional: depending on bucket settings
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({ 
        url, 
        key: `s3://${key}`, // Return s3:// protocol format for our app
        publicUrl: `https://${BUCKET}.s3.amazonaws.com/${key}` // Approximate public URL (might need region adjustment)
    });
  } catch (error: any) {
    console.error("Error generating presigned upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
