"use client";

import { useState } from "react";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

import { GigList } from "../../components/manage-gigs/gig-list";
import { ApplicationTab } from "../../components/manage-gigs/application-tab";
import { AvailabilityTab } from "../../components/manage-gigs/availability-tab";
import { ContactListTab } from "../../components/manage-gigs/contact-list-tab";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Package } from "lucide-react";

export default function ManageGigsPage() {
    const [selectedGigIds, setSelectedGigIds] = useState<string[]>([]);
    const [currentTab, setCurrentTab] = useState<string>("gigs");
    const handleToggleGig = (gigId: string, checked: boolean) => {
        setSelectedGigIds((prev) => {
            if (checked) {
                if (prev.includes(gigId)) {
                    return prev;
                }
                return [...prev, gigId];
            }
            return prev.filter((id) => id !== gigId);
        });
    };

    return (
        <div className="mx-auto flex w-full max-w-6xl -mt-5 flex-col gap-6 p-4">
            <div className="flex flex-col sm:flex-row items-start justify-start gap-y-2  sm:justify-between">
                <div className="text-2xl font-semibold">
                    <span className="bg-gradient-to-r from-[#FA6E80] via-[#6A89BE] to-[#31A7AC] bg-clip-text text-transparent text-3xl font-semibold">
                        {currentTab === "gigs" ? "Manage Gigs" : currentTab === "application" ? "Manage Gig Applications" : currentTab === "availability" ? "Manage Availability Check" : "View Crew Contacts"}
                    </span>
                </div>
                <div className="flex flex-row gap-3.5 justify-center items-center">
                    <Button asChild variant={"default"} className="h-11 rounded-2xl px-5 flex items-center bg-transparent text-[#31A7AC] border border-[#31A7AC] gap-2">
                        <Link href="/gigs/manage-gigs/add-new" className="flex items-center gap-2 whitespace-nowrap">
                            <Package className="h-4 w-4" />
                            Add Gigs
                        </Link>
                    </Button>
                    <Button className="bg-[#31A7AC] h-[44px] w-[80px]">Save</Button>
                </div>
            </div>
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
                <TabsList className="flex flex-wrap gap-2">
                    <TabsTrigger value="gigs">Gigs</TabsTrigger>
                    <TabsTrigger value="application">Application</TabsTrigger>
                    <TabsTrigger value="availability">Availability Check</TabsTrigger>
                    <TabsTrigger value="contacts">Contact list</TabsTrigger>
                </TabsList>

                <TabsContent value="gigs">
                    <GigList selectedGigIds={selectedGigIds} onToggleGig={handleToggleGig} />
                </TabsContent>

                <TabsContent value="application">
                    <ApplicationTab selectedGigIds={selectedGigIds} />
                </TabsContent>

                <TabsContent value="availability">
                    <AvailabilityTab selectedGigIds={selectedGigIds} />
                </TabsContent>

                <TabsContent value="contacts">
                    <ContactListTab selectedGigIds={selectedGigIds} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
