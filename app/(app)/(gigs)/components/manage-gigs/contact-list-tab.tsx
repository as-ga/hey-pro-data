import Image from "next/image";

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

import { gigsData } from "@/data/gigs";
import { sampleApplicants } from "./sample-data";

type ContactListTabProps = {
    selectedGigIds: string[];
    actionIndicators: Record<string, Partial<Record<"release" | "shortlist" | "confirm", boolean>>>;
};

export function ContactListTab({ selectedGigIds, actionIndicators }: ContactListTabProps) {
    const selectedGigs = gigsData.filter((gig) => selectedGigIds.includes(gig.id));

    if (!selectedGigs.length) {
        return (
            <Card className="bg-transparent border-none">
                <CardHeader>
                    <CardTitle>Select gigs to review contacts</CardTitle>
                    <CardDescription>
                        Choose at least one gig in the Gigs tab to view assigned department contacts.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            {selectedGigs.map((gig) => {
                const shortlistedOrConfirmed = sampleApplicants.filter((person) => {
                    const state = actionIndicators[`${gig.id}-${person.id}`];
                    return Boolean(state?.shortlist || state?.confirm);
                });

                return (
                    <section key={gig.id} className="space-y-4 bg-transparent p-4">
                        <header className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <p className="text-lg font-semibold text-gray-900">{gig.title}</p>
                            <span className="flex items-center gap-1">
                                <CalendarDays className="h-4 w-4" />
                                {gig.dateWindows.map((window, index) => (
                                    <span key={window.label}>
                                        <span className="font-medium text-gray-900">{window.label}</span>
                                        <span className="mx-1">|</span>
                                        {window.range}
                                        {index < gig.dateWindows.length - 1 && <span className="mx-1">·</span>}
                                    </span>
                                ))}
                            </span>
                        </header>

                        <div className="space-y-4">
                            {shortlistedOrConfirmed.length === 0 ? (
                                <p className="text-sm text-gray-500">No shortlisted or confirmed applicants yet.</p>
                            ) : (
                                <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                                    <table className="min-w-[720px] text-left text-sm">
                                        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            <tr>
                                                <th className="px-4 py-3">Name</th>
                                                <th className="px-4 py-3">City</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Phone</th>
                                                <th className="px-4 py-3">Email</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {shortlistedOrConfirmed.map((person) => {
                                                const state = actionIndicators[`${gig.id}-${person.id}`];
                                                const statusLabel = state?.confirm ? "Confirmed" : "Shortlisted";
                                                const statusColor = state?.confirm ? "text-[#31A7AC]" : "text-[#FA6E80]";
                                                return (
                                                    <tr key={`${gig.id}-${person.id}`} className="text-gray-700">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                                                                    <Image
                                                                        src={person.avatar}
                                                                        alt={person.name}
                                                                        width={40}
                                                                        height={40}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{person.name}</p>
                                                                    <p className="text-xs text-gray-500">{person.skills.join(" | ")}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-600">{person.city}</td>
                                                        <td className={`px-4 py-3 font-semibold ${statusColor}`}>{statusLabel}</td>
                                                        <td className="px-4 py-3 font-medium text-gray-900">{person.phone}</td>
                                                        <td className="px-4 py-3 text-gray-600">{person.email}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
