export interface ProjectData {
  id: string;
  title: string;
  summary: string;
  role?: string;
  stack: string[];
  liveUrl?: string;
  repoUrl?: string;
  screenshot?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProjectInput = Omit<ProjectData, "id" | "createdAt" | "updatedAt">;

export type ValidationResult =
  | { ok: true; value: ProjectInput }
  | { ok: false; errors: string[] };

export interface ProjectProps {
  project: ProjectData;
  className?: string;
}
