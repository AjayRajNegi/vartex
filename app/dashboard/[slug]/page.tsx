import { redirect } from "next/navigation";
import { getCoursesSidebarData } from "@/app/data/course/get-course-sidebar-data";

interface iAppProps {
  params: Promise<{ slug: string }>;
}
export default async function CourseSlugRoute({ params }: iAppProps) {
  const { slug } = await params;

  const course = await getCoursesSidebarData({ slug });

  const firstChapter = course.course.chapter[0];
  const firstLesson = firstChapter.lessons[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }
  return (
    <div className="flex items-center justify-center h-full text-center">
      <h2 className="text-2xl font-bold mb-2">No lessons available</h2>
      <p>This course </p>
    </div>
  );
}
