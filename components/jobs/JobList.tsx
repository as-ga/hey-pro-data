"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, MapPinned, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

type Job = {
    id: number;
    title: string;
    description: string;
    datePosted: string;
    location: string;
    type: "project" | "gig";
};

type JobListProps = {
    jobs: Job[];
};

export default function JobList({ jobs }: JobListProps) {
    return (
        <div className="relative mt-8 mb-4 w-full basis-1/4 flex flex-col overflow-auto h-screen">
            <div className="relative p-1">
                <Input
                    type="text"
                    placeholder="Search for projects or GIGs"
                    className="h-14 rounded-full w-full pr-14 border-[1px] border-[#FA6E80]"
                />
                <Button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-[#FA6E80] hover:bg-[#f95569] text-white rounded-full flex items-center justify-center"
                >
                    <Search className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex-1 overflow-auto h-full mt-2 rounded-md ">
                <div className="grid grid-cols-1 w-full gap-6 pr-2">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-lg w-full">
                            <Link href={`/jobs/${job.type}/${job.id}`} className="hover:bg-gray-200 p-2 rounded-md block">
                                <Separator className="my-4" />
                                <div className="flex flex-row gap-4">
                                    <Image
                                        src={"/logo.png"}
                                        width={100}
                                        height={100}
                                        alt="Company Logo"
                                        className="h-10 w-10 rounded-full shadow-sm"
                                    />
                                    <h2 className="text-xl font-normal mb-2"> Dubai Fashion Week BTS</h2>
                                </div>
                                <div className="mb-3 gap-2 flex flex-col">
                                    <h2>{job.title}</h2>
                                    <p className="text-gray-600 mb-4">
                                        {job.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6 text-gray-500 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" />
                                        <span>{job.datePosted}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPinned className="h-4 w-4" />
                                        <span>Location: {job.location}</span>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
