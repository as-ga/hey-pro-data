"use client";
import { ChevronDown, ChevronUp, Filter, Search, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";
const toSlug = (s: string) =>
    s
        .toLowerCase()
        .replace(/[\|\(\)]/g, "") // remove | and parentheses
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

type FilterValue = { label: string; href: string };
type FilterOption = { label: string; value: FilterValue[] };

const makeValues = (arr: string[]): FilterValue[] =>
    arr.map(label => ({ label, href: `/explore/${toSlug(label)}` }));

const filterOptions: FilterOption[] = [
    {
        label: "Director",
        value: makeValues([
            "Director",
            "Director | Commercial",
            "Assistant Director",
            "Assistant Director | TV",
            "1st Assistant Director (1st AD)",
            "2nd Assistant Director (2nd AD)",
            "3rd Assistant Director (3rd AD)",
            "Assistant Director"
        ])
    },
    {
        label: "Cinematographer",
        value: makeValues([
            "Cinematographer",
            "Director of Photography (DP)",
            "Camera Operator",
            "1st AC (Focus Puller)",
            "2nd AC (Clapper Loader)",
            "Digital Imaging Technician (DIT)",
            "Steadicam Operator",
            "Gimbal Operator",
            "Drone Operator",
            "Camera Trainee"
        ])
    },
    {
        label: "Editor",
        value: makeValues([
            "Editor",
            "Assistant Editor",
            "Colorist",
            "VFX Artist",
            "Motion Graphics Designer",
            "Sound Editor",
            "Sound Designer",
            "Foley Artist",
            "Re-Recording Mixer"
        ])
    },
    {
        label: "Producer",
        value: makeValues([
            "Producer",
            "Executive Producer",
            "Line Producer",
            "Production Manager",
            "Production Coordinator",
            "Production Assistant"
        ])
    },
    {
        label: "Writer",
        value: makeValues(["Writer", "Screenwriter", "Script Supervisor", "Story Editor"])
    },
    {
        label: "Production Designer",
        value: makeValues([
            "Production Designer",
            "Art Director",
            "Set Designer",
            "Set Decorator",
            "Props Master",
            "Costume Designer",
            "Makeup Artist",
            "Hair Stylist"
        ])
    },
    {
        label: "Sound Designer",
        value: makeValues([
            "Sound Designer",
            "Sound Mixer",
            "Boom Operator",
            "Location Sound Recordist"
        ])
    },
    {
        label: "Camera Operator",
        value: makeValues([
            "Camera Operator",
            "Steadicam Operator",
            "Gimbal Operator",
            "Drone Operator"
        ])
    },
    {
        label: "Gaffer",
        value: makeValues([
            "Gaffer",
            "Key Gaffer",
            "Best Boy Gaffer",
            "Gimbal Gaffer",
            "Drone Gaffer",
            "3rd AC (Grip)",
            "2nd AC (Grip)",
            "1st AC (Grip)"
        ])
    },
    {
        label: "Location Scout",
        value: makeValues([
            "Location Scout",
            "Location Assistant",
            "Location Assistant (LA)",
            "Location Assistant (LA) | Commercial",
            "Location Assistant (LA) | TV"
        ])
    },
    {
        label: "VFX Artist",
        value: makeValues([
            "VFX Artist",
            "VFX Supervisor",
            "VFX Assistant",
            "VFX Assistant (VA)",
            "VFX Assistant (VA) | Commercial",
            "VFX Assistant (VA) | TV"
        ])
    },
    {
        label: "Colorist",
        value: makeValues([
            "Colorist",
            "Color Timer",
            "Colorist (Color Grading)",
            "Colorist (Color Correction)"
        ])
    },
    {
        label: "Sound Engineer",
        value: makeValues([
            "Sound Engineer",
            "Sound Technician",
            "Sound Engineer | Commercial",
            "Sound Engineer | TV"
        ])
    },
    {
        label: "Makeup Artist",
        value: makeValues([
            "Makeup Artist",
            "Makeup Artist | Commercial",
            "Makeup Artist | TV"
        ])
    },
    {
        label: "Other",
        value: makeValues([
            "Other",
            "Other | Commercial",
            "Other | TV",
            "Other | Commercial | TV"
        ])
    }
];

const experienceOptions = [
    { title: "Intern", description: "helped on set, shadowed role" },
    { title: "Learning | Assisted", description: "assisted the role under supervision" },
    { title: "Competent | Independent", description: "can handle role solo" },
    { title: "Expert | Lead", description: "leads team, multiple projects" },
];

const initialFilterState = {
    keyword: "",
    availability: "available",
    productionType: "",
    location: "UAE, Dubai",
    experience: "",
    minRate: 900,
    maxRate: 3000,
};

export default function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);
    const [filterForm, setFilterForm] = React.useState<typeof initialFilterState>(initialFilterState);

    const handleFilterChange = (field: keyof typeof initialFilterState, value: string | number) => {
        setFilterForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Applied filters:", filterForm);
    };
    return (
        <>
            <div className="">
                <span className="bg-gradient-to-r from-[#FA6E80] via-[#6A89BE] to-[#31A7AC] bg-clip-text text-transparent text-3xl font-semibold">Crew Directory</span>
                <div className="flex flex-row justify-center items-center space-x-4 mt-4 mb-6 w-full">
                    <div
                        className={`flex items-center justify-center space-x-2 h-[48px] border rounded-full px-4 py-2 cursor-pointer transition-all ${isFilterOpen ? 'w-[300px] bg-[#FA6E80]' : 'w-[150px] bg-[#f7f7f700] border-[#FA6E80] '}`}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <button className={`text-sm font-medium ${isFilterOpen ? 'text-white' : 'text-[#FA6E80]'}`}>Filter (<span>{"3"}</span>)</button>
                        <Filter className={`h-5 w-5 ${isFilterOpen ? 'text-white' : 'text-[#FA6E80]'}`} />
                    </div>
                    <div className="flex flex-row border rounded-full px-4 py-2 justify-center items-center h-[48px] w-[960px]">
                        <input
                            placeholder="Search by name, role, or department..."
                            className="w-full border-none outline-none focus:ring-0 text-sm"
                            onChange={(e) => console.log(e.target.value)} // Add onChange handler
                        />
                        <span className="flex items-center justify-center border rounded-full h-[34px] w-[34px] bg-[#FA6E80]">
                            <Search className="h-5 w-5 text-white" />
                        </span>
                    </div>

                </div>
                <div className="flex flex-row w-full">
                    <div className="h-screen max-w-[280px] w-full overflow-y-auto p-4 space-y-2">
                        {isFilterOpen && (
                            <form onSubmit={handleFilterSubmit} className="space-y-5 border rounded-xl bg-white p-4 text-[#017A7C]">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Availability</label>
                                    <select
                                        value={filterForm.availability}
                                        onChange={(e) => handleFilterChange("availability", e.target.value)}
                                        className="w-full rounded-full border border-[#017A7C]/30 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#31A7AC]"
                                    >
                                        <option value="available">Available</option>
                                        <option value="not_available">Not Available</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Production Types</label>
                                    <select
                                        value={filterForm.productionType}
                                        onChange={(e) => handleFilterChange("productionType", e.target.value)}
                                        className="w-full rounded-xl border border-[#017A7C]/30 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#31A7AC]"
                                    >
                                        <option value="">Select production type</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="tv">TV</option>
                                        <option value="film">Film</option>
                                        <option value="social">Social / Digital</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Location</label>
                                    <div className="flex items-center gap-2 rounded-xl border border-[#017A7C]/30 px-4 py-2">
                                        <MapPin className="h-4 w-4 text-[#017A7C]" />
                                        <input
                                            value={filterForm.location}
                                            onChange={(e) => handleFilterChange("location", e.target.value)}
                                            className="w-full border-none text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-semibold">Experience</label>
                                        <ChevronDown className="h-4 w-4 text-[#017A7C]" />
                                    </div>
                                    <div className="space-y-3 rounded-xl border border-[#017A7C]/20 px-4 py-3">
                                        {experienceOptions.map((exp) => (
                                            <button
                                                key={exp.title}
                                                type="button"
                                                onClick={() => handleFilterChange("experience", exp.title)}
                                                className={`w-full text-left text-sm ${filterForm.experience === exp.title ? "text-[#017A7C] font-semibold" : "text-gray-700"}`}
                                            >
                                                <div>{exp.title}</div>
                                                <div className="text-xs text-gray-500">{exp.description}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm font-semibold text-gray-700">Rate Range</p>
                                    <div className="flex items-center justify-between text-sm font-semibold">
                                        <span className="text-[#FA6E80]">{filterForm.minRate}</span>
                                        <span className="text-[#31A7AC]">{filterForm.maxRate}</span>
                                    </div>
                                    <div className="relative pt-2">
                                        <input
                                            type="range"
                                            min={0}
                                            max={5000}
                                            value={filterForm.minRate}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (value < filterForm.maxRate) {
                                                    handleFilterChange("minRate", value);
                                                }
                                            }}
                                            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#FA6E80] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#FA6E80] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                                            style={{ zIndex: 3 }}
                                        />
                                        <input
                                            type="range"
                                            min={0}
                                            max={5000}
                                            value={filterForm.maxRate}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (value > filterForm.minRate) {
                                                    handleFilterChange("maxRate", value);
                                                }
                                            }}
                                            className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#31A7AC] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#31A7AC] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                                            style={{ zIndex: 4 }}
                                        />
                                        <div className="relative w-full h-2 bg-gray-200 rounded-full">
                                            <div
                                                className="absolute h-2 bg-gradient-to-r from-[#FA6E80] to-[#31A7AC] rounded-full"
                                                style={{
                                                    left: `${(filterForm.minRate / 5000) * 100}%`,
                                                    right: `${100 - (filterForm.maxRate / 5000) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-full bg-[#31A7AC] py-2 text-sm font-semibold text-white hover:bg-[#279497]"
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 rounded-full border border-[#31A7AC] py-2 text-sm font-semibold text-[#31A7AC]"
                                        onClick={() => setFilterForm({ ...initialFilterState })}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        )}
                        {filterOptions.map(opt => (
                            <details key={opt.label} className="group border rounded-md bg-white">
                                <summary className="cursor-pointer select-none flex items-center justify-between px-3 py-2 text-sm font-medium">
                                    <span>{opt.label}</span>
                                    <span>
                                        <span className="group-open:hidden"><ChevronUp className="h-4 w-4 text-[#FA6E80]" /></span>
                                        <span className="hidden group-open:inline"><ChevronDown className="h-4 w-4 text-[#FA6E80]" /></span>
                                    </span>
                                </summary>
                                <ul className="px-3 pb-2 space-y-1">
                                    {opt.value.map(v => (
                                        <li key={v.label}>
                                            <Link
                                                href={v.href}
                                                className="text-xs text-[#017A7C] hover:text-[#FA6E80] cursor-pointer block py-1"
                                            >
                                                {v.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </details>
                        ))
                        }
                    </div>
                    <div className=" h-screen w-full overflow-y-auto">{children}</div>
                </div>

            </div>
        </>
    )
}