export function useConstruct(key: string): string {
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_IMAGES}.t3.storage.dev/${key}`;
}
