import { z } from "zod";
import { S3 } from "@/lib/s3Client";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { requireAdmin } from "@/app/data/admin/require-admin";

const aj = arcjet
  .withRule(detectBot({ mode: "LIVE", allow: [] }))
  .withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }));

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "Filename is required," }),
  contentType: z.string().min(1, { message: "ContentType is required." }),
  size: z.number().min(1, { message: "Size is required." }),
  isImage: z.boolean(),
});

export async function POST(request: Request) {
  const session = await requireAdmin();
  try {
    const decision = await aj.protect(request, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied()) {
      return NextResponse.json({ error: "Errrrrrrrrrrrr" }, { status: 429 });
    }
    const body = await request.json();

    const validation = fileUploadSchema.safeParse(body);
    console.log(validation);
    console.log(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Request Body" },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = validation.data;

    const uniqueKey = `${uuidv4()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_IMAGES,
      ContentType: contentType,
      ContentLength: size,
      Key: uniqueKey,
    });

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360,
    });

    const response = {
      presignedUrl,
      key: uniqueKey,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.log(error, "server error");
    NextResponse.json(
      { error: "Failed to generate presigned URL." },
      { status: 500 }
    );
  }
}
