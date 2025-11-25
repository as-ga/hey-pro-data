"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Ticket, Users } from "lucide-react";

import { whatsOnEvents } from "@/data/whatsOnEvents";

const attendeeAvatars = ["/image (1).png", "/image (2).png", "/image (3).png"];

const formatSpots = (id: string) => {
    const total = 150;
    const filled = 90 + (parseInt(id) * 7) % 40; // simple spread so cards feel varied
    return { filled, total };
};

const ManageCard = ({ event }: { event: (typeof whatsOnEvents)[number] }) => {
    const { filled, total } = formatSpots(event.id);
    return (
        <Link href={`/whats-on/manage-whats-on/${event.id}`} className="flex flex-col gap-6 rounded-[32px] border border-[#EAECF0] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] md:flex-row">
            <div className="relative overflow-hidden rounded-[28px] bg-[#F2F4F7] md:min-w-[260px]">
                <Image src={event.thumbnail} alt={event.title} width={320} height={320} className="h-full w-full object-cover" />
                {event.isPaid && (
                    <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#FEC84B] text-sm font-semibold text-gray-900">
                        $
                    </span>
                )}
            </div>
            <div className="flex flex-1 flex-col gap-4 text-gray-700">
                <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-600">
                    <Ticket className="h-4 w-4" />
                    {filled}/{total} Spots
                    <span className="ml-auto text-xs font-normal uppercase tracking-wide text-gray-400">{event.location}</span>
                </div>
                <div>
                    <h3 className="text-2xl font-semibold text-gray-900">{event.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{event.description[0]}</p>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                    {event.schedule.map((slot, index) => (
                        <div key={`${slot.dateLabel}-${index}`} className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {slot.dateLabel} • {slot.timeRange} {slot.timezone}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-3">
                            {attendeeAvatars.map((avatar, index) => (
                                <Image key={`${avatar}-${index}`} src={avatar} alt="Attendee" width={32} height={32} className="rounded-full border-2 border-white object-cover" unoptimized />
                            ))}
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                            <Users className="h-4 w-4" />
                            295 Attending
                        </div>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                        RSVP by <span className="font-semibold text-gray-800">{event.rsvpBy}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default function ManageWhatsOnPage() {
    return (
        <div className="space-y-10">
            <div className="flex flex-row items-center justify-between">
                <span className="bg-gradient-to-r from-[#FA6E80] via-[#6A89BE] to-[#31A7AC] bg-clip-text text-transparent text-3xl font-semibold">{"Manage What's On"}</span>
                <Link href="/whats-on/manage-whats-on/add-new" className="ml-2 rounded-[10px] border bg-[#31A7AC] px-4 py-2 text-white"> Create What’s on</Link>
            </div>
            <section className="space-y-6">
                {whatsOnEvents.map((event) => (
                    <ManageCard key={event.id} event={event} />
                ))}
            </section>
        </div>
    );
}