"use client";
import { useCallback, useState } from "react";
import type { ProjectData, ProjectInput } from "../Project.types";
import { sortProjects } from "../Project.utils";
import { fetchJson } from ".";

const json = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export function useProjects(initial: Array<ProjectData>) {
  const [projects, setProjects] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async function <T>(
    fn: () => Promise<T>,
  ): Promise<T | null> {
    setBusy(true);
    setError(null);
    try {
      return await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      return null;
    } finally {
      setBusy(false);
    }
  }, []);

  const create = (input: ProjectInput) =>
    run(async () => {
      const projectRes = await fetchJson<ProjectData>("/api/projects", json("POST", input));
      setProjects((prev) => sortProjects([projectRes, ...prev]));
      return projectRes;
    });

  const update = (id: string, input: ProjectInput) =>
    run(async () => {
      const p = await fetchJson<ProjectData>(
        `/api/projects/${id}`,
        json("PUT", input),
      );
      setProjects((prev) =>
        sortProjects(prev.map((x) => (x.id === id ? p : x))),
      );
      return p;
    });

  const remove = (id: string) =>
    run(async () => {
      await fetchJson(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((x) => x.id !== id));
      return true;
    });

  const uploadImage = (file: File) =>
    run(async () => {
      const formData = new FormData();
      formData.append("file", file);
      const { url } = await fetchJson<{ url: string }>("/api/upload", {
        method: "POST",
        body: formData,
      });
      return url;
    });

  return { projects, busy, error, create, update, remove, uploadImage };
}
