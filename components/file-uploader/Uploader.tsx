"use client";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent } from "../ui/card";
import { useCallback, useEffect, useState } from "react";
import { useConstruct } from "@/hooks/use-construct-url";
import { FileRejection, useDropzone } from "react-dropzone";

// File uploader state structure
interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}

// Props for the uploader component
interface iAppProps {
  value?: string;
  onChange?: (value: string) => void;
}

// Main uploader component
export function Uploader({ value, onChange }: iAppProps) {
  const fileUrl = useConstruct(value || ""); // Construct file URL from key
  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    error: false,
    fileType: "image",
    key: value,
    objectUrl: fileUrl,
  });

  // Upload the selected file to S3
  async function uploadFile(file: File) {
    setFileState((prev) => ({ ...prev, uploading: true, progress: 0 }));

    try {
      // Request a presigned URL from the server
      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      // Handle error if presigned URL request fails
      if (!presignedResponse.ok) {
        toast.error("Failed to get presigned URL.");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
        return;
      }

      const { presignedUrl, key } = await presignedResponse.json();
      const xhr = new XMLHttpRequest();

      // Upload file to S3 using the presigned URL
      await new Promise<void>((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentageCompleted = (event.loaded / event.total) * 100;
            setFileState((prev) => ({
              ...prev,
              progress: Math.round(percentageCompleted),
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              key: key,
            }));
            onChange?.(key);
            toast.success("File uploaded successfully!");
            resolve();
          } else {
            reject(new Error("Upload failed..."));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed."));
        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong.");
      setFileState((prev) => ({
        ...prev,
        progress: 0,
        uploading: false,
        error: true,
      }));
    }
  }

  // Handle file drop from drag-and-drop
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];

        // Clean up any previous object URL
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        // Set new file state
        setFileState({
          file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: "image",
        });

        uploadFile(file);
      }
    },
    [fileState.objectUrl]
  );

  // Handle removing the uploaded file
  async function handleRemoveFile() {
    if (fileState.isDeleting || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      // Send delete request to server
      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to delete file.");
        setFileState((prev) => ({
          ...prev,
          isDeleting: true,
          error: true,
        }));
        return;
      }

      // Clean up object URL
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      // Reset state and notify
      onChange?.("");
      setFileState(() => ({
        file: null,
        uploading: false,
        progress: 0,
        objectUrl: undefined,
        error: false,
        fileType: "image",
        id: null,
        isDeleting: false,
      }));
      toast.success("File deleted successfully.");
    } catch (error) {
      toast.error("Error removing file. Please try again.");
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        error: true,
      }));
    }
  }

  // Handle file rejections (too large, too many files, etc.)
  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files"
      );
      const fileSizeTooBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large"
      );
      if (tooManyFiles) toast.error("Too many files selected, max is 1.");
      if (fileSizeTooBig) toast.error("File size exceeds the limit.");
    }
  }

  // Render different upload states
  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          file={fileState.file as File}
          progress={fileState.progress}
        />
      );
    }
    if (fileState.error) {
      return <RenderErrorState />;
    }
    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleRemoveFile={handleRemoveFile}
        />
      );
    }
    return <RenderEmptyState isDragActive={isDragActive} />;
  }

  // Cleanup object URLs on unmount
  useEffect(() => {
    let oldUrl = fileState.objectUrl;

    return () => {
      if (oldUrl && !oldUrl.startsWith("http")) {
        URL.revokeObjectURL(oldUrl);
      }
    };
  }, [fileState.objectUrl]);

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5 MB limit
    onDropRejected: rejectedFiles,
    disabled: fileState.uploading || !!fileState.objectUrl,
  });

  // Component UI
  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border—2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
