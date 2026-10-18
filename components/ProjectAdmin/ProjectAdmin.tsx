"use client";

import Link from "next/link";
import cx from "classnames";
import ProjectAdminList from "./ProjectAdminList";
import useProjectAdmin from "./hooks/useProjectAdmin";
import type { ProjectData } from "../Project/Project.types";
import styles from "./ProjectAdmin.module.css";

export function ProjectAdmin({ initial }: { initial: ProjectData[] }) {
  const {
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
  } = useProjectAdmin(initial);

  return (
    <main className={styles.page}>
      <div className={styles.top}>
        <h1>Projects</h1>
        <div className={styles.actions}>
          <Link className={styles.button} href="/">
            View site
          </Link>
          <button className={cx(styles.button, styles.ghost)} onClick={logout}>
            Sign out
          </button>
        </div>
      </div>

      <form
        className={cx(styles.form, { [styles.editing]: editingId })}
        onSubmit={onSubmit}
      >
        <label className={styles.field}>
          Title
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.input}
            required
            maxLength={100}
          />
        </label>
        <label className={styles.field}>
          Summary
          <textarea
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            className={styles.input}
            rows={3}
            required
            maxLength={600}
          />
        </label>
        <div className={styles.row}>
          <label className={styles.field}>
            Your role
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            Stack (comma separated)
            <input
              name="stack"
              value={formData.stack}
              onChange={handleChange}
              placeholder="Next.js, TypeScript"
              className={styles.input}
            />
          </label>
        </div>
        <div className={styles.row}>
          <label className={styles.field}>
            Live URL
            <input
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              type="url"
              className={styles.input}
            />
          </label>
          <label className={styles.field}>
            Repo URL
            <input
              name="repoUrl"
              value={formData.repoUrl}
              onChange={handleChange}
              type="url"
              className={styles.input}
            />
          </label>
        </div>
        <div className={styles.field}>
          <label htmlFor="shot">Screenshot</label>
          <div className={styles.preview}>
            {formData.screenshot && (
              <img src={formData.screenshot} alt="Screenshot preview" />
            )}
            <input
              id="shot"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={onFile}
            />
            {formData.screenshot && (
              <button
                type="button"
                className={cx(styles.button, styles.ghost)}
                onClick={() =>
                  setFormData((previousFormData) => ({
                    ...previousFormData,
                    screenshot: "",
                  }))
                }
              >
                Remove
              </button>
            )}
          </div>
        </div>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) =>
              setFormData((previousFormData) => ({
                ...previousFormData,
                featured: e.target.checked,
              }))
            }
          />
          Feature at the top
        </label>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
        <div className={styles.actions}>
          <button className={styles.button} disabled={busy}>
            {editingId ? "Save changes" : "Add project"}
          </button>
          {editingId && (
            <button
              type="button"
              className={cx(styles.button, styles.ghost)}
              onClick={reset}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      <ProjectAdminList
        projects={projects}
        busy={busy}
        startEdit={startEdit}
        onDelete={onDelete}
      />
    </main>
  );
}
