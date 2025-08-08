import { ReactNode } from "react";
import { CourseSidebar } from "../_components/CourseSidebar";
import { getCoursesSidebarData } from "@/app/data/course/get-course-sidebar-data";

interface iAppProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}
export default async function CourseLayout({ children, params }: iAppProps) {
  const { slug } = await params;
  const course = await getCoursesSidebarData({ slug });
  return (
    <div className="flex flex-1">
      {/* sidebar */}
      <div className="w-80 border-r border-border shrink-0">
        <CourseSidebar course={course.course} />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
