import { readUpload } from "@/lib/store/jsonStore";

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  if (!/^[\w-]+\.(png|jpg|webp|gif)$/.test(file))
    return new Response("Not found", { status: 404 });
  const buf = await readUpload(file);
  if (!buf) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": MIME[file.split(".").pop()!],
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
