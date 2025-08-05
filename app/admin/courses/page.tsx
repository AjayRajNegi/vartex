import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { AdminCourseCard } from "./_components/AdminCourseCard";
import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { EmptyState } from "@/components/general/EmptyState";

export default function CoursesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>
        <Link href="/admin/courses/create" className={buttonVariants()}>
          Create Courses
        </Link>
      </div>
      <RenderCourses />
    </>
  );
}

async function RenderCourses() {
  const data = await adminGetCourses();

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No courses found"
          description="Create a new course to get started."
          buttonText="Create Course"
          href="/admin/courses/create"
        />
      ) : (
        <div className="grid grid-cols-I sm:grid-cols-2 md:grid—cols—l lg:grid-cols-2 gap-7">
          {data.map((course) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}
