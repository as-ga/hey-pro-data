import { Button } from "@/components/ui/button"
import { Calendar, Edit } from "lucide-react"
import CreditsEditor from "./CreditsEditor"
import Image from "next/image"
import Link from "next/link"

function CreditItem({
    creditTitle,
    description,
    ImageUrl,
    period,
}: {
    creditTitle: string
    description: string
    period: string
    ImageUrl: string
}) {
    return (
        <div className="flex flex-col md:flex-row md:gap-6 space-y-4 md:space-y-0">
            <div className="md:w-1/3 flex-shrink-0">
                <Image
                    src={ImageUrl}
                    alt={creditTitle}
                    width={333}
                    height={919.1351318359375}
                    className="w-full h-auto object-cover rounded-md"
                />
            </div>
            <div className="md:w-2/3 space-y-3">
                <h3 className="font-semibold text-base sm:text-lg">{creditTitle}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {(() => {
                        const parts = (period || "").split(" - ").map(p => p?.trim() ?? "");
                        const fmt = (p: string) => {
                            if (!p) return "";
                            const d = new Date(p);
                            if (!isNaN(d.getTime())) {
                                return `${d.toLocaleString("en-US", { month: "short" })}, ${d.getFullYear()}`;
                            }
                            return p;
                        };
                        const start = fmt(parts[0]);
                        const end = parts[1] ? fmt(parts[1]) : "";
                        const display = end ? `${start} - ${end}` : start;
                        return <span>{display}</span>;
                    })()}
                </div>
            </div>
        </div>
    )
}


export default function CreditsSection({ Profile }: { Profile: { credits: { id: string, creditTitle: string, description: string, startDate: Date, endDate: Date, imgUrl: string }[] } }) {
    return (
        <div className="space-y-4 max-w-full sm:max-w-3xl mx-auto shadow-md p-6 sm:p-8 lg:p-10 rounded-xl bg-[#FAFAFA]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold">Credits</h2>
                <CreditsEditor
                    initialCredits={Profile.credits}
                    trigger={
                        <Button size="icon" variant="ghost" className="rounded-full">
                            <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-500" />
                        </Button>
                    }
                />
            </div>
            <div className="space-y-6">
                {Profile.credits.map((credit, index) => (
                    <CreditItem
                        key={index}
                        creditTitle={credit.creditTitle}
                        description={credit.description}
                        ImageUrl={credit.imgUrl}
                        period={`${credit.startDate} - ${credit.endDate}`}
                    />
                ))}
                <Link href="#" className="text-[#31A7AC]">See all credits</Link>
            </div>
        </div>
    )
}
