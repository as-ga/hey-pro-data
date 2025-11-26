"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { profileData } from "@/data/profile"

export function RoleDialog() {
    const [roles, setRoles] = useState<string[]>(profileData.roles ?? [])
    const [draftRoles, setDraftRoles] = useState<string[]>(roles)
    const [newRole, setNewRole] = useState("")
    const [open, setOpen] = useState(false)

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen)
        if (nextOpen) {
            setDraftRoles(roles)
            setNewRole("")
        }
    }

    const handleAddRole = () => {
        const value = newRole.trim()
        if (!value) {
            return
        }
        if (draftRoles.includes(value)) {
            setNewRole("")
            return
        }
        setDraftRoles((prev) => [...prev, value])
        setNewRole("")
    }

    const handleRemoveRole = (role: string) => {
        setDraftRoles((prev) => prev.filter((entry) => entry !== role))
    }

    const handleSaveRoles = () => {
        setRoles(draftRoles)
        profileData.roles = draftRoles
        console.log("Updated roles", draftRoles)
        setOpen(false)
    }

    return (
        <div className="rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">Roles</h3>
                    <p className="text-sm text-slate-500">Add the hats you wear most often.</p>
                </div>
                <Dialog open={open} onOpenChange={handleOpenChange}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="rounded-full border-[#31A7AC] text-[#31A7AC]">
                            Manage roles
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[420px] rounded-[24px]">
                        <DialogHeader>
                            <DialogTitle>Roles</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500">Enter each role and press Add. Keep it short, like “Director” or “Editor”.</p>
                            <div className="flex gap-2">
                                <Input
                                    value={newRole}
                                    onChange={(event) => setNewRole(event.target.value)}
                                    placeholder="e.g. Cinematographer"
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault()
                                            handleAddRole()
                                        }
                                    }}
                                />
                                <Button type="button" onClick={handleAddRole}>
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {draftRoles.length === 0 && (
                                    <p className="text-xs text-slate-400">No roles yet.</p>
                                )}
                                {draftRoles.map((role) => (
                                    <span
                                        key={role}
                                        className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                                    >
                                        {role}
                                        <button
                                            type="button"
                                            className="text-xs text-slate-400 hover:text-slate-600"
                                            onClick={() => handleRemoveRole(role)}
                                            aria-label={`Remove ${role}`}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="button" onClick={handleSaveRoles}>
                                Save roles
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
                {roles.length === 0 && (
                    <p className="text-sm text-slate-500">No roles added yet.</p>
                )}
                {roles.map((role) => (
                    <span key={role} className="rounded-full bg-[#E6F7F8] px-4 py-1 text-sm font-medium text-[#1F9BA7]">
                        {role}
                    </span>
                ))}
            </div>
        </div>
    )
}
