import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { ProjectData } from "@/components/Project/Project.types";
import type { ProjectsStore } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "projects.json");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const UPLOAD_PREFIX = "/api/uploads/";

async function read(): Promise<ProjectData[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

async function write(list: ProjectData[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(list, null, 2));
}

export async function readUpload(name: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(path.join(UPLOAD_DIR, name));
  } catch {
    return null;
  }
}

export const jsonStore: ProjectsStore = {
  list: read,

  async create(input) {
    const now = new Date().toISOString();
    const project: ProjectData = {
      ...input,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    await write([project, ...(await read())]);
    return project;
  },

  async update(id, input) {
    const list = await read();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;
    // Replace (not merge) so cleared fields really are cleared.
    const next: ProjectData = {
      ...input,
      id,
      createdAt: list[index].createdAt,
      updatedAt: new Date().toISOString(),
    };
    list[index] = next;
    await write(list);
    return next;
  },

  async remove(id) {
    const list = await read();
    const target = list.find((p) => p.id === id);
    if (!target) return false;
    await write(list.filter((p) => p.id !== id));
    if (target.screenshot?.startsWith(UPLOAD_PREFIX)) {
      await fs.rm(path.join(UPLOAD_DIR, path.basename(target.screenshot)), {
        force: true,
      });
    }
    return true;
  },

  async saveImage(data, ext) {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const name = `${randomUUID()}${ext}`;
    await fs.writeFile(path.join(UPLOAD_DIR, name), data);
    return `${UPLOAD_PREFIX}${name}`;
  },
};
