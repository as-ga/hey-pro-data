"use client"
import React, { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner";

function formatDate(date: Date | undefined) {
    if (!date) {
        return ""
    }
    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

export default function VisaSection({ visaType: initialVisaType, visaIssueBy: initialVisaIssueBy, visaExpData: initialVisaExpDateString }: { visaType: string, visaIssueBy: string, visaExpData: string }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // State for form fields, initialized with props
    const [visaType, setVisaType] = useState(initialVisaType || "");
    const [issuedBy, setIssuedBy] = useState(initialVisaIssueBy || "");
    const [expiryDate, setExpiryDate] = useState<Date | undefined>(
        initialVisaExpDateString ? new Date(initialVisaExpDateString) : undefined
    );

    // State for the date picker UI
    const [month, setMonth] = useState<Date | undefined>(expiryDate);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const visaTypes = ["H1B", "L1", "O1", "TN", "E3", "F1", "J1", "B1/B2"];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if any data has changed
        const hasVisaTypeChanged = visaType !== (initialVisaType || "");
        const hasIssuedByChanged = issuedBy !== (initialVisaIssueBy || "");
        const hasDateChanged = expiryDate?.getTime() !== (initialVisaExpDateString ? new Date(initialVisaExpDateString).getTime() : undefined);

        if (!hasVisaTypeChanged && !hasIssuedByChanged && !hasDateChanged) {
            toast.info("No changes were made.");
            setIsDialogOpen(false);
            return;
        }

        // const formData = {
        //     visaType,
        //     issuedBy,
        //     visaExpData: expiryDate ? formatDate(expiryDate) : ""
        // };

        // console.log("Submitting Visa Data:", formData);
        // You would typically make an API call here to save the data
        toast.success("Visa details updated successfully!");
        setIsDialogOpen(false);
    };


    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <div
                    className="flex flex-row gap-5 h-[44px] w-auto text-base font-medium rounded-[15px]  bg-transparent border px-9 justify-center items-center cursor-pointer hover:bg-muted/50 border-[#444444] "
                >
                    VISA
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add VISA to your profile</DialogTitle>
                        <DialogDescription>
                            Your nationality, visa type and visa issuer may help enhance your visibility for location-based roles or eligibility-specific opportunities.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Select value={visaType} onValueChange={setVisaType}>
                            <SelectTrigger className=" w-full bg-[#31A7AC] text-[#FFFFFF] rounded-full">
                                <SelectValue placeholder="VISA Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {visaTypes.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div>
                            <Input
                                placeholder="VISA issue by"
                                className="rounded-full focus-visible:border-[#31A7AC] focus-visible:ring-ring/10 border-[#31A7AC]"
                                value={issuedBy}
                                onChange={(e) => setIssuedBy(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="relative flex gap-2">
                                <Input
                                    id="date"
                                    value={expiryDate ? formatDate(expiryDate) : ""}
                                    placeholder="Select expiration date"
                                    className="bg-background pr-10 rounded-full focus-visible:border-[#31A7AC] focus-visible:ring-ring/10 border-[#31A7AC]"
                                    readOnly // Make input read-only to encourage using the calendar
                                />
                                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            id="date-picker"
                                            variant="ghost"
                                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                        >
                                            <CalendarIcon className="size-3.5" />
                                            <span className="sr-only">Select date</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto overflow-hidden p-0"
                                        align="end"
                                        alignOffset={-8}
                                        sideOffset={10}
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={expiryDate}
                                            captionLayout="dropdown"
                                            fromYear={new Date().getFullYear()}
                                            toYear={new Date().getFullYear() + 10}
                                            month={month}
                                            onMonthChange={setMonth}
                                            onSelect={(date) => {
                                                setExpiryDate(date);
                                                setPopoverOpen(false);
                                            }}
                                            disabled={(date) => date < new Date()} // Disable past dates
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="">
                        <DialogClose asChild>
                            <Button type="button" className="border-[#31A7AC] text-[#31A7AC] rounded-xl" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className="bg-[#31A7AC] hover:bg-[#31A7AC] text-[#FFFFFF] rounded-xl">Save changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}