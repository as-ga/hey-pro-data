import ExplorePage from "@/components/modules/pages/explore-page";
import { projectCardData } from "@/data";

export default async function HomePage() {
  // const projectCardData = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`,
  //   { next: { revalidate: 10 } }
  // ).then((res) => res.json());
  return (
    <main className="px-10">
      <ExplorePage projectsCardData={projectCardData} />
    </main>
  );
}
