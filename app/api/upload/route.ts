import { NextResponse } from "next/server";
import { repo } from "@/lib/store";
import { errorResponse } from "@/lib/apiResponse";

const ALLOWED_IMAGE_EXTENSIONS: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const isDev = process.env.NODE_ENV !== "production";

export async function POST(request: Request) {
  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (parseError) {
      if (isDev)
        console.warn("[upload] Could not parse form data:", parseError);
      return errorResponse("Invalid upload request", 400);
    }

    const uploadedFile = formData.get("file");
    if (!(uploadedFile instanceof File)) {
      return errorResponse("No file provided", 400);
    }

    const fileExtension = ALLOWED_IMAGE_EXTENSIONS[uploadedFile.type];
    if (!fileExtension) {
      return errorResponse("Use a PNG, JPEG, WebP or GIF image", 415);
    }

    if (uploadedFile.size > MAX_IMAGE_BYTES) {
      return errorResponse("Image must be under 5 MB", 413);
    }

    const imageBuffer = Buffer.from(await uploadedFile.arrayBuffer());
    const imageUrl = await repo.saveImage(imageBuffer, fileExtension);

    return NextResponse.json({ url: imageUrl }, { status: 201 });
  } catch (error) {
    // Storage failures (disk, Supabase, network) land here
    console.error(
      "[upload] Failed to save image:",
      isDev && error instanceof Error
        ? (error.stack ?? error.message)
        : "storage error",
    );
    return errorResponse("Could not save the image. Please try again.", 500);
  }
}
