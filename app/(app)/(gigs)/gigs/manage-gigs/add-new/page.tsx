"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek } from "date-fns"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon, FileText, MapPin, Minus, Plus, UploadCloud, X, Zap } from "lucide-react"
import Image from "next/image"

type GigFormValues = {
    role: string
    type: string
    department: string
    location: string
    company: string
    description: string
    referenceUrl: string
    qualifyingCriteria: string
    gigRate: string
    expiryDate: string
}

const initialFormValues: GigFormValues = {
    role: "",
    type: "",
    department: "",
    location: "",
    company: "",
    description: "",
    referenceUrl: "",
    qualifyingCriteria: "",
    gigRate: "",
    expiryDate: "",
}

const defaultSelectedDates = [1, 2, 3, 4, 12, 13, 14]

const capitalizeLabel = (value: string) => {
    if (!value) return ""
    return value.charAt(0).toUpperCase() + value.slice(1)
}

const buildDateRangeString = (dates: number[]) => {
    if (!dates.length) return ""
    const sorted = [...new Set(dates)].sort((a, b) => a - b)
    const ranges: Array<[number, number]> = []
    let start = sorted[0]
    let end = sorted[0]

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i]
        if (current === end + 1) {
            end = current
        } else {
            ranges.push([start, end])
            start = current
            end = current
        }
    }
    ranges.push([start, end])

    return ranges
        .map(([rangeStart, rangeEnd]) => (rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`))
        .join(", ")
}

export default function AddGigPage() {
    const [crewCount, setCrewCount] = useState(1)
    const [formValues, setFormValues] = useState<GigFormValues>(initialFormValues)
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 8, 1))
    const [selectedDates, setSelectedDates] = useState<number[]>(defaultSelectedDates)
    const [isTbc, setIsTbc] = useState(false)
    const [requestQuote, setRequestQuote] = useState(false)
    const [expiryDate, setExpiryDate] = useState<Date | null>(null)
    const [referenceFile, setReferenceFile] = useState<File | null>(null)
    const [referencePreview, setReferencePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const previewUrlRef = useRef<string | null>(null)

    const calendarDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
        const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
        return eachDayOfInterval({ start, end })
    }, [currentMonth])

    const handleCrewChange = (direction: "increment" | "decrement") => {
        setCrewCount((prev) => {
            if (direction === "decrement") {
                return Math.max(1, prev - 1)
            }
            return prev + 1
        })
    }

    const handleFieldChange = (field: keyof GigFormValues, value: string) => {
        setFormValues((prev) => ({ ...prev, [field]: value }))
    }

    const toggleDate = (day: Date) => {
        if (!isSameMonth(day, currentMonth)) return
        const dayNumber = day.getDate()
        setSelectedDates((prev) =>
            prev.includes(dayNumber)
                ? prev.filter((existing) => existing !== dayNumber)
                : [...prev, dayNumber].sort((a, b) => a - b),
        )
    }

    const dateRangeString = useMemo(() => buildDateRangeString(selectedDates), [selectedDates])
    const formattedMonthLabel = format(currentMonth, "MMM yyyy")
    const hasActivePreview = useMemo(() => {
        const textFilled = Object.values(formValues).some((value) => value.trim().length > 0)
        const controlsChanged = crewCount !== 1 || isTbc || requestQuote || referenceFile || expiryDate
        return textFilled || controlsChanged
    }, [formValues, crewCount, isTbc, requestQuote, referenceFile, expiryDate])

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const payload = {
            crewCount,
            ...formValues,
            dates: selectedDates.map((day) => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)),
            isTbc,
            requestQuote,
            referenceFileName: referenceFile?.name || null,
            referenceFile,
            expiryDate,
        }
        console.log("Create gig payload", payload)
    }

    const resetForm = () => {
        setCrewCount(1)
        setFormValues(initialFormValues)
        setSelectedDates(defaultSelectedDates)
        setIsTbc(false)
        setRequestQuote(false)
        setExpiryDate(null)
        setReferenceFile(null)
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current)
            previewUrlRef.current = null
        }
        setReferencePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null
        setReferenceFile(file)
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current)
            previewUrlRef.current = null
        }
        if (file && file.type.startsWith("image/")) {
            const objectUrl = URL.createObjectURL(file)
            previewUrlRef.current = objectUrl
            setReferencePreview(objectUrl)
        } else {
            setReferencePreview(null)
        }
    }

    const handleFileRemove = () => {
        setReferenceFile(null)
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current)
            previewUrlRef.current = null
        }
        setReferencePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const referenceLabel = referenceFile ? referenceFile.name : formValues.referenceUrl
    const previewAvatarSrc = referencePreview || "/image (1).png"

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current)
            }
        }
    }, [])

    return (
        <div className="flex justify-center  px-4 py-8">
            <div className="grid w-full max-w-[1100px] gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-[640px]"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-[#1D1D1F]">Create GIG</h1>
                            <p className="text-sm text-[#8F8F8F]">Share the essentials so the right talent can reach out.</p>
                        </div>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="text-2xl leading-none text-[#CECFD2] transition hover:text-[#7B7B7B]"
                            aria-label="Close"
                        >
                            ×
                        </button>
                    </div>

                    <section className="mt-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#1D1D1F]">Number of crew</Label>
                            <div className="flex items-center gap-3">
                                <div className="inline-flex items-center rounded-full border border-[#E4E7EC] bg-[#F5F5F7] px-3 py-1">
                                    <button
                                        type="button"
                                        onClick={() => handleCrewChange("decrement")}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFD1D8] text-[#FF5470]"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-4 text-lg font-semibold text-[#1D1D1F]">{crewCount}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleCrewChange("increment")}
                                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CFEFED] text-[#0F8C86]"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <Select onValueChange={(value) => handleFieldChange("role", value)} value={formValues.role}>
                                <SelectTrigger className="h-12 rounded-2xl border-[#E4E7EC] bg-[#F8F8F8] text-[#515151]">
                                    <SelectValue placeholder="Enter GIG role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="director">Director</SelectItem>
                                    <SelectItem value="producer">Producer</SelectItem>
                                    <SelectItem value="cinematographer">Cinematographer</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={(value) => handleFieldChange("type", value)} value={formValues.type}>
                                <SelectTrigger className="h-12 rounded-2xl border-[#E4E7EC] bg-[#F8F8F8] text-[#515151]">
                                    <SelectValue placeholder="Enter GIG type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="contract">Contract</SelectItem>
                                    <SelectItem value="full-time">Full time</SelectItem>
                                    <SelectItem value="part-time">Part time</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Input
                            placeholder="Select GIG department"
                            value={formValues.department}
                            onChange={(event) => handleFieldChange("department", event.target.value)}
                            className="h-12 rounded-2xl border-[#E4E7EC] bg-[#F8F8F8] text-[#515151]"
                        />
                        <Input
                            placeholder="Enter GIG location(s)"
                            value={formValues.location}
                            onChange={(event) => handleFieldChange("location", event.target.value)}
                            className="h-12 rounded-2xl border-[#E4E7EC] bg-[#F8F8F8] text-[#515151]"
                        />
                        <Input
                            placeholder="Enter production company name (optional)"
                            value={formValues.company}
                            onChange={(event) => handleFieldChange("company", event.target.value)}
                            className="h-12 rounded-2xl border-[#E4E7EC] bg-[#F8F8F8] text-[#515151]"
                        />

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#1D1D1F]">Edit description</Label>
                            <Textarea
                                placeholder="I am looking for..."
                                value={formValues.description}
                                onChange={(event) => handleFieldChange("description", event.target.value)}
                                className="min-h-[120px] rounded-2xl border-[#E4E7EC] bg-[#F8F8F8] text-[#515151]"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-medium text-[#1D1D1F]">Choose date(s)</Label>
                            </div>
                            <div className="rounded-[24px] bg-[#F8F8F8] p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[#1D1D1F]">
                                        <span className="text-base font-semibold">{format(currentMonth, "MMM, yyyy")}</span>
                                        <CalendarIcon className="h-5 w-5 text-[#FF5470]" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="ghost" size="sm" className="h-8 rounded-full" onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}>
                                            -
                                        </Button>
                                        <Button type="button" variant="ghost" size="sm" className="h-8 rounded-full" onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}>
                                            +
                                        </Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-[#FF8FA5]">
                                    {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                                        <span key={day}>{day}</span>
                                    ))}
                                </div>
                                <ScrollArea className="mt-3 max-h-[260px]">
                                    <div className="grid grid-cols-7 gap-2">
                                        {calendarDays.map((day, index) => {
                                            const dayNumber = day.getDate()
                                            const isCurrentMonthDay = isSameMonth(day, currentMonth)
                                            const isSelected = selectedDates.includes(dayNumber)
                                            const hasPrevInRow = index % 7 !== 0
                                            const hasNextInRow = index % 7 !== 6
                                            const isPrevSelected = isSelected && hasPrevInRow && selectedDates.includes(dayNumber - 1)
                                            const isNextSelected = isSelected && hasNextInRow && selectedDates.includes(dayNumber + 1)
                                            const selectionShapeClass = !isSelected
                                                ? "rounded-full"
                                                : isPrevSelected && isNextSelected
                                                    ? "rounded-none"
                                                    : isPrevSelected
                                                        ? "rounded-r-full rounded-l-none"
                                                        : isNextSelected
                                                            ? "rounded-l-full rounded-r-none"
                                                            : "rounded-full"

                                            return (
                                                <button
                                                    key={day.toISOString()}
                                                    type="button"
                                                    disabled={!isCurrentMonthDay}
                                                    onClick={() => toggleDate(day)}
                                                    className={`flex h-10 w-10 items-center justify-center text-sm font-semibold transition ${selectionShapeClass} ${!isCurrentMonthDay
                                                        ? "text-[#D7E3E5]"
                                                        : isSelected
                                                            ? "bg-[#1FB3B0] text-white"
                                                            : "text-[#1FB3B0]"
                                                        }`}
                                                >
                                                    {dayNumber}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </ScrollArea>
                            </div>

                            <div className="flex items-center gap-3">
                                <Checkbox id="tbc" checked={isTbc} onCheckedChange={() => setIsTbc((prev) => !prev)} />
                                <Label htmlFor="tbc" className="text-sm font-medium text-[#1D1D1F]">
                                    TBC
                                </Label>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-[#1D1D1F]">
                                Include reference (optional)
                            </Label>
                            <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
                                <Input
                                    placeholder="Enter URL"
                                    value={formValues.referenceUrl}
                                    onChange={(event) => handleFieldChange("referenceUrl", event.target.value)}
                                    className="h-12 rounded-2xl border-[#E4E7EC] bg-[#F8F8F8] text-[#515151]"
                                />
                                <div className="space-y-3">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-[#E4E7EC] text-[#1D1D1F]"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <UploadCloud className="h-4 w-4" />
                                        Upload file
                                    </Button>
                                    {referenceFile && (
                                        <div className="flex items-center gap-3 rounded-2xl border border-[#E4E7EC] bg-[#F8F8F8] px-4 py-2 text-sm text-[#515151]">
                                            <div className="flex-1">
                                                <p className="font-semibold">{referenceFile.name}</p>
                                                <p className="text-xs text-[#8F8F8F]">{(referenceFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleFileRemove}
                                                className="text-[#FF5470] transition hover:opacity-80"
                                                aria-label="Remove file"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-[#1D1D1F]">
                                Qualifying criteria (optional)
                            </Label>
                            <Textarea
                                placeholder="Describe your qualifying criteria"
                                value={formValues.qualifyingCriteria}
                                onChange={(event) => handleFieldChange("qualifyingCriteria", event.target.value)}
                                className="min-h-[120px] rounded-2xl border-[#E4E7EC] bg-[#F8F8F8] text-[#515151]"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-medium text-[#1D1D1F]">GIG rate</Label>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-1 items-center rounded-2xl border border-[#E4E7EC] bg-[#F8F8F8] text-[#515151]">
                                    <span className="px-4 text-sm font-semibold text-[#7B7B7B]">AED</span>
                                    <Input
                                        type="number"
                                        placeholder="$ 000.00"
                                        value={formValues.gigRate}
                                        onChange={(event) => handleFieldChange("gigRate", event.target.value)}
                                        disabled={requestQuote}
                                        className="h-12 border-0 bg-transparent focus-visible:ring-0"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="request-quote"
                                        checked={requestQuote}
                                        onCheckedChange={() => setRequestQuote((prev) => !prev)}
                                    />
                                    <Label htmlFor="request-quote" className="text-sm font-medium text-[#1D1D1F]">
                                        Request quote
                                    </Label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Label className="text-sm font-medium text-[#1D1D1F]">GIG expiry date</Label>
                            <p className="text-xs text-[#8F8F8F]">The GIG will expire after 3 days if a date is not selected</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className={cn(
                                            "flex w-full items-center justify-between rounded-2xl border-[#E4E7EC] bg-[#F8F8F8] px-4 text-left text-[#515151]",
                                            !expiryDate && "text-[#A3A3A3]"
                                        )}
                                    >
                                        {expiryDate ? format(expiryDate, "dd MMM, yyyy") : "Select expiry date"}
                                        <CalendarIcon className="h-4 w-4 text-[#FF5470]" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-auto border-0 p-0 shadow-none">
                                    <CalendarPicker
                                        mode="single"
                                        selected={expiryDate ?? undefined}
                                        onSelect={(date) => {
                                            if (date) {
                                                setExpiryDate(date)
                                                handleFieldChange("expiryDate", format(date, "dd MMM, yyyy"))
                                            }
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </section>

                    <div className="mt-8 flex flex-col gap-3 border-t border-[#F0F0F0] pt-6 md:flex-row md:items-center md:justify-between">
                        <button
                            type="button"
                            className="flex items-center gap-2 text-sm font-semibold text-[#F8C028]"
                        >
                            <Zap className="h-4 w-4" /> Return to Quick GIG
                        </button>
                        <div className="flex flex-1 justify-end gap-3">
                            <Button type="button" variant="outline" className="rounded-full border-[#2AA9A7] text-[#2AA9A7]">
                                Publish
                            </Button>
                            <Button type="submit" className="rounded-full bg-[#2AA9A7] px-6 text-white">
                                Save to draft
                            </Button>
                        </div>
                    </div>
                </form>

                <aside className="rounded-[32px]">
                    <h2 className="text-lg font-semibold text-[#1D1D1F]">Preview</h2>
                    <div className="mt-4 rounded-[28px] p-6">
                        {hasActivePreview ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={previewAvatarSrc}
                                        alt="Project owner avatar"
                                        width={44}
                                        height={44}
                                        className="rounded-full object-cover"
                                        unoptimized={Boolean(referencePreview)}
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-[#1D1D1F]">Michael Molar</p>
                                        <p className="text-xs text-[#8F8F8F]">Project owner</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-lg font-semibold text-[#1D1D1F]">
                                    {crewCount} {capitalizeLabel(formValues.role) || "Crew"} for {capitalizeLabel(formValues.type) || "Gig"}
                                </p>
                                <div className="mt-3 flex items-center gap-2 text-sm text-[#6F6F6F]">
                                    <MapPin className="h-4 w-4" />
                                    <span>{formValues.location || "Location details pending"}</span>
                                </div>
                                <p className="mt-3 text-sm text-[#6F6F6F]">
                                    {formValues.description || "Description of the GIG will be here ..."}
                                </p>

                                <div className="mt-4 space-y-2 text-sm text-[#1D1D1F]">
                                    <div className="flex gap-3">
                                        <CalendarIcon className="mt-1 h-4 w-4 text-[#6F6F6F]" />
                                        <div>
                                            {dateRangeString ? (
                                                <p>
                                                    {formattedMonthLabel} | {dateRangeString}
                                                </p>
                                            ) : (
                                                <p>No dates selected yet</p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-base font-semibold">AED {formValues.gigRate || "0"}</p>
                                    <p className="text-sm font-semibold text-[#1D1D1F]">
                                        Qualifying criteria:
                                        <span className="pl-1 font-normal text-[#6F6F6F]">
                                            {formValues.qualifyingCriteria || "This is where the qualifying criteria value comes"}
                                        </span>
                                    </p>
                                    {referenceLabel && (
                                        <div className="flex items-center gap-2 text-sm text-[#1D1D1F]">
                                            <FileText className="h-4 w-4" />
                                            <span>Reference included{referenceFile ? ` (${referenceFile.name})` : ""}</span>
                                        </div>
                                    )}
                                </div>

                                <p className="mt-4 text-xs text-[#8F8F8F]">Posted on {format(new Date(), "d MMM, yyyy")}</p>
                                <p className="mt-1 text-xs font-semibold text-[#FF5470]">
                                    Apply before {formValues.expiryDate || formattedMonthLabel}
                                </p>
                            </>
                        ) : (
                            <div className="space-y-4 animate-pulse">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-full bg-[#F0F0F0]" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-24 rounded-full bg-[#F0F0F0]" />
                                        <div className="h-2 w-16 rounded-full bg-[#F0F0F0]" />
                                    </div>
                                </div>
                                <div className="h-4 w-56 rounded-full bg-[#F0F0F0]" />
                                <div className="h-3 w-40 rounded-full bg-[#F0F0F0]" />
                                <div className="h-16 rounded-2xl bg-[#F0F0F0]" />
                                <div className="space-y-2">
                                    <div className="h-3 w-48 rounded-full bg-[#F0F0F0]" />
                                    <div className="h-3 w-36 rounded-full bg-[#F0F0F0]" />
                                    <div className="h-3 w-28 rounded-full bg-[#F0F0F0]" />
                                </div>
                                <div className="h-2 w-32 rounded-full bg-[#F0F0F0]" />
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    )
}
