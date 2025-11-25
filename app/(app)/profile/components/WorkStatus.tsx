"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";

export default function WorkStatusSection({ statusProp }: { statusProp: string }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [status, setStatus] = useState(statusProp || "Available");
    const workStatuses = ["Available", "Not Available"];

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (status === (statusProp || "Available")) {
            toast.info("No changes were made.");
            setIsDialogOpen(false);
            return;
        }
        // console.log("Submitting Work Status:", status);
        toast.success("Work status updated successfully!");
        setIsDialogOpen(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <div
                    className="flex flex-row gap-5 h-[44px] w-auto text-base font-medium rounded-[15px]  bg-transparent border px-9 justify-center items-center cursor-pointer hover:bg-muted/50 border-[#444444] "
                >
                    Work Status
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] flex flex-col gap-3">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Work status</DialogTitle>
                        <DialogDescription>
                            Tell people what is your work status (Full time, Part time, Freelancer)
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className=" w-full bg-[#31A7AC] text-[#FFFFFF] rounded-full border-0">
                                <SelectValue placeholder="Work Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {workStatuses.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
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