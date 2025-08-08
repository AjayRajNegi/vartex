import { EmptyState } from "@/components/general/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { PublicCourseCard } from "../(public)/_components/PublicCourseCard";
import Link from "next/link";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold ">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courese you have access t0.
        </p>

        {enrolledCourses.length === 0 ? (
          <EmptyState
            title="No coures purchased."
            description="You haven't purchased any courses yet."
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((course) => (
              <Link
                key={course.Course.id}
                href={`/dashboard/${course.Course.slug}`}
              >
                {course.Course.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      <section className="mt-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold mb-5">Available Courses</h1>
          <p className="text-muted-foreground">
            Here you can see all the courese you can purchase.
          </p>
        </div>

        {courses.filter(
          (course) =>
            !enrolledCourses.some(
              ({ Course: enrolled }) => enrolled.id === course.id
            )
        ).length === 0 ? (
          <EmptyState
            title="No coures available."
            description="You have already purchased all the available courses."
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    ({ Course: enrolled }) => enrolled.id === course.id
                  )
              )
              .map((course) => (
                <PublicCourseCard key={course.id} data={course} />
              ))}
          </div>
        )}
      </section>
    </>
  );
}
