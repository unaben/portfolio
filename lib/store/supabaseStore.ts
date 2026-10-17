import { randomUUID } from "node:crypto";
import type { ProjectsStore } from "./types";
import type { Tables } from "./database.types";
import {
  getSupabaseClient,
  rowToProject,
  projectInputToRow,
  INVALID_UUID_ERROR_CODE,
  getStoragePathFromUrl,
  IMAGE_CONTENT_TYPES,
  STORAGE_BUCKET_NAME,
} from "./supabaseStore.utils";

export type ProjectRow = Tables<"projects">;

export const supabaseStore: ProjectsStore = {
  async list() {
    const { data: rows, error } = await getSupabaseClient()
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return rows.map(rowToProject);
  },

  async create(input) {
    const { data: createdRow, error } = await getSupabaseClient()
      .from("projects")
      .insert(projectInputToRow(input))
      .select()
      .single();
    if (error) throw error;
    return rowToProject(createdRow);
  },

  async update(id, input) {
    const { data: updatedRow, error } = await getSupabaseClient()
      .from("projects")
      .update({
        ...projectInputToRow(input),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === INVALID_UUID_ERROR_CODE) return null;
      throw error;
    }
    return updatedRow ? rowToProject(updatedRow) : null;
  },

  async remove(id) {
    const supabase = getSupabaseClient();
    const { data: deletedRow, error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === INVALID_UUID_ERROR_CODE) return false;
      throw error;
    }
    if (!deletedRow) return false;

    const screenshotStoragePath = getStoragePathFromUrl(deletedRow.screenshot);
    if (screenshotStoragePath) {
      await supabase.storage
        .from(STORAGE_BUCKET_NAME)
        .remove([screenshotStoragePath]);
    }
    return true;
  },

  async saveImage(imageData, fileExtension) {
    const storage = getSupabaseClient().storage.from(STORAGE_BUCKET_NAME);
    const storagePath = `${randomUUID()}${fileExtension}`;

    const { error } = await storage.upload(storagePath, imageData, {
      contentType: IMAGE_CONTENT_TYPES[fileExtension],
      upsert: false,
    });
    if (error) throw error;

    return storage.getPublicUrl(storagePath).data.publicUrl;
  },
};
