/** @format */

"use client";
import { useState } from "react";
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
} from "@/components/ui/dialog";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { X, Search } from "lucide-react";
import { countries, type Country } from "@/lib/countries";
import { toast } from "sonner";

export default function AvalableCountryForTravel({ availableCountries: initialCountries, }: { availableCountries?: Country[]; }) {
    const [isVisaDialogOpen, setIsVisaDialogOpen] = useState(false);
    const [visaCountries, setVisaCountries] = useState<Country[]>(
        initialCountries || []
    );
    const [tempCountries, setTempCountries] = useState<Country[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const handleOpenVisaDialog = () => {
        setTempCountries([...visaCountries]);
        setSearchQuery("");
        setIsVisaDialogOpen(true);
    };

    const handleSelectCountry = (country: Country) => {
        if (!tempCountries.find((c) => c.code === country.code)) {
            setTempCountries([...tempCountries, country]);
        }
        setSearchQuery("");
    };

    const handleRemoveCountry = (countryCode: string) => {
        setTempCountries(tempCountries.filter((c) => c.code !== countryCode));
    };

    const handleSave = () => {
        const initialCodes = visaCountries.map((c) => c.code).sort();
        const tempCodes = tempCountries.map((c) => c.code).sort();

        if (JSON.stringify(initialCodes) === JSON.stringify(tempCodes)) {
            toast.info("No changes were made.");
            setIsVisaDialogOpen(false);
            return;
        }

        console.log("Saving countries:", tempCountries);
        // API call would go here
        setVisaCountries(tempCountries);
        toast.success("Availability for travel updated successfully!");
        setIsVisaDialogOpen(false);
    };

    const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Dialog open={isVisaDialogOpen} onOpenChange={setIsVisaDialogOpen}>
                <DialogTrigger asChild>
                    <div
                        onClick={handleOpenVisaDialog}
                        className="flex flex-row gap-5 h-[44px] w-auto text-base font-medium rounded-[15px]  bg-transparent border px-9 justify-center items-center cursor-pointer hover:bg-muted/50 border-[#444444] "
                    >
                        Available to travel
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">
                            Available to travel
                        </DialogTitle>
                        <DialogDescription>
                            Status to show your are available to travel around for work.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                        <Command className="rounded-lg border">
                            <div className="flex items-center border-b px-3">
                                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                <CommandInput
                                    placeholder="Search countries..."
                                    value={searchQuery}
                                    onValueChange={setSearchQuery}
                                    className="h-11"
                                />
                            </div>
                            <CommandList className="max-h-[200px] overflow-y-auto">
                                <CommandEmpty>No country found.</CommandEmpty>
                                <CommandGroup>
                                    {filteredCountries.map((country) => (
                                        <CommandItem
                                            key={country.code}
                                            value={country.name}
                                            onSelect={() => handleSelectCountry(country)}
                                            className="cursor-pointer"
                                        >
                                            <span className="mr-2 text-lg">{country.flag}</span>
                                            <span className="flex-1">{country.name}</span>
                                            <span className="text-muted-foreground text-sm">
                                                {country.code}
                                            </span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>

                        {tempCountries.length > 0 && (
                            <div className="space-y-2 flex-1 overflow-y-auto">
                                <p className="text-sm font-medium text-muted-foreground">
                                    Selected Countries:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {tempCountries.map((country) => (
                                        <div
                                            key={country.code}
                                            className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full border border-[#31A7AC]"
                                        >
                                            <span className="text-lg">{country.flag}</span>
                                            <span className="text-sm font-medium">
                                                {country.name}
                                            </span>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleRemoveCountry(country.code)}
                                                className="h-6 w-6 rounded-full p-0"
                                            >
                                                <X className="h-3 w-3" color="#31A7AC" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="mt-6 flex gap-3 border-t pt-4">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="border-[#31A7AC] text-[#31A7AC] rounded-xl"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={handleSave}
                            className="bg-[#31A7AC] hover:bg-[#31A7AC] text-[#FFFFFF] rounded-xl"
                        >
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
