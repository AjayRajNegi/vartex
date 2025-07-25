import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CloudUploadIcon, ImageIcon, Loader2, XIcon } from "lucide-react";

export function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <CloudUploadIcon
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground">
        Drop your files here or{" "}
        <span className="text-primary font-bold cursor-pointer">
          click to Upload
        </span>{" "}
      </p>
      <Button className="mt-4" type="button">
        Select File
      </Button>
    </div>
  );
}

export function RenderErrorState() {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <p className="text-base font-semibold">Upload Failed</p>
      <p className="text-xs mt-1 text-muted-foreground">Something went wrong</p>
      <Button type="button" className="mt-4">
        Retry File Selection
      </Button>
    </div>
  );
}

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleRemoveFile,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleRemoveFile: () => void;
}) {
  console.log(previewUrl);
  return (
    <div>
      <Image
        fill
        src={previewUrl}
        alt="Uploaded File"
        className="object-contain p-2"
      />
      <Button
        size="icon"
        variant="destructive"
        disabled={isDeleting}
        onClick={handleRemoveFile}
        className={cn("absolute top-4 right-4")}
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <XIcon size="4" />
        )}
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="text-center flex justify-center items-center flex-col">
      <p>{progress}</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
      <p className="t—l text—xs text—muted-foreground truncate max—w—xs">
        {file.name}
      </p>
    </div>
  );
}
