'use client'
import { Button } from "@/components/ui/button"
import { Package } from "lucide-react"
import Link from "next/link"

const MainGigHeader = () => {
    return (
        <div className="space-y-4">
            <div className="flex flex-row justify-between items-start gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <span className="text-lg font-semibold">Top Gigs For You</span>
                    <span className="text-sm text-muted-foreground">
                        Based on your profile, preferences, and activity like applies, searches, and saves
                    </span>
                </div>
                <Button asChild variant="default" className="h-11 rounded-2xl px-5 flex items-center gap-2">
                    <Link href="/gigs/manage-gigs" className="flex items-center gap-2 whitespace-nowrap">
                        <Package className="h-4 w-4" />
                        Manage Gigs
                    </Link>
                </Button>
            </div>

        </div>
    )
}

export { MainGigHeader }