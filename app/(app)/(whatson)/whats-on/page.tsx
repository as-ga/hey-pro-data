"use client";
import { Calendar, ChevronDown, Filter, MapPin, Search } from "lucide-react";
import Link from "next/link";
import React from "react";
import WhatsOnMainContent from "../components/main-content";
const initialFilterState = {
    price: "free",
    relevance: true,
    eventType: "",
    eventStatus: "",
    monthLabel: "Sep, 2025",
    location: "UAE, Dubai",
    attendance: "online",
    highlightedSingles: [1, 2, 4, 17],
    highlightedRange: [13, 14, 15, 16],
};

export default function WhatsOnHeader() {
    const [isFilterOpen, setIsFilterOpen] = React.useState(false);
    const [filterForm, setFilterForm] = React.useState<typeof initialFilterState>(initialFilterState);

    const handleFilterChange = (field: keyof typeof initialFilterState, value: string | number | boolean | number[]) => {
        setFilterForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Applied filters:", filterForm);
    };

    const calendarDays = React.useMemo(() => {
        const year = 2025;
        const monthIndex = 8; // September
        const firstDay = new Date(year, monthIndex, 1).getDay();
        const totalDays = new Date(year, monthIndex + 1, 0).getDate();
        const leadingSpaces = (firstDay + 6) % 7; // shift so week starts on Monday
        return Array.from({ length: leadingSpaces + totalDays }, (_, index) => {
            const dayNumber = index - leadingSpaces + 1;
            return dayNumber > 0 ? dayNumber : null;
        });
    }, []);

    const rangeSet = React.useMemo(() => new Set(filterForm.highlightedRange), [filterForm.highlightedRange]);
    const singleSet = React.useMemo(() => new Set(filterForm.highlightedSingles), [filterForm.highlightedSingles]);

    const gradientDivider = <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-[#FA6E80] via-[#6A89BE] to-[#31A7AC]" />;

    const getRangeClasses = (day: number | null) => {
        if (!day || (!rangeSet.has(day) && !singleSet.has(day))) return "";
        if (singleSet.has(day)) return "bg-[#1AA0A2] text-white rounded-full";
        const isRangeStart = !rangeSet.has(day - 1);
        const isRangeEnd = !rangeSet.has(day + 1);
        const rounded = `${isRangeStart ? "rounded-l-full" : ""} ${isRangeEnd ? "rounded-r-full" : ""}`.trim();
        return `bg-[#1AA0A2] text-white ${rounded}`.trim();
    };

    const toggleSingleDay = (day: number) => {
        handleFilterChange(
            "highlightedSingles",
            singleSet.has(day)
                ? filterForm.highlightedSingles.filter((d) => d !== day)
                : [...filterForm.highlightedSingles, day]
        );
    };

    const resetForm = () => setFilterForm(initialFilterState);
    return (
        <>
            <div className="">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:items-center sm:justify-between justify-start">
                    <span className="bg-gradient-to-r from-[#FA6E80] via-[#6A89BE] to-[#31A7AC] bg-clip-text text-transparent text-3xl font-semibold">{"What's On"}</span>
                    <Link href="/whats-on/manage-whats-on" className="ml-2 text-white bg-[#31A7AC] border rounded-[10px] sm:w-auto w-[192px] px-4 py-2 "> <span className="text-[16px] font-[400]">Manage What’s On</span></Link>
                </div>

                <div className="flex sm:flex-row mx-auto flex-row-reverse justify-center w-[354px] items-center gap-0.5 space-x-4 mt-4 mb-6 sm:w-full">
                    <div
                        className={`flex items-center justify-center space-x-2 h-[48px] w-[111px] border rounded-full px-4 py-2 cursor-pointer transition-all ${isFilterOpen ? 'w-[300px] bg-[#FA6E80]' : 'w-[150px] bg-[#f7f7f700] border-[#FA6E80] '}`}
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <button className={`text-sm font-medium ${isFilterOpen ? 'text-white' : 'text-[#FA6E80]'}`}>Filter (<span>{"3"}</span>)</button>
                        <Filter className={`h-5 w-5 ${isFilterOpen ? 'text-white' : 'text-[#FA6E80]'}`} />
                    </div>
                    <div className="flex flex-row border rounded-full px-1 py-2 justify-between items-center h-[48px] w-[230px] sm:w-[960px]">
                        <input
                            placeholder="Search by name, role, or department..."
                            className=" px-2 border-none outline-none focus:ring-0 text-sm bg-transparent"
                            onChange={(e) => console.log(e.target.value)}
                        />
                        <span className="relative flex items-center justify-center border rounded-full h-[34px] w-[34px] bg-[#FA6E80]">
                            <Search className="h-5 w-5 text-white" />
                        </span>
                    </div>

                </div>
                <div className="flex flex-col sm:flex-row w-full">
                    {isFilterOpen && (
                        <div className="h-screen max-w-[280px] w-full overflow-y-auto p-4 space-y-2">
                            <form onSubmit={handleFilterSubmit} className="space-y-5 rounded-[10px] border bg-white p-4 text-[#017A7C] shadow-sm">
                                <div className="flex gap-3">
                                    {["free", "paid"].map((price) => (
                                        <button
                                            key={price}
                                            type="button"
                                            onClick={() => handleFilterChange("price", price)}
                                            className={`flex-1 rounded-[10px] border px-4 py-2 text-sm font-semibold ${filterForm.price === price ? "border-[#FA6E80] text-[#FA6E80] bg-[#FFE5EA]" : "border-[#FA6E80]/40 text-gray-500"}`}
                                        >
                                            {price === "free" ? "Free" : "Paid"}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleFilterChange("relevance", !filterForm.relevance)}
                                    className={`w-full rounded-[10px] border px-4 py-2 text-left text-sm font-semibold ${filterForm.relevance ? "border-[#FA6E80] text-[#FA6E80]" : "border-[#FA6E80]/40 text-gray-500"}`}
                                >
                                    Relevant to you <span className="text-xs font-normal text-gray-500">(beta)</span>
                                </button>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Event Type</label>
                                    <div className="relative">
                                        <select
                                            value={filterForm.eventType}
                                            onChange={(e) => handleFilterChange("eventType", e.target.value)}
                                            className="w-full appearance-none rounded-[10px] border border-[#017A7C]/30 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#31A7AC]"
                                        >
                                            <option value="">Select Event Type</option>
                                            <option value="screening">Screening</option>
                                            <option value="festival">Festival</option>
                                            <option value="masterclass">Masterclass</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FA6E80]" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Event Status</label>
                                    <div className="relative">
                                        <select
                                            value={filterForm.eventStatus}
                                            onChange={(e) => handleFilterChange("eventStatus", e.target.value)}
                                            className="w-full appearance-none rounded-[10px] border border-[#017A7C]/30 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#31A7AC]"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="upcoming">Upcoming</option>
                                            <option value="ongoing">Ongoing</option>
                                            <option value="ended">Past</option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FA6E80]" />
                                    </div>
                                </div>

                                {gradientDivider}

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm font-semibold">
                                        <span>{filterForm.monthLabel}</span>
                                        <Calendar className="h-4 w-4 text-[#FA6E80]" />
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#FA6E80]">
                                        {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                                            <span key={day}>{day}</span>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-sm">
                                        {calendarDays.map((day, index) => (
                                            <button
                                                key={`${day ?? "blank"}-${index}`}
                                                type="button"
                                                disabled={!day}
                                                onClick={() => day && toggleSingleDay(day)}
                                                className={`flex h-9 w-full items-center justify-center rounded-[10px] text-center ${day ? "text-[#017A7C]" : "text-transparent"} ${getRangeClasses(day)} ${!day ? "cursor-default" : "hover:border-[#FA6E80]/40"}`}
                                            >
                                                {day ?? ""}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {gradientDivider}

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold">Location</label>
                                    <div className="flex items-center gap-2 rounded-2xl border border-[#017A7C]/30 px-4 py-2">
                                        <input
                                            value={filterForm.location}
                                            onChange={(e) => handleFilterChange("location", e.target.value)}
                                            className="w-full border-none text-sm outline-none"
                                        />
                                        <MapPin className="h-4 w-4 text-[#31A7AC]" />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    {["online", "in-person"].map((mode) => (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => handleFilterChange("attendance", mode)}
                                            className={`flex-1 rounded-[10px] border px-4 py-2 text-sm font-semibold ${filterForm.attendance === mode ? "border-[#FA6E80] text-[#FA6E80] bg-[#FFE5EA]" : "border-[#FA6E80]/40 text-gray-500"}`}
                                        >
                                            {mode === "online" ? "Online" : "In-person"}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-3 pt-1">
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-[10px] bg-[#31A7AC] py-2 text-sm font-semibold text-white hover:bg-[#279497]"
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 rounded-[10px] border border-[#31A7AC] py-2 text-sm font-semibold text-[#31A7AC]"
                                        onClick={resetForm}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    <div className=" h-screen w-full overflow-hidden"><WhatsOnMainContent /></div>
                </div>

            </div>
        </>
    )
}