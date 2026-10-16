import type { ProjectData, ValidationResult } from "./Project.types";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function parseStack(raw: string): string[] {
  return [
    ...new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ];
}

export function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateProjectInput(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== "object")
    return { ok: false, errors: ["Body must be an object"] };
  const r = raw as Record<string, unknown>;
  const title = str(r.title);
  const summary = str(r.summary);
  const role = str(r.role);
  const liveUrl = str(r.liveUrl);
  const repoUrl = str(r.repoUrl);
  const screenshot = str(r.screenshot);
  const stack = Array.isArray(r.stack)
    ? parseStack(
        r.stack.filter((s): s is string => typeof s === "string").join(","),
      )
    : parseStack(str(r.stack));

  const errors: string[] = [];
  if (!title) errors.push("Title is required");
  else if (title.length > 100)
    errors.push("Title must be 100 characters or fewer");
  if (!summary) errors.push("Summary is required");
  else if (summary.length > 600)
    errors.push("Summary must be 600 characters or fewer");
  if (role.length > 100) errors.push("Role must be 100 characters or fewer");
  if (liveUrl && !isHttpUrl(liveUrl))
    errors.push("Live URL must start with http:// or https://");
  if (repoUrl && !isHttpUrl(repoUrl))
    errors.push("Repo URL must start with http:// or https://");
  if (
    screenshot &&
    !screenshot.startsWith("/api/uploads/") &&
    !isHttpUrl(screenshot)
  ) {
    errors.push("Screenshot must be an uploaded file or an http(s) URL");
  }
  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      title,
      summary,
      role: role || undefined,
      stack,
      liveUrl: liveUrl || undefined,
      repoUrl: repoUrl || undefined,
      screenshot: screenshot || undefined,
      featured: r.featured === true,
    },
  };
}

/** Featured first, then newest first. */
export function sortProjects(list: ProjectData[]): ProjectData[] {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}
