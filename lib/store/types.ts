import type { ProjectData, ProjectInput } from '@/components/Project/Project.types';

export interface ProjectsStore {
  list(): Promise<ProjectData[]>;
  create(input: ProjectInput): Promise<ProjectData>;
  update(id: string, input: ProjectInput): Promise<ProjectData | null>;
  remove(id: string): Promise<boolean>;
  /** Stores an image and returns the URL to put in `screenshot`. */
  saveImage(data: Buffer, ext: string): Promise<string>;
}
