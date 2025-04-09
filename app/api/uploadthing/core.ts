import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "4MB" } })
        .middleware(async () => {
            return { uploadedAt: new Date().toISOString() }; // 👈 JSON-safe
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete at:", metadata.uploadedAt);
            console.log("File URL:", file.url);
            return {
                uploadedAt: metadata.uploadedAt, // already a string
                url: file.url,
            };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;