import { NextResponse } from "next/server";
import { z } from "zod";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "Filename is required," }),
  contentType: z.string().min(1, { message: "ContentType is required." }),
  size: z.string().min(1, { message: "Size is required." }),
  isImage: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = fileUploadSchema.safeParse(body);
    if (!validation) {
      return NextResponse.json(
        { error: "Invalid Request Body" },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = validation.data;
  } catch (error) {}
}
