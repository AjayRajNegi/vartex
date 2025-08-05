"use client";

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
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
import { ArrowLeft } from "lucide-react";
import { updateLesson } from "../actions";
import { useForm } from "react-hook-form";
import { tryCatch } from "@/hooks/try-catch";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Uploader } from "@/components/file-uploader/Uploader";
import { Button, buttonVariants } from "@/components/ui/button";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchema";
import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";

interface iAppProps {
  data: AdminLessonType;
  courseId: string;
  chapterId: string;
}

export function LessonForm({ data, courseId, chapterId }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data.title,
      courseId: courseId,
      chapterId: chapterId,
      description: data.description ?? undefined,
      thumbnailKey: data.thumbnailKey ?? undefined,
      videoKey: data.videoKey ?? undefined,
    },
  });

  function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateLesson(values, data.id)
      );

      if (error) {
        toast.error("An unexpected error occured.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
    console.log(values);
  }
  return (
    <div>
      <Link
        className={buttonVariants({ variant: "outline", className: "mb-6" })}
        href={`/admin/courses/${courseId}/edit`}
      >
        <ArrowLeft size={4} />
        <span>Go Back</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>
            Configure the video and description for this lesson.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Chapter xyz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnailKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail image</FormLabel>
                    <FormControl>
                      <Uploader
                        onChange={field.onChange}
                        value={field.value}
                        fileTypeAccepted="image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videoKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video File </FormLabel>
                    <FormControl>
                      <Uploader
                        onChange={field.onChange}
                        value={field.value}
                        fileTypeAccepted="video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Submit"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
