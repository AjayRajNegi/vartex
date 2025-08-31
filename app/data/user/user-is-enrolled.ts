import "server-only";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";

export async function checkIfCourseBought(courseId: string): Promise<boolean> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return false;

  const enrollment = await prisma.payment.findFirst({
    where: {
      userId: session.session.userId,
      courseId: courseId,
      status: "SUCCESS",
    },
  });

  return enrollment?.status === "SUCCESS" ? true : false;
}
