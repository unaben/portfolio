import type { ProjectData } from "../Project/Project.types";
import styles from "./ProjectAdmin.module.css";
import cx from "classnames";

type ProjectAdminListProps = {
  projects: ProjectData[];
  busy: boolean;
  startEdit: (p: ProjectData) => void;
  onDelete: (p: ProjectData) => void;
};

const ProjectAdminList = (props: ProjectAdminListProps) => {
    const { projects, busy, startEdit, onDelete } = props;
  return (
    <ul className={styles.list}>
      {projects.map((project) => (
        <li key={project.id} className={styles.listItem}>
          {project.screenshot ? (
            <img className={styles.thumb} src={project.screenshot} alt="" />
          ) : (
            <div className={styles.thumb} />
          )}
          <div className={styles.grow}>
            <strong>
              {project.title}
              {project.featured ? " (featured)" : ""}
            </strong>
            <span>{project.stack.join(", ") || project.summary}</span>
          </div>
          <button
            className={cx(styles.button, styles.ghost)}
            onClick={() => startEdit(project)}
          >
            Edit
          </button>
          <button
            className={cx(styles.button, styles.ghost, styles.danger)}
            onClick={() => onDelete(project)}
            disabled={busy}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ProjectAdminList;
