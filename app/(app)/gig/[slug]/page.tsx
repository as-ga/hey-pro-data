import GigDetails from "@/components/modules/pages/gig-details";
import { gigsData } from "@/data";
import { notFound } from "next/navigation";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return gigsData.map((gig) => ({
    slug: gig.id.toString(),
  }));
}

export default async function GigDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gig = gigsData.find((gig) => gig.id.toString() === slug);

  if (!gig) return notFound();

  return (
    <main className="mt-30 flex flex-col justify-center items-center">
      <GigDetails {...gig} />
    </main>
  );
}
