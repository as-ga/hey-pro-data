import GigDetails from "@/app/(app)/(gigs)/components/gig-details";
import { gigsData } from "@/data/gigs";
import { notFound } from "next/navigation";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return await gigsData.map((gig) => ({
    slug: gig.slug,
  }));
}

type GigDetailsPageProps = {
  params: { slug: string };
};

export default async function GigDetailsPage({ params }: GigDetailsPageProps) {
  const { slug } = await params
  const gig = gigsData.find((entry) => entry.slug === slug);
  if (!gig) return notFound();

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto flex max-w-6xl justify-center">
        <GigDetails {...gig} />
      </div>
    </main>
  );
}
