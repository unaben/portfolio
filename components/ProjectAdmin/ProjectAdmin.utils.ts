import { ProjectInput } from "../Project/Project.types";
import { parseStack } from "../Project/Project.utils";

export const emptyState = {
  title: "",
  summary: "",
  role: "",
  stack: "",
  liveUrl: "",
  repoUrl: "",
  screenshot: "",
  featured: false,
};

export type FormData = typeof emptyState;

export const toInput = (formState: FormData): ProjectInput => ({
  title: formState.title,
  summary: formState.summary,
  role: formState.role || undefined,
  stack: parseStack(formState.stack),
  liveUrl: formState.liveUrl || undefined,
  repoUrl: formState.repoUrl || undefined,
  screenshot: formState.screenshot || undefined,
  featured: formState.featured,
});