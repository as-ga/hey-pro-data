import GigDetails from "@/app/(app)/(gigs)/components/gig-details";
import { gigsData } from "@/data/gigs";
import { notFound } from "next/navigation";

export function generateStaticParams(): { slug: string }[] {
  return gigsData.map((gig) => ({ slug: gig.slug }));
}

type GigDetailsPageProps = {
  params: { slug: string };
};

export default async function GigDetailsPage({ params }: GigDetailsPageProps) {
  const { slug } = await params;
  const gig = gigsData.find((entry) => entry.slug === slug);
  if (!gig) return notFound();

  return (
    <main className="bg-white px-4">
      <div className="mx-auto flex max-w-6xl justify-center">
        <GigDetails {...gig} />
      </div>
    </main>
  );
}
