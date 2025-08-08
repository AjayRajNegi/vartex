import "server-only";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireAdmin } from "./require-admin";

export async function adminGetLesson(id: string) {
  await requireAdmin();

  const data = await prisma.lesson.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      position: true,
      thumbnailKey: true,
      videoKey: true,
    },
  });

  if (!data) {
    return notFound();
  }
  return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
