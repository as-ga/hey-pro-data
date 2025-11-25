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

export default function ManageGigsPage() {
    const [selectedGigIds, setSelectedGigIds] = useState<string[]>([]);

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
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4">
            <Tabs defaultValue="gigs" className="space-y-6">
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
