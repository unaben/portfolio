import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/components/Project/hooks/useProjects";
import { ProjectData } from "@/components/Project/Project.types";
import { type FormData, emptyState, toInput } from "../ProjectAdmin.utils";

const useProjectAdmin = (initial: ProjectData[]) => {
  const router = useRouter();
  const { projects, busy, error, create, update, remove, uploadImage } =
    useProjects(initial);
  const [formData, setFormData] = useState<FormData>(emptyState);
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type, checked } = event.target as HTMLInputElement;
    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  const reset = () => {
    setFormData(emptyState);
    setEditingId(null);
  };

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    const input = toInput(formData);
    const saved = editingId
      ? await update(editingId, input)
      : await create(input);
    if (saved) reset();
  }

  async function onFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const url = await uploadImage(file);
    if (url)
      setFormData((previousFormData) => ({
        ...previousFormData,
        screenshot: url,
      }));
  }

  function startEdit(p: ProjectData) {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      summary: p.summary,
      role: p.role ?? "",
      stack: p.stack.join(", "),
      liveUrl: p.liveUrl ?? "",
      repoUrl: p.repoUrl ?? "",
      screenshot: p.screenshot ?? "",
      featured: p.featured,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onDelete(p: ProjectData) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    if (await remove(p.id)) {
      if (editingId === p.id) reset();
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }
  return {
    projects,
    busy,
    error,
    formData,
    editingId,
    handleChange,
    reset,
    onSubmit,
    onFile,
    startEdit,
    setFormData,
    onDelete,
    logout,
  };
};

export default useProjectAdmin;
