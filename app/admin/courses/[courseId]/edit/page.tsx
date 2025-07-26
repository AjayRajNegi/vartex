import { adminGetCourse } from "@/app/data/admin/admin-get-course";

type Params = Promise<{ courseId: string }>;

export default async function EditCourse({ params }: { params: Params }) {
  const { courseId } = await params;
  const data = await adminGetCourse(courseId);
  return <div>{data.title}</div>;
}
