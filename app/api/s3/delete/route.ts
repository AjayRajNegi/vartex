import { S3 } from "@/lib/s3Client";
import { NextResponse } from "next/server";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { requireAdmin } from "@/app/data/admin/require-admin";

const aj = arcjet.withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }));

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  try {
    const decision = await aj.protect(request, {
      fingerprint: session?.user.id as string,
    });
    if (decision.isDenied()) {
      return NextResponse.json({ error: "Errrrrrrrrrrrr" }, { status: 429 });
    }
    const body = await request.json();
    const key = body.key;

    if (!key) {
      return NextResponse.json(
        { message: "Missing key or invalid object." },
        { status: 400 }
      );
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_IMAGES,
      Key: key,
    });

    await S3.send(command);

    return NextResponse.json(
      { message: "File deleted successfully." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Missing key or invalid object." },
      { status: 500 }
    );
  }
}
