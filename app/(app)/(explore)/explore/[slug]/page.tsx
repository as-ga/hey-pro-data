import { Badge } from "@/components/ui/badge"
import { getExploreCategory } from "@/data/exploreProfiles"

type ExplorePageProps = {
    params: Promise<{ slug: string }>
}

export default async function ExplorePage({ params }: ExplorePageProps) {
    const { slug } = await params
    const category = getExploreCategory(slug)

    if (!category) {
        return (
            <div>
                <h1>Category Not Found</h1>
                <p>The category you are looking for does not exist.</p>
                <p>We will work on adding it soon.</p>
            </div>
        )
    }

    return (
        <section className="space-y-6">
            <header className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Crew Directory</p>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900">{category.title}</h1>
                        <p className="text-sm text-muted-foreground max-w-2xl">{category.summary}</p>
                    </div>
                    <span className="text-xs text-foreground/70">{category.lastUpdated}</span>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {category.profiles.map((profile) => (
                    <article
                        key={profile.id}
                        className="rounded-3xl border border-slate-100 bg-white shadow-[0_15px_35px_rgba(4,42,61,0.07)] overflow-hidden"
                    >
                        <div className="h-28 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500" />
                        <div className="-mt-10 flex flex-col gap-4 px-6 pb-6">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-20 w-20 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center text-lg font-semibold text-slate-600">
                                    {profile.name
                                        .split(" ")
                                        .map((chunk) => chunk[0])
                                        .join("")}
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-slate-900">{profile.name}</p>
                                    <p className="text-sm text-muted-foreground">{profile.location}</p>
                                    <p className="text-xs font-medium text-emerald-600">
                                        {profile.availability === "available" ? "Available" : "Currently booked"}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{profile.summary}</p>
                            <div className="flex flex-wrap gap-2">
                                {profile.roles.map((role) => (
                                    <Badge
                                        key={role}
                                        variant="outline"
                                        className="border-[#31A7AC]/40 text-[#017A7C] bg-[#E4F5F5] text-xs"
                                    >
                                        {role}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}