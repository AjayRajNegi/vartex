import { CourseContent } from "./_components/CourseContent";
import { getLessonContent } from "@/app/data/course/get-lesson-content";

type Params = Promise<{ lessonId: string }>;

export default async function LessonContentPage({
  params,
}: {
  params: Params;
}) {
  const { lessonId } = await params;
  const data = await getLessonContent(lessonId);
  return <CourseContent data={data} />;
}
