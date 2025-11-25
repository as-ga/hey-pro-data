/** @format */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Menu, X, GripVertical, CalendarIcon, Upload, ImageIcon } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export interface Credit {
    id: string;
    creditTitle: string;
    startDate?: Date;
    endDate?: Date;
    description: string;
    image?: string | null;
}

function SortableCreditItem({ credit }: { credit: Credit }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: credit.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const dateRange = credit.startDate && credit.endDate
        ? `${format(credit.startDate, "LLL yyyy")} - ${format(credit.endDate, "LLL yyyy")}`
        : "No date range";

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-gray-200"
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing touch-none"
            >
                <GripVertical className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1">
                <p className="font-medium text-gray-900">{credit.creditTitle}</p>
                <p className="text-sm text-gray-500">{dateRange}</p>
                <p className="text-sm text-gray-500 line-clamp-1">
                    {credit.description || "No description"}
                </p>
            </div>
        </div>
    );
}

interface CreditsEditorProps {
    initialCredits: Credit[];
    trigger: React.ReactNode;
}

export default function CreditsEditor({ initialCredits, trigger }: CreditsEditorProps) {
    const [credits, setCredits] = useState<Credit[]>(initialCredits);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isReorderOpen, setIsReorderOpen] = useState(false);
    const [tempCredits, setTempCredits] = useState<Credit[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setTempCredits((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleReorderClick = () => {
        setTempCredits([...credits]);
        setIsReorderOpen(true);
    };

    const handleReorderSave = () => {
        setCredits(tempCredits);
        setIsReorderOpen(false);
        toast.success("Credit order saved!");
    };

    const handleAddCredit = () => {
        toast.success("New credit added!");
        const newCredit: Credit = {
            id: Date.now().toString(),
            creditTitle: "",
            description: "",
            startDate: undefined,
            endDate: undefined,
            image: null,
        };
        setCredits([...credits, newCredit]);
    };

    const handleRemoveCredit = (id: string) => {
        toast.success("Credit removed!");
        setCredits(credits.filter((credit) => credit.id !== id));
    };

    const handleCreditChange = (
        id: string,
        field: keyof Omit<Credit, "id">,
        value: string | Date | undefined
    ) => {
        setCredits(
            credits.map((credit) =>
                credit.id === id ? { ...credit, [field]: value } : credit
            )
        );
    };

    const handleImageUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error("Please upload an image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                handleCreditChange(id, "image", reader.result as string);
                toast.success("Image uploaded successfully!");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (id: string) => {
        handleCreditChange(id, "image", undefined);
        toast.info("Image removed");
    };

    const handleSaveChanges = () => {
        // Console log all the edited/added data
        console.log("=== Credits Data ===");
        console.log("Total Credits:", credits.length);
        console.log("Credits Details:", JSON.stringify(credits, null, 2));

        setIsDialogOpen(false);
        toast.success("Credits updated successfully!");

        // TODO: Send data to API
        // Example:
        // await fetch('/api/credits', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ credits })
        // });
    };

    const handleCancel = () => {
        setCredits(initialCredits);
        setIsDialogOpen(false);
    };

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent className="max-w-4xl w-auto mx-auto h-[90vh] flex flex-col">
                    <DialogHeader className="p-0 sm:p-1 md:p-1 pb-0">
                        <h1 className="text-2xl font-normal text-gray-900 mb-0">
                            Edit Credits
                        </h1>
                        <p className="text-base text-gray-600 mb-3 ">
                            Add or edit your work credits, projects, or experiences.
                        </p>
                        <div className="flex flex-wrap gap-3 mb-1">
                            <Button
                                onClick={handleReorderClick}
                                variant="outline"
                                className="flex items-center h-10 gap-2 px-6 py-3 text-base border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 rounded-2xl bg-transparent"
                            >
                                <Menu className="h-5 w-5" />
                                Reorder
                            </Button>
                            <Button
                                onClick={handleAddCredit}
                                variant="outline"
                                className="flex items-center h-10 gap-2 px-6 py-3 text-base border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 rounded-2xl bg-transparent"
                            >
                                <Plus className="h-5 w-5" />
                                Add Credit
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 sm:px-8 md:px-10">
                        <div className="space-y-6 mb-8">
                            {credits.map((credit) => (
                                <div key={credit.id} className="space-y-3">
                                    <div className="flex w-full  items-center gap-2 border border-[#31A7AC] rounded-full">
                                        <input
                                            value={credit.creditTitle}
                                            onChange={(e) =>
                                                handleCreditChange(credit.id, "creditTitle", e.target.value)
                                            }
                                            placeholder="Credit Title"
                                            className="flex-1 h-10 px-6 py-6 text-base border-none border-gray-300 rounded-full focus:border-none focus:ring-none focus:outline-none "
                                        />
                                        <Button
                                            onClick={() => handleRemoveCredit(credit.id)}
                                            variant="ghost"
                                            size="icon"
                                            className="h-12 w-12 text-red-500 hover:bg-red-50 rounded-full"
                                        >
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className="w-full justify-start text-left font-normal border-gray-500 rounded-full h-12"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {credit.startDate ? format(credit.startDate, "PPP") : <span>Pick a start date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={credit.startDate}
                                                    onSelect={(date) => handleCreditChange(credit.id, "startDate", date)}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className="w-full justify-start text-left font-normal border-gray-500 rounded-full h-12"
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {credit.endDate ? format(credit.endDate, "PPP") : <span>Pick an end date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={credit.endDate}
                                                    onSelect={(date) => handleCreditChange(credit.id, "endDate", date)}
                                                    disabled={(date) =>
                                                        credit.startDate ? date < credit.startDate : false
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <Textarea
                                        value={credit.description}
                                        onChange={(e) =>
                                            handleCreditChange(credit.id, "description", e.target.value)
                                        }
                                        placeholder="Write credit description..."
                                        className="min-h-[120px] px-6 py-4 text-base border-2 border-gray-500 rounded-3xl focus:border-[#31A7AC] focus:outline-none focus:ring-none resize-none"
                                    />

                                    {/* Image Upload Section */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Credit Image
                                        </label>

                                        {credit.image ? (
                                            <div className="relative w-full h-48 border-2 border-gray-300 rounded-2xl overflow-hidden">
                                                <Image
                                                    src={credit.image}
                                                    alt="Credit preview"
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <label className="cursor-pointer">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleImageUpload(credit.id, e)}
                                                            className="hidden"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            size="sm"
                                                            className="pointer-events-none"
                                                        >
                                                            <Upload className="h-4 w-4 mr-2" />
                                                            Change
                                                        </Button>
                                                    </label>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleRemoveImage(credit.id)}
                                                    >
                                                        <X className="h-4 w-4 mr-2" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#31A7AC] hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleImageUpload(credit.id, e)}
                                                    className="hidden"
                                                />
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <ImageIcon className="w-12 h-12 mb-3 text-gray-400" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, GIF up to 5MB
                                                    </p>
                                                </div>
                                            </label>
                                        )}
                                    </div>

                                    {credit !== credits[credits.length - 1] && (
                                        <div className="border-t border-gray-200 mt-2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col justify-start sm:flex-row gap-4 p-3 sm:p-4 md:p-5 pt-6 border-t">
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            className="flex-1 py-3 h-15 text-lg border-2 border-[#FA6E80] text-[#FA6E80]  rounded-2xl bg-transparent"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveChanges}
                            className="flex-1 py-3 h-15 text-lg bg-[#FA6E80] text-white rounded-2xl"
                        >
                            Save
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Reorder Dialog */}
            <Dialog open={isReorderOpen} onOpenChange={setIsReorderOpen}>
                <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                            Reorder Credits
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto py-4">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={tempCredits.map((c) => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {tempCredits.map((credit) => (
                                        <SortableCreditItem
                                            key={credit.id}
                                            credit={credit}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            onClick={() => setIsReorderOpen(false)}
                            variant="outline"
                            className="flex-1 border-2 border-gray-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReorderSave}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                        >
                            Save Order
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
