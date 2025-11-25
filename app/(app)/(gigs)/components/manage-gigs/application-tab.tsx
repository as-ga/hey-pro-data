import { CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { gigsData } from "@/data/gigs";

import { sampleApplicants } from "./sample-data";

type ApplicationTabProps = {
    selectedGigIds: string[];
};

export function ApplicationTab({ selectedGigIds }: ApplicationTabProps) {
    const selectedGigs = gigsData.filter((gig) => selectedGigIds.includes(gig.id));

    if (!selectedGigs.length) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Select gigs to review applications</CardTitle>
                    <CardDescription>
                        Choose at least one gig in the Gigs tab to see its applicants here.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            {selectedGigs.map((gig) => (
                <section key={gig.id} className="space-y-4 rounded-3xl bg-white p-4 shadow-sm sm:p-6">
                    <header className="space-y-3">
                        <div className="flex flex-wrap gap-3">
                            <Button className="bg-[#FFE9ED] text-[#FA6E80] hover:bg-[#ffd3da]">
                                See referrals
                            </Button>
                            <Button className="bg-[#FA6E80] text-white hover:bg-[#f9586d]">
                                Invite crew for this Gig
                            </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <p className="text-lg font-semibold text-gray-900">{gig.title}</p>
                            <span className="flex items-center gap-1 text-gray-700">
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
                        </div>
                    </header>

                    <div className="overflow-hidden rounded-2xl border border-gray-100">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-50 text-left text-gray-500">
                                <tr>
                                    <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                                    <th className="px-4 py-3 font-medium text-gray-700">City</th>
                                    <th className="px-4 py-3 font-medium text-gray-700">Skill Set</th>
                                    <th className="px-4 py-3 font-medium text-gray-700">Credits</th>
                                    <th className="px-4 py-3 font-medium text-gray-700">Referrals</th>
                                    <th className="px-4 py-3 font-medium text-gray-700">Chat</th>
                                    <th className="px-4 py-3 font-medium text-gray-700">Release</th>
                                    <th className="px-4 py-3 font-medium text-gray-700">Shortlist</th>
                                    <th className="px-4 py-3 font-medium text-gray-700">Confirm</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {sampleApplicants.map((person) => (
                                    <tr key={`${gig.id}-${person.id}`} className="text-gray-800">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gray-200" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{person.name}</p>
                                                    <p className="text-xs text-gray-500">{gig.title}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-[#27B4BC]">{person.city}</td>
                                        <td className="px-4 py-3">{person.skills.join(" | ")}</td>
                                        <td className="px-4 py-3 text-[#27B4BC]">{person.credits}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex -space-x-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#27B4BC]/20 text-xs font-semibold text-[#27B4BC]">
                                                    {person.referrals}
                                                </div>
                                                <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-600">
                                                💬
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FFE9ED] text-[#FA6E80]">
                                                ✕
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#27B4BC] text-[#27B4BC]">
                                                +
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#27B4BC] text-white">
                                                ✓
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ))}
        </div>
    );
}
