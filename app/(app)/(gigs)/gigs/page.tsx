'use client'

import { Input } from "@/components/ui/input"
import { MainGigHeader } from "../components/gigs-header"
import { Search } from "lucide-react"

export default function GigsPage() {
    return (
        <>
            <MainGigHeader />
            <div className="overflow-x-auto p-4">
                <section className="px-4">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="relative w-full border rounded-full h-[52px] justify-center items-center flex border-[#FA6E80]"
                        role="search"
                        aria-label="Search gigs"
                    >
                        <Input
                            type="search"
                            placeholder="Search gigs..."
                            className="pr-14 border-none bg-transparent"
                            aria-label="Search gigs"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 h-[34px] w-[34px] -translate-y-1/2 bg-[#FA6E80] hover:bg-[#f95569] text-white rounded-full flex items-center justify-center"
                            aria-label="Submit search"
                        >
                            <Search className="h-[18px] w-[18px]" />
                        </button>
                    </form>
                </section>
                <section>

                </section>
            </div>
        </>
    )
}