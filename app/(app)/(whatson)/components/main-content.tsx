"use client";

import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import Link from "next/link";

import { whatsOnEvents } from "@/data/whatsOnEvents";

const EventCard = ({ event }: { event: typeof whatsOnEvents[number] }) => {
    const dateLabel = event.dateRangeLabel;
    return (
        <>
            <Link
                href={`/whats-on/${event.slug}`}
                className="flex shrink flex-col overflow-hidden rounded-[32px] border border-gray-100 p-4 transition-all max-[280px]:gap-2 max-[280px]:rounded-2xl max-[280px]:p-3">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl max-[280px]:aspect-[5/4] max-[280px]:rounded-xl">
                    <Image
                        src={event.thumbnail}
                        alt={event.title}
                        fill
                        sizes="(min-width: 1280px) 300px, (min-width: 768px) 50vw, 100vw"
                        className="object-cover grayscale bg-transparent"
                    />
                    <div className="absolute inset-x-4 bottom-4 inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-gray-700 shadow backdrop-blur max-[280px]:inset-x-3 max-[280px]:bottom-3 max-[280px]:gap-1.5 max-[280px]:text-[11px]">
                        <Calendar className="h-4 w-4 text-[#017A7C]" />
                        <span>{dateLabel}</span>
                    </div>
                </div>
                <div className="flex w-full flex-col items-start px-2 pb-1 pt-2 text-gray-700 max-[280px]:px-1">
                    <h3 className="text-[15px] font-[400] text-gray-900 max-[280px]:text-[13px]">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 max-[280px]:text-xs">
                        <MapPin className="h-4 w-4 text-[#017A7C]" />
                        <span>{event.location}</span>
                    </div>
                    <div className="flex w-full items-center justify-between px-1 py-2 text-sm text-gray-500 whitespace-nowrap max-[280px]:px-0 max-[280px]:text-xs">
                        <span>
                            Posted by <span className="font-400 text-gray-800 max-[280px]:text-[11px]">{event.host.name}</span>
                        </span>
                        {event.isPaid && (
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FCAF45] text-lg font-semibold text-white shadow-lg max-[280px]:h-8 max-[280px]:w-8 max-[280px]:text-base">
                                $
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </>
    );
};

export default function WhatsOnMainContent() {
    return (
        <section className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {whatsOnEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </section>
    );
}