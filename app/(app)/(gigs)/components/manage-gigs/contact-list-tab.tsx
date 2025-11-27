import Image from "next/image";

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

import { contactGroups } from "./sample-data";
import { gigsData } from "@/data/gigs";

type ContactListTabProps = {
    selectedGigIds: string[];
};

export function ContactListTab({ selectedGigIds }: ContactListTabProps) {
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
            {selectedGigs.map((gig) => (
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

                    <div className="space-y-6">
                        {contactGroups.map((group) => (
                            <div key={`${gig.id}-${group.id}`} className="overflow-x-auto rounded-2xl border border-gray-200">
                                <div className="min-w-[720px]">
                                    <div className="grid grid-cols-[160px_1fr] border-b border-gray-200 bg-gray-50 text-base">
                                        <p className="px-4 py-3 font-semibold text-gray-900">Department</p>
                                        <p className="px-4 py-3 text-gray-700">{group.department}</p>
                                    </div>
                                    <div className="grid grid-cols-[160px_1fr] border-b border-gray-200 bg-white text-base">
                                        <p className="px-4 py-3 font-semibold text-gray-900">Role</p>
                                        <p className="px-4 py-3 text-gray-700">{group.summary}</p>
                                    </div>
                                    <div className="grid grid-cols-[160px_repeat(4,minmax(0,1fr))] bg-gray-50 text-sm font-semibold text-gray-900">
                                        <p className="px-4 py-3">Role</p>
                                        <p className="px-4 py-3">Company</p>
                                        <p className="px-4 py-3">Name</p>
                                        <p className="px-4 py-3">Phone</p>
                                        <p className="px-4 py-3">Email ID</p>
                                    </div>
                                    {group.entries.map((entry, index) => (
                                        <div
                                            key={`${group.id}-${entry.person.id}-${index}`}
                                            className="grid grid-cols-[160px_repeat(4,minmax(0,1fr))] border-t border-gray-200 bg-white text-sm text-gray-700"
                                        >
                                            <p className="px-4 py-4 text-gray-600">{entry.role}</p>
                                            <p className="px-4 py-4 text-gray-600">{entry.company}</p>
                                            <div className="flex items-center gap-3 px-4 py-4">
                                                <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                                                    <Image
                                                        src={entry.person.avatar}
                                                        alt={entry.person.name}
                                                        width={40}
                                                        height={40}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{entry.person.name}</p>
                                                    <p className="text-xs text-gray-500">{entry.person.city}</p>
                                                </div>
                                            </div>
                                            <p className="px-4 py-4 font-medium text-gray-900">{entry.person.phone}</p>
                                            <p className="px-4 py-4 text-gray-600">{entry.person.email}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
