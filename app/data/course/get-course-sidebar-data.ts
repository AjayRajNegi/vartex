import "server-only";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireUser } from "../user/require-user";

export async function getCoursesSidebarData({ slug }: { slug: string }) {
  const session = await requireUser();

  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      fileKey: true,
      duration: true,
      level: true,
      category: true,
      slug: true,
      chapter: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              lessonProgress: {
                where: {
                  userId: session.id,
                },
                select: {
                  completed: true,
                  lessonId: true,
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  const enrollment = await prisma.payment.findFirst({
    where: {
      userId: session.id,
      courseId: course.id,
      status: "SUCCESS",
    },
  });

  if (!enrollment || enrollment.status !== "SUCCESS") {
    return notFound();
  }

  return { course };
}

export type CourseSidebarDataType = Awaited<
  ReturnType<typeof getCoursesSidebarData>
>;
