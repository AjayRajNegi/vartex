import { z } from "zod";

export const courseLevels = ["Beginner", "Advanced", "Intermediate"] as const;

export const courseStatus = ["Archived", "Published", "Draft"] as const;

export const courseCategories = [
  "Development",
  "Business",
  "Finance",
  "IT & Software",
  "Office Productivity",
  "Personal Development",
  "Design",
  "Marketing",
  "Health & Fitness",
  "Music",
  "Teaching & Academics",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must not exceed 100 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" }),
  fileKey: z.string().min(1, { message: "File key is required" }),
  price: z.number().min(1, { message: "Price must be at least 1" }),
  duration: z
    .number()
    .min(1, { message: "Duration must be at least 1" })
    .max(500, { message: "Duration must not exceed 500" }),
  level: z.enum(["Beginner", "Intermediate", "Advanced"], {
    message: "Invalid course level",
  }),
  category: z.enum(courseCategories, { message: "Category is required." }),
  smallDescription: z
    .string()
    .min(3, { message: "Small description must be at least 3 characters" })
    .max(200, { message: "Small description must not exceed 200 characters" }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
  status: z.enum(["Draft", "Published", "Archived"], {
    message: "Invalid status",
  }),
});

export const chapterSchema = z.object({
  name: z.string().min(3, { message: "Name must be 3 characters long." }),
  courseId: z.string().uuid({ message: "Invalid course id" }),
});

export const lessonSchema = z.object({
  name: z.string().min(3, { message: "Name must be 3 characters long." }),
  courseId: z.string().uuid({ message: "Invalid course id" }),
  chapterId: z.string().uuid({ message: "Invalid chapter id" }),
  description: z
    .string()
    .min(3, { message: "Description must be 3 characters long." })
    .optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

export type LessonSchemaType = z.infer<typeof lessonSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type CourseSchemaType = z.infer<typeof courseSchema>;
