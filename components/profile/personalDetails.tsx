"use client";

import { Button } from "@/components/ui/button";
// Image import removed (unused in this page)
import React, { useState } from "react";
import { toast } from "sonner";

export default function PersonalDetails() {
    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [aliasFirst, setAliasFirst] = useState("");
    const [aliasLast, setAliasLast] = useState("");
    const [country, setCountry] = useState("");
    const [stateVal, setStateVal] = useState("");
    const [city, setCity] = useState("");

    const [errors, setErrors] = useState<Record<string, string>>({});

    const statesByCountry: Record<string, { code: string; name: string }[]> = {
        US: [
            { code: "CA", name: "California" },
            { code: "NY", name: "New York" },
            { code: "TX", name: "Texas" },
            { code: "WA", name: "Washington" },
        ],
        CA: [
            { code: "ON", name: "Ontario" },
            { code: "QC", name: "Quebec" },
            { code: "BC", name: "British Columbia" },
            { code: "AB", name: "Alberta" },
        ],
        IN: [
            { code: "DL", name: "Delhi" },
            { code: "MH", name: "Maharashtra" },
            { code: "KA", name: "Karnataka" },
            { code: "TN", name: "Tamil Nadu" },
        ],
        AU: [
            { code: "NSW", name: "New South Wales" },
            { code: "VIC", name: "Victoria" },
            { code: "QLD", name: "Queensland" },
            { code: "WA", name: "Western Australia" },
        ],
        GB: [
            { code: "ENG", name: "England" },
            { code: "SCT", name: "Scotland" },
            { code: "WLS", name: "Wales" },
            { code: "NIR", name: "Northern Ireland" },
        ],
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!firstName.trim()) e.firstName = "First name is required";
        if (!surname.trim()) e.surname = "Surname is required";
        if (!aliasFirst.trim()) e.aliasFirst = "Alias first name is required";
        if (!aliasLast.trim()) e.aliasLast = "Alias last name is required";
        if (!country) e.country = "Please select a country";
        if (country && statesByCountry[country] && !stateVal) e.state = "Please select a state/province";
        if (!city.trim()) e.city = "City is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (ev?: React.FormEvent) => {
        ev?.preventDefault();
        if (!validate()) {
            toast.error("Please fix the errors and try again");
            return;
        }

        const data = { firstName, surname, aliasFirst, aliasLast, country, state: stateVal, city };
        console.log("Form submission:", data);
        toast.success("Form submitted successfully");

        // Optionally clear form
        // setFirstName(''); setSurname(''); ...
    };

    return (
        <>
            <div>
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div
                        className="relative w-full h-screen md:h-[85vh] md:max-w-5xl flex items-center justify-center px-4 rounded-none md:rounded-[68px]"
                        style={{
                            backgroundImage:
                                "conic-gradient(from 180deg at 50% 50%, #FA6E80 0deg, #6A89BE 144deg, #85AAB7 216deg, #31A7AC 360deg)",
                            backgroundSize: "140% 140%",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm w-full max-w-xl rounded-2xl p-8 space-y-2 shadow-lg">
                            <div>
                                <h1 className="text-3xl font-semibold">Personal Details</h1>
                                <p className="text-sm text-muted-foreground mt-1">Name as per in Legal ID</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="block text-sm font-medium">First name</label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white ${errors.firstName ? 'border-red-500' : ''}`}
                                        placeholder="John"
                                    />
                                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="surname" className="block text-sm font-medium">Surname</label>
                                    <input
                                        id="surname"
                                        name="surname"
                                        type="text"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white ${errors.surname ? 'border-red-500' : ''}`}
                                        placeholder="Doe"
                                    />
                                    {errors.surname && <p className="text-xs text-red-500 mt-1">{errors.surname}</p>}
                                </div>
                                <div className="col-span-2 mt-4 mb-2">
                                    <h2 className="text-lg font-medium">Alias Name</h2>
                                    <p className="text-sm text-muted-foreground">How your are called in industry</p>
                                </div>
                                <div className="flex flex-row gap-4 w-full col-span-2 justify-between">
                                    <div className="space-y-2 w-full">
                                        <label htmlFor="aliasFirst" className="block text-sm font-medium">Alias first name</label>
                                        <input
                                            id="aliasFirst"
                                            name="aliasFirst"
                                            type="text"
                                            value={aliasFirst}
                                            onChange={(e) => setAliasFirst(e.target.value)}
                                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white ${errors.aliasFirst ? 'border-red-500' : ''}`}
                                            placeholder="Johnny"
                                        />
                                        {errors.aliasFirst && <p className="text-xs text-red-500 mt-1">{errors.aliasFirst}</p>}
                                    </div>
                                    <div className="space-y-2 w-full">
                                        <label htmlFor="aliasLast" className="block text-sm font-medium">Alias last name</label>
                                        <input
                                            id="aliasLast"
                                            name="aliasLast"
                                            type="text"
                                            value={aliasLast}
                                            onChange={(e) => setAliasLast(e.target.value)}
                                            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white ${errors.aliasLast ? 'border-red-500' : ''}`}
                                            placeholder="D."
                                        />
                                        {errors.aliasLast && <p className="text-xs text-red-500 mt-1">{errors.aliasLast}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2 space-y-4">
                                <h2 className="text-lg font-medium">Location details</h2>
                                <div className="space-y-2">
                                    <label htmlFor="country" className="block text-sm font-medium">Country</label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={country}
                                        onChange={(e) => { setCountry(e.target.value); setStateVal(""); }}
                                        className={`w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary ${errors.country ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Select country</option>
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="IN">India</option>
                                        <option value="AU">Australia</option>
                                        <option value="GB">United Kingdom</option>
                                    </select>
                                    {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="state" className="block text-sm font-medium">State / Province</label>
                                    <select
                                        id="state"
                                        name="state"
                                        value={stateVal}
                                        onChange={(e) => setStateVal(e.target.value)}
                                        className={`w-full rounded-md border px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 ${errors.state ? 'border-red-500' : ''}`}
                                        disabled={!country || !statesByCountry[country]}
                                    >
                                        <option value="">Select state</option>
                                        {country && statesByCountry[country] && statesByCountry[country].map((s) => (
                                            <option key={s.code} value={s.code}>{s.name}</option>
                                        ))}
                                    </select>
                                    {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="city" className="block text-sm font-medium">City</label>
                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white ${errors.city ? 'border-red-500' : ''}`}
                                        placeholder="City name"
                                    />
                                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-[40px] md:h-[50px] bg-[#FA6E80] hover:bg-[#f95569] text-white text-sm md:text-lg font-medium rounded-[15px]"
                            >Comlete Your Profile</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}