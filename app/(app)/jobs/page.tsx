/** @format */

"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { CalendarIcon, MapPinned, Search, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function Jobs() {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 3) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);

        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, []);
    const jobs = [
        {
            id: 1,
            title: "Camera Operator",
            description:
                "We are looking for a skilled camera operator to join our team. You will be responsible for capturing high-quality video footage.",
            datePosted: "2024-10-01",
            location: "United States San Francisco, CA",
            type: "project"
        },
        {
            id: 2,
            title: "Video Editor",
            description:
                "We are seeking a skilled video editor to join our team. You will be responsible for editing and producing high-quality video content.",
            datePosted: "2024-09-28",
            location: "New York, NY",
            type: "gig"
        },
        {
            id: 3,
            title: "Sound Engineer",
            description:
                "We are looking for a talented sound engineer to join our team. You will be responsible for recording, mixing, and mastering audio for various projects.",
            datePosted: "2024-09-25",
            location: "Los Angeles, CA",
            type: "project"
        },
        {
            id: 4,
            title: "Production Assistant",
            description:
                "We are seeking a motivated production assistant to support our team. You will assist with various tasks on set and in the office.",
            datePosted: "2024-09-20",
            location: "Chicago, IL",
            type: "gig"
        },
        {
            id: 5,
            title: "Director of Photography",
            description:
                "We are looking for an experienced director of photography to lead our cinematography team. You will be responsible for overseeing the visual aspects of our projects.",
            datePosted: "2024-09-15",
            location: "Miami, FL",
            type: "project"
        },
        {
            id: 6,
            title: "Gaffer",
            description:
                "We are seeking a skilled gaffer to join our lighting team. You will be responsible for setting up and operating lighting equipment on set.",
            datePosted: "2024-09-10",
            location: "Austin, TX",
            type: "gig"
        },
        {
            id: 7,
            title: "Script Supervisor",
            description:
                "We are looking for a detail-oriented script supervisor to join our team. You will be responsible for ensuring continuity and accuracy during filming.",
            datePosted: "2024-09-05",
            location: "Seattle, WA",
            type: "project"
        },
        {
            id: 8,
            title: "Location Scout",
            description:
                "We are seeking a creative location scout to find and secure filming locations for our projects. You will work closely with the production team to identify suitable sites.",
            datePosted: "2024-09-01",
            location: "Boston, MA",
            type: "gig"
        },
        {
            id: 9,
            title: "VFX Artist",
            description:
                "We are looking for a talented VFX artist to join our team. You will be responsible for creating visual effects and animations for our projects.",
            datePosted: "2024-08-28",
            location: "Denver, CO",
            type: "project"
        },
        {
            id: 10,
            title: "Colorist",
            description:
                "We are seeking a skilled colorist to join our team. You will be responsible for color grading and color correction for our projects.",
            datePosted: "2024-08-25",
            location: "Portland, OR",
            type: "gig"
        },
    ];
    return (
        <>
            <div className="max-w-7xl mx-auto">
                <div className="relative mx-auto mt-3 mb-4 max-w-3xl w-full">
                    <div className="relative float">
                        <Input
                            type="text"
                            placeholder="Search for projects or GIGs"
                            className="h-14 rounded-full w-full pr-14  border-[1px]  border-[#FA6E80]"
                        />
                        <Button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-[#FA6E80] hover:bg-[#f95569] text-white rounded-full flex items-center justify-center"
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="grid grid-cols-1  gap-6 p-4 overflow-auto h-screen">
                        {/* Example job cards */}
                        {jobs.map((job) => (

                            <Link
                                href={`/jobs/project/${job.id}`}
                                key={job.id}
                                className="bg-white  rounded-lg p-4"
                            >
                                <Separator className="my-4" />
                                <div className="flex flex-row gap-4">
                                    <Image
                                        src={"/logo.png"}
                                        width={100}
                                        height={100}
                                        alt="Company Logo"
                                        className="h-10 w-10 rounded-full shadow-sm"
                                    />
                                    <h2 className="text-xl font-normal mb-2">
                                        Dubai Fashion Week BTS
                                    </h2>
                                </div>
                                <div className=" mb-3 gap-2 flex flex-col">
                                    <h2>{job.title}</h2>
                                    <p className="text-gray-600 mb-4">{job.description}</p>
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
                        ))}
                    </div>
                </div>

                <div></div>
                {isVisible && (
                    <Button
                        onClick={scrollToTop}
                        className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-[#FA6E80] hover:bg-[#f95569] text-white shadow-lg transition-opacity duration-300"
                    >
                        <ArrowUp className="h-6 w-6" />
                    </Button>
                )}
            </div>
        </>
    );
}
