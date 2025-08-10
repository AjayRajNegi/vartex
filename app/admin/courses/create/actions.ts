"use server";

import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { request } from "@arcjet/next";
import { ApiResponse } from "@/lib/types";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchema";

const aj = arcjet.withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }));

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

    const data = await stripe.products.create({
      name: validation.data.title,
      description: validation.data.description,
      default_price_data: {
        currency: "inr",
        unit_amount: validation.data.price * 100,
      },
    });

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session?.user.id as string,
        stripePriceId: data.default_price as string,
      },
    });
    return {
      status: "success",
      message: "Course created successfully.",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create course.",
    };
  }
}
