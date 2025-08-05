import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

// Asynchronous function to fetch a list of courses for admin users
export async function adminGetCourses() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  await requireAdmin();

  const data = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
    },
  });

  return data;
}

// Define a TypeScript type for a single course returned from adminGetCourses
export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>[0];
