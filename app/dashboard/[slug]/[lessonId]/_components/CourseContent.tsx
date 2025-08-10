"use client";
import { toast } from "sonner";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { Button } from "@/components/ui/button";
import { MarkLessonComplete } from "../actions";
import { useConfetti } from "@/hooks/use-confetti";
import { BookIcon, CheckCircle } from "lucide-react";
import { useConstruct } from "@/hooks/use-construct-url";
import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDesctiption";

interface iAppProps {
  data: LessonContentType;
}
function safeParseDescription(desc: string | null) {
  if (!desc) return null;
  try {
    return JSON.parse(desc); // Works if it's valid JSON
  } catch {
    // Fallback: wrap plain text into a minimal TipTap doc
    return {
      type: "doc",
      content: [{ type: "paragraph", content: [{ type: "text", text: desc }] }],
    };
  }
}

export function CourseContent({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();

  function VideoPlayer({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string;
    videoKey: string;
  }) {
    const videoUrl = useConstruct(videoKey);
    const thumbnailUrl = useConstruct(thumbnailKey);

    if (!videoKey)
      return (
        <div className="aspect-video bg-muted rounded-lg flex flex-col  items-center justify-center">
          <BookIcon className="size-16 text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            This lesson does not have a video yet.
          </p>
        </div>
      );

    return (
      <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
        <video
          controls
          poster={thumbnailUrl}
          className="w-full h-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src="video.webm" type="video/webm" />
          <source src="video.ogv" type="video/ogg" />
          Your browser does not support video tag.
        </video>
      </div>
    );
  }
  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        MarkLessonComplete(data.id, data.Chapter?.Course.slug ?? "")
      );

      if (error) {
        toast.error("An unexpected error occured.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        triggerConfetti();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />
      <div className="py-4 border-b">
        {data.lessonProgress.length > 0 ? (
          <Button variant="outline" className="bg-green-500/10 text-green-500">
            <CheckCircle className="size-4 mr-2 text-green-500 hover:text-green-600" />
            Completed
          </Button>
        ) : (
          <Button variant="outline" onClick={onSubmit} disabled={pending}>
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Mark as Complete
          </Button>
        )}
      </div>

      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>
        {data.description && (
          <RenderDescription json={safeParseDescription(data.description)} />
        )}
      </div>
    </div>
  );
}
