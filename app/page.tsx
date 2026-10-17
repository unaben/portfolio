import Link from "next/link";
import { profileData } from "@/config/profileData";
import { repo } from "@/lib/store";
import { ProjectItem } from "@/components/Project/Project";
import { sortProjects } from "@/components/Project/Project.utils";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function Home() {
  const projects = sortProjects(await repo.list());
  const links = Object.entries(profileData.links).filter(([, v]) => v);
  return (
    <main className="container">
      <header className={styles.hero}>
        <h1 className={styles.name}>{profileData.name}</h1>
        <p className={styles.role}>{profileData.role}</p>
        <p className={styles.intro}>{profileData.intro}</p>
      </header>

      <section aria-labelledby="work">
        <h2 id="work" className={styles.heading}>
          Selected projects
        </h2>
        {projects.length === 0 && (
          <p className={styles.empty}>
            No projects yet. Add one from the admin page.
          </p>
        )}
        <div className={styles.grid}>
          {projects.map((p) => (
            <ProjectItem key={p.id} project={p} />
          ))}
        </div>
      </section>

      {links.length > 0 && (
        <footer className={styles.footer}>
          {links.map(([k, v]) => (
            <Link
              className={k === "email" ? undefined : styles.footerLink}
              key={k}
              href={k === "email" ? `mailto:${v}` : v}
              target="_blank"
              rel="noreferrer"
            >
              {k}
            </Link>
          ))}
        </footer>
      )}
    </main>
  );
}
