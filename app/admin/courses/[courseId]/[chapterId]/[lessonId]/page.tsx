import { LessonForm } from "./_components/LessonForm";
import { adminGetLesson } from "@/app/data/admin/admin-get-lesson";

type Params = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;

export default async function LessonIdPage({ params }: { params: Params }) {
  const { courseId, chapterId, lessonId } = await params;
  const lesson = await adminGetLesson(lessonId);

  return (
    <>
      <LessonForm data={lesson} courseId={courseId} chapterId={chapterId} />
    </>
  );
}
