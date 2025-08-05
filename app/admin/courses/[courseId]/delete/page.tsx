"use client";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import Link from "next/link";
import { toast } from "sonner";
import { useTransition } from "react";
import { deleteCourse } from "./actions";
import { tryCatch } from "@/hooks/try-catch";
import { Loader2, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";

export default function DeleteCourse() {
  const [pending, startTransition] = useTransition();
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error("An unexpected error occured.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);

        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="max-w-xl mx-auto w-full">
      <Card className="mt-32">
        <CardHeader>
          <CardTitle>Are you sure you want to delete this course?</CardTitle>
          <CardDescription>This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={`/admin/courses`}
          >
            Cancel
          </Link>
          <Button variant="destructive" onClick={onSubmit} disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={4} />
                Delete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
