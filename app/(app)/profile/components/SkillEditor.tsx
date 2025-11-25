/** @format */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Menu, X, GripVertical } from "lucide-react";
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

export interface Skill {
    id: string;
    skillName: string;
    description: string;
}

function SortableSkillItem({ skill }: { skill: Skill }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: skill.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

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
                <p className="font-medium text-gray-900">{skill.skillName}</p>
                <p className="text-sm text-gray-500 line-clamp-1">
                    {skill.description || "No description"}
                </p>
            </div>
        </div>
    );
}

interface SkillEditorProps {
    initialSkills: Skill[];
    trigger: React.ReactNode;
}

export default function SkillEditor({ initialSkills, trigger }: SkillEditorProps) {
    const [skills, setSkills] = useState<Skill[]>(initialSkills);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isReorderOpen, setIsReorderOpen] = useState(false);
    const [tempSkills, setTempSkills] = useState<Skill[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setTempSkills((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleReorderClick = () => {
        setTempSkills([...skills]);
        setIsReorderOpen(true);
    };

    const handleReorderSave = () => {
        setSkills(tempSkills);
        setIsReorderOpen(false);
        toast.success("Skill order saved!");
    };

    const handleAddSkill = () => {
        toast.success("Skill added!");
        const newSkill: Skill = {
            id: Date.now().toString(),
            skillName: "",
            description: "",
        };
        setSkills([...skills, newSkill]);
    };

    const handleRemoveSkill = (id: string) => {
        toast.success("Skill removed!");
        setSkills(skills.filter((skill) => skill.id !== id));
    };

    const handleSkillChange = (
        id: string,
        field: "skillName" | "description",
        value: string
    ) => {
        setSkills(
            skills.map((skill) =>
                skill.id === id ? { ...skill, [field]: value } : skill
            )
        );
    };
    const handleSaveChanges = () => {
        setIsDialogOpen(false);
        console.log("Saving skills from child:", skills);
        toast.success("Skills updated successfully!");
    };

    const handleCancel = () => {
        // Reset skills to initial state if user cancels
        setSkills(initialSkills);
        setIsDialogOpen(false);
    };

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>{trigger}</DialogTrigger>
                <DialogContent className="max-w-4xl w-auto mx-auto h-[90vh] flex flex-col">
                    <DialogHeader className="p-0 sm:p-1 md:p-1 pb-0">
                        <h1 className="text-2xl font-normal text-gray-900 mb-0">
                            Edit Skills
                        </h1>
                        <p className="text-base text-gray-600 mb-3 ">
                            You can write about your years of experience, industry, or skills.
                            People also talk about their achievements or previous job
                            experiences.
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
                                onClick={handleAddSkill}
                                variant="outline"
                                className="flex items-center h-10 gap-2 px-6 py-3 text-base border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50 rounded-2xl bg-transparent"
                            >
                                <Plus className="h-5 w-5" />
                                Add Skill
                            </Button>
                        </div>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 sm:px-8 md:px-10">
                        {/* Skills List */}
                        <div className="space-y-6 mb-8">
                            {skills.map((skill) => (
                                <div key={skill.id} className="space-y-3">
                                    <div className="flex w-full  items-center gap-2 border border-[#31A7AC] rounded-full">
                                        <input
                                            value={skill.skillName}
                                            onChange={(e) =>
                                                handleSkillChange(skill.id, "skillName", e.target.value)
                                            }
                                            placeholder="Skill name"
                                            className="flex-1 h-10 px-6 py-6 text-base border-none border-gray-300 rounded-full focus:border-none focus:ring-none focus:outline-none "
                                        />
                                        <Button
                                            onClick={() => handleRemoveSkill(skill.id)}
                                            variant="ghost"
                                            size="icon"
                                            className="h-12 w-12 text-red-500 hover:bg-red-50 rounded-full"
                                        >
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={skill.description}
                                        onChange={(e) =>
                                            handleSkillChange(skill.id, "description", e.target.value)
                                        }
                                        placeholder="Write skill description..."
                                        className="min-h-[120px] px-6 py-4 text-base border-2 border-gray-500 rounded-3xl focus:border-[#31A7AC] focus:outline-none focus:ring-none resize-none"
                                    />
                                    {skill !== skills[skills.length - 1] && (
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
                            Reorder Skills
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto py-4">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={tempSkills.map((s) => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-3">
                                    {tempSkills.map((skill) => (
                                        <SortableSkillItem
                                            key={skill.id}
                                            skill={skill}
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
