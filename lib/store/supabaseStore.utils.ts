import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { ProjectRow } from "./supabaseStore";
import { ProjectData, ProjectInput } from "@/components/Project/Project.types";
import { TablesInsert, Database } from "./database.types";

export const STORAGE_BUCKET_NAME = process.env.SUPABASE_BUCKET ?? "screenshots";

export const IMAGE_CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

// Postgres error for a malformed uuid, e.g. /api/projects/not-a-uuid
export const INVALID_UUID_ERROR_CODE = "22P02";

export function rowToProject(row: ProjectRow): ProjectData {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    role: row.role ?? undefined,
    stack: row.stack,
    liveUrl: row.live_url ?? undefined,
    repoUrl: row.repo_url ?? undefined,
    screenshot: row.screenshot ?? undefined,
    featured: row.featured,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Explicit nulls so cleared fields are really cleared on update.
export function projectInputToRow(
  input: ProjectInput,
): TablesInsert<"projects"> {
  return {
    title: input.title,
    summary: input.summary,
    role: input.role ?? null,
    stack: input.stack,
    live_url: input.liveUrl ?? null,
    repo_url: input.repoUrl ?? null,
    screenshot: input.screenshot ?? null,
    featured: input.featured,
  };
}

let cachedSupabaseClient: SupabaseClient<Database> | null = null;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (cachedSupabaseClient) return cachedSupabaseClient;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }

  cachedSupabaseClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  return cachedSupabaseClient;
}

/** Storage path for one of our public image URLs, or null if it's someone else's image. */
export function getStoragePathFromUrl(imageUrl?: string | null): string | null {
  if (!imageUrl) return null;

  const publicUrlMarker = `/storage/v1/object/public/${STORAGE_BUCKET_NAME}/`;
  const markerIndex = imageUrl.indexOf(publicUrlMarker);
  if (markerIndex === -1) return null;

  return decodeURIComponent(
    imageUrl.slice(markerIndex + publicUrlMarker.length),
  );
}
