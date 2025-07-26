"use server";

import { prisma } from "@/lib/db";
import { request } from "@arcjet/next";
import { ApiResponse } from "@/lib/types";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";

const aj = arcjet
  .withRule(detectBot({ mode: "LIVE", allow: [] }))
  .withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }));

export async function CreateCourse(
  values: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Errrrrr",
      };
    }
    const validation = courseSchema.safeParse(values);
    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    const data = await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
      },
    });
    return {
      status: "success",
      message: "Course created successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create course.",
    };
  }
}
