import { getIndividualCourse } from "@/app/data/course/get-course";
import { RenderDescription } from "@/components/rich-text-editor/RenderDesctiption";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  IconCategory,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import Image from "next/image";

type Params = Promise<{ slug: string }>;

export default async function IndividualCoursePage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;
  const course = await getIndividualCourse(slug);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-5">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={`https://${process.env.NEXT_PUBLIC_S3_BUCKET_IMAGES}.t3.storage.dev/${course.fileKey}`}
            alt="Thumbnail image for course"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="mt-8 space-y-3">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
              {course.smallDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar size={4} />
              <span>{course.level}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconCategory size={4} />
              <span>{course.category}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock size={4} />
              <span>{course.duration} hours</span>
            </Badge>
          </div>
          <Separator className="my-8" />

          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Description
            </h2>

            <RenderDescription json={JSON.parse(course.description)} />
          </div>
        </div>
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Content
            </h2>
            <div>
              {course.chapter.length} chapters |{" "}
              {course.chapter.reduce(
                (total, chapter) => total + chapter.lessons.length,
                0
              ) || 0}{" "}
              Lessons
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {course.chapter.map((chapter, index) => (
            <Collapsible key={chapter.id} defaultOpen={index === 0}>
              <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
                <CollapsibleTrigger>
                  <div>
                    <CardContent className="p-6 hover:bg-muted/50 transition-colors ">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <p className="flex size-10 items-center justify-center rounded-full text-primary font-semibold bg-primary/10">
                            {index + 1}
                          </p>
                          <div>
                            <h3 className="text-xl font-semibold text-left">
                              {chapter.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 text-left">
                              {chapter.lessons.length} lesson
                              {chapter.lessons.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className="text-xs" variant="outline">
                            {chapter.lessons.length} lesson
                            {chapter.lessons.length !== 1 ? "s" : ""}
                          </Badge>

                          <IconChevronDown className="size-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t bg-muted/20">
                    <div className="p-6 pt-4 space-y-3">
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-4 rounded-lg p-3 hover:bg-accent transition-colors group"
                        >
                          <div className="flex size-8 items-center justify-center rounded-full bg-background border-2 border-primary/20">
                            <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Lesson {lessonIndex + 1}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
}
