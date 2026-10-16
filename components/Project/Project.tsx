import cx from "classnames";
import Link from "next/link";
import type { Project } from "./Project.types";
import styles from "./Project.module.css";

interface ProjectProps {
  project: Project;
  className?: string;
}

export function ProjectItem({ project, className }: ProjectProps) {
  const {
    title,
    summary,
    role,
    stack,
    liveUrl,
    repoUrl,
    screenshot,
    featured,
  } = project;
  return (
    <article
      className={cx(styles.item, { [styles.featured]: featured }, className)}
    >
      <div className={cx(styles.media, { [styles.empty]: !screenshot })}>
        {screenshot ? (
          <img src={screenshot} alt={`Screenshot of ${title}`} loading="lazy" />
        ) : (
          <span>No screenshot</span>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        {role && <p className={styles.role}>{role}</p>}
        <p className={styles.summary}>{summary}</p>
        {stack.length > 0 && (
          <ul className={styles.stack}>
            {stack.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
        {(liveUrl || repoUrl) && (
          <p className={styles.links}>
            {liveUrl && (
              <Link href={liveUrl} target="_blank" rel="noreferrer">
                Live site
              </Link>
            )}
            {repoUrl && (
              <Link href={repoUrl} target="_blank" rel="noreferrer">
                Source code
              </Link>
            )}
          </p>
        )}
      </div>
    </article>
  );
}
