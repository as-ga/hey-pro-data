"use client"
import JobList from "@/components/jobs/JobList";
import React from "react"

export default function JobsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const jobs1 = [
        {
            id: 1,
            title: "Camera Operator",
            description:
                "We are looking for a skilled camera operator to join our team. You will be responsible for capturing high-quality video footage.",
            datePosted: "2024-10-01",
            location: "United States San Francisco, CA",
            type: "project" as "project" | "gig",
        },
        {
            id: 2,
            title: "Video Editor",
            description:
                "We are seeking a skilled video editor to join our team. You will be responsible for editing and producing high-quality video content.",
            datePosted: "2024-09-28",
            location: "New York, NY",
            type: "gig" as "project" | "gig",
        },
        {
            id: 3,
            title: "Sound Engineer",
            description:
                "We are looking for a talented sound engineer to join our team. You will be responsible for recording, mixing, and mastering audio for various projects.",
            datePosted: "2024-09-25",
            location: "Los Angeles, CA",
            type: "project" as "project" | "gig",
        },
        {
            id: 4,
            title: "Production Assistant",
            description:
                "We are seeking a motivated production assistant to support our team. You will assist with various tasks on set and in the office.",
            datePosted: "2024-09-20",
            location: "Chicago, IL",
            type: "gig" as "project" | "gig",
        },
        {
            id: 5,
            title: "Director of Photography",
            description:
                "We are looking for an experienced director of photography to lead our cinematography team. You will be responsible for overseeing the visual aspects of our projects.",
            datePosted: "2024-09-15",
            location: "Miami, FL",
            type: "project" as "project" | "gig",
        },
        {
            id: 6,
            title: "Gaffer",
            description:
                "We are seeking a skilled gaffer to join our lighting team. You will be responsible for setting up and operating lighting equipment on set.",
            datePosted: "2024-09-10",
            location: "Austin, TX",
            type: "gig" as "project" | "gig",
        },
        {
            id: 7,
            title: "Script Supervisor",
            description:
                "We are looking for a detail-oriented script supervisor to join our team. You will be responsible for ensuring continuity and accuracy during filming.",
            datePosted: "2024-09-05",
            location: "Seattle, WA",
            type: "project" as "project" | "gig",
        },
        {
            id: 8,
            title: "Location Scout",
            description:
                "We are seeking a creative location scout to find and secure filming locations for our projects. You will work closely with the production team to identify suitable sites.",
            datePosted: "2024-09-01",
            location: "Boston, MA",
            type: "gig" as "project" | "gig",
        },
        {
            id: 9,
            title: "VFX Artist",
            description:
                "We are looking for a talented VFX artist to join our team. You will be responsible for creating visual effects and animations for our projects.",
            datePosted: "2024-08-28",
            location: "Denver, CO",
            type: "project" as "project" | "gig",
        },
        {
            id: 10,
            title: "Colorist",
            description:
                "We are seeking a skilled colorist to join our team. You will be responsible for color grading and color correction for our projects.",
            datePosted: "2024-08-25",
            location: "Portland, OR",
            type: "gig" as "project" | "gig",
        },
    ];

    return (
        <>
            <div className="h-screen overflow-hidden mx-auto px-6 flex flex-row justify-around gap-04 max-w-[1400px]">
                <JobList jobs={jobs1} />

                {/* Vertical separator between columns */}
                <div className="w-px self-stretch bg-gray-200"></div>

                {/* Right: larger column */}
                <div className="w-full basis-2/3 h-full">
                    <div className="h-full w-full rounded-md overflow-hidden">
                        <div className="p-4 mt-12">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
