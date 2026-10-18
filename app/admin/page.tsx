import { repo } from "@/lib/store";
import { sortProjects } from "@/components/Project/Project.utils";
import { ProjectAdmin } from "@/components/ProjectAdmin/ProjectAdmin";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  return <ProjectAdmin initial={sortProjects(await repo.list())} />;
}
