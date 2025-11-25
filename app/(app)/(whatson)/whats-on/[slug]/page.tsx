import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ChevronLeft, Heart, Share2 } from "lucide-react";

import { getWhatsOnEventBySlug, whatsOnEvents } from "@/data/whatsOnEvents";
import { RSVP } from "../../components/rsvp";

type WhatsOnPageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    return whatsOnEvents.map((event) => ({ slug: event.slug }));
}

export default async function WhatsOnPage({ params }: WhatsOnPageProps) {
    const { slug } = await params;
    const event = getWhatsOnEventBySlug(slug);

    if (!event) {
        notFound();
    }

    return (
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 py-6">
            <div className="max-h-[calc(100vh-200px)] overflow-hidden px-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-5 mb-5">
                    <ChevronLeft className="h-4 w-4" />
                    <Link href="/whats-on" className="font-medium text-[#017A7C] hover:underline">
                        back to What&apos;s on
                    </Link>
                </div>

                <div className="flex flex-col gap-8 lg:flex-row">
                    <div className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-200px)]">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-4">
                                <span className="inline-flex items-center rounded-full bg-[#FFF3F5] px-3 py-1 text-sm font-semibold text-[#F8909D]">
                                    Hosted by {event.host.organization}
                                </span>
                                <h1 className="text-3xl font-semibold text-gray-900">{event.title}</h1>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Image
                                        src={event.host.avatar}
                                        alt={event.host.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full border border-gray-200"
                                    />
                                    <div className="leading-tight">
                                        <p className="text-base font-semibold text-gray-900">Hosted by {event.host.organization}</p>
                                        <p className="text-sm text-gray-500">{event.host.name}</p>
                                    </div>
                                </div>
                            </div>
                            {event.isPaid && (
                                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-[#F5A524] shadow-lg">
                                    $
                                </span>
                            )}
                        </div>

                        <div className="space-y-3 rounded-3xl px-6 py-5">
                            {event.schedule.map((slot, index) => (
                                <div key={`${slot.dateLabel}-${index}`} className="flex flex-col gap-1 text-sm text-gray-700 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2 font-medium text-gray-900">
                                        <Calendar className="h-4 w-4 text-[#017A7C]" />
                                        <span>{slot.dateLabel}</span>
                                    </div>
                                    <p className="text-gray-600">
                                        {slot.timeRange} · {slot.timezone}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">Details</h2>
                            {event.isPaid && (
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF7EC] px-4 py-2 text-sm font-semibold text-[#F5A524]">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-base">$</span>
                                    {event.priceLabel}
                                </div>
                            )}
                            <div className="space-y-3 text-sm leading-relaxed text-gray-700">
                                {event.description.map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-3 mb-5">
                            <h3 className="text-lg font-semibold text-gray-900">T&amp;Cs</h3>
                            <ol className="list-decimal space-y-2 pl-6 text-sm text-gray-700">
                                {event.terms.map((term, index) => (
                                    <li key={index}>{term}</li>
                                ))}
                            </ol>
                        </section>
                    </div>

                    <div className="flex w-full max-w-sm flex-col gap-6">
                        <div className="bg-white p-5 ">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <Image
                                    src={event.heroImage}
                                    alt={event.title}
                                    fill
                                    sizes="(min-width: 1024px) 384px, 100vw"
                                    className="object-cover grayscale rounded-3xl"
                                />
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-3">
                                <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#F56B7B]">
                                    <Heart className="h-5 w-5" />
                                </button>
                                <button type="button" className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:text-[#017A7C]">
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="mt-6">
                                <p className="text-sm font-semibold text-gray-900">Discover with Tags</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {event.tags.map((tag) => (
                                        <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-white rounded-full justify-between items-center max-h-[90px] px-6 py-2 flex flex-row shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-3.5">
                        <p className="text-sm text-gray-500">
                            RSVP by <span className="font-semibold text-gray-900">{event.rsvpBy}</span>
                        </p>
                        {event.isPaid && (
                            <div className="flex flex-row items-center gap-2 text-sm text-gray-500">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FCAF45] text-lg font-semibold text-white">$</span>
                                <span className="font-semibold text-gray-900">{event.priceLabel}</span>
                            </div>
                        )}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                </div>
                <RSVP event={event.schedule} />
            </footer>
        </section>
    );
}