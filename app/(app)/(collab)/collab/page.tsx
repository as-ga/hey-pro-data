"use client";
import Image from "next/image";
import { Heart, MessageCircle, Plus, Share2, X } from "lucide-react";
import React from "react";

import { Header } from "../components/Header";

type CollabPost = {
    id: number;
    title: string;
    summary: string;
    tags: string[];
    status: "waitlisted" | "interested";
    interests: number;
    interestAvatars: string[];
    postedOn: string;
    author: string;
    avatar: string;
    cover: string;
};

const collabPosts: CollabPost[] = [
    {
        id: 1,
        title: "Midnight Circus | Horror Launch",
        summary:
            "Enter a chilling world of suspense and terror where every shadow hides a secret and every whisper could be a scream. Our horror film delves into the eerie silence of an isolated house, where dark pasts resurface and the line between reality and nightmare blurs.",
        tags: ["film writing", "screenplay", "creativity", "collaboration", "movie launch"],
        status: "waitlisted",
        interests: 18,
        interestAvatars: ["/image (1).png", "/image (2).png", "/image (3).png"],
        postedOn: "15 Oct, 2025",
        author: "Michael Molar",
        avatar: "/assets/whatson/host-avatar.svg",
        cover: "/bg.jpg",
    },
    {
        id: 2,
        title: "Psychological Thriller Anthology",
        summary:
            "Join forces to craft a series of unsettling vignettes that peel back the layers of the human mind. We are blending noir visuals with experimental sound design to deliver an experience that lingers long after the credits roll.",
        tags: ["film writing", "screenplay", "creativity", "collaboration", "movie launch"],
        status: "interested",
        interests: 15,
        interestAvatars: ["/image (1).png", "/image (2).png", "/image (3).png"],
        postedOn: "12 Oct, 2025",
        author: "Michael Molar",
        avatar: "/assets/whatson/host-avatar.svg",
        cover: "/bg.jpg",
    },
];

const inputBase = "w-full rounded-[15px] border border-[#2FD3D8]/40 bg-transparent px-5 py-3 text-sm text-black placeholder:text-black focus:border-[#2FD3D8] focus:outline-none";

const TagPill = ({ label }: { label: string }) => (
    <span className="rounded-full border border-[#2FD3D8] px-4 py-1 text-xs font-medium text-[#2FD3D8]">{label}</span>
);

const StatusButton = ({ status }: { status: CollabPost["status"] }) => {
    if (status === "waitlisted") {
        return <button className="rounded-full bg-[#2FD3D8] px-6 py-2 text-sm font-semibold text-black">Waitlisted</button>;
    }
    return <button className="rounded-full border border-[#2FD3D8] px-6 py-2 text-sm font-semibold text-[#2FD3D8]">I&apos;m interested</button>;
};

export default function Collab() {
    const [posterPreview, setPosterPreview] = React.useState<string>("");
    const [collabTitle, setCollabTitle] = React.useState("");
    const [collabIdea, setCollabIdea] = React.useState("");
    const [tagInput, setTagInput] = React.useState("");
    const [tags, setTags] = React.useState<string[]>([]);

    const handlePosterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
            if (typeof loadEvent.target?.result === "string") {
                setPosterPreview(loadEvent.target.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleAddTag = () => {
        const value = tagInput.trim();
        if (!value || tags.includes(value)) return;
        setTags((prev) => [...prev, value]);
        setTagInput("");
    };

    const handleRemoveTag = (value: string) => {
        setTags((prev) => prev.filter((tag) => tag !== value));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Collab submitted", {
            collabTitle,
            collabIdea,
            tags,
            posterPreview,
        });
    };

    return (
        <div className=" flex flex-col items-center">
            <Header />

            <div className="mt-16 w-full max-w-[960px] space-y-10 text-black bg-transparent">
                <section className="rounded-[36px] p-6">
                    <form onSubmit={handleSubmit} className="flex flex-row gap-6">
                        <div className="rounded-[32px] p-2 text-center text-sm text-black/70">
                            <div className="relative flex h-[197px] w-[326px] items-center justify-center overflow-hidden rounded-[24px] bg-[#D9D9D9]">
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                    onChange={handlePosterChange}
                                />
                                {posterPreview ? (
                                    <Image
                                        src={posterPreview}
                                        alt="Poster preview"
                                        fill
                                        sizes="(max-width: 960px) 100vw, 340px"
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <span>Upload poster / moodboard</span>
                                )}
                            </div>
                            <p className="mt-4 text-xs text-black/60">16:9 recommended • PNG / JPG up to 5MB</p>
                        </div>
                        <div className="space-y-1 text-black w-full">
                            <input
                                className={inputBase}
                                placeholder="Collab title"
                                value={collabTitle}
                                onChange={(e) => setCollabTitle(e.target.value)}
                            />
                            <textarea
                                className={`${inputBase} min-h-[110px] rounded-3xl`}
                                placeholder="What&apos;s your collab idea?"
                                value={collabIdea}
                                onChange={(e) => setCollabIdea(e.target.value)}
                            />
                            <div className="space-y-1 max-h-30 overflow-y-auto mb-3">
                                <div className="flex gap-3 border rounded-2xl p-1 border-[#2FD3D8]">
                                    <input
                                        className={" border-none focus:outline-none px-3.5 bg-transparent w-full"}
                                        placeholder="Add collab tags"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                handleAddTag();
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="whitespace-nowrap rounded-[15px] px-4 py-3 text-sm font-semibold text-[#FA6E80]"
                                    >
                                        <Plus className="h-6 w-6" />
                                    </button>
                                </div>
                                {tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag) => (
                                            <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-[#2FD3D8] px-4 py-1 text-xs font-medium text-[#2FD3D8]">
                                                {tag}
                                                <button type="button" onClick={() => handleRemoveTag(tag)} aria-label={`Remove ${tag}`}>
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="w-full rounded-full bg-[#FA6E80] py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#f5576b]">
                                Post your collab
                            </button>
                        </div>
                    </form>
                </section>

                <section className="space-y-8">
                    {collabPosts.map((post) => (
                        <article key={post.id} className="grid gap-6 md:grid-cols-[360px_auto]">
                            <div className="overflow-hidden rounded-[32px]">
                                <Image
                                    src={post.cover}
                                    alt={post.title}
                                    width={360}
                                    height={220}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="rounded-[32px] border border-white/10 p-6">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={post.avatar}
                                        alt={post.author}
                                        width={48}
                                        height={48}
                                        className="rounded-full border border-white/10"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-black">{post.author}</p>
                                        <p className="text-xs text-black/60">Posted on {post.postedOn}</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm leading-relaxed text-black">{post.summary}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <TagPill key={tag} label={tag} />
                                    ))}
                                </div>
                                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            {post.interestAvatars.map((avatar, index) => (
                                                <Image
                                                    key={`${avatar}-${index}`}
                                                    src={avatar}
                                                    alt="Interested member"
                                                    width={25}
                                                    height={25}
                                                    className="rounded-full object-cover"
                                                    style={{ marginLeft: index === 0 ? 0 : -10 }}
                                                    unoptimized
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs text-black/70">{post.interests} interested</span>
                                    </div>
                                    <div className="ml-auto flex items-center gap-3">
                                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAFAFA] text-[#FA6E80] ">
                                            <Heart className="h-5 w-5" />
                                        </button>
                                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAFAFA] text-[#31A7AC] ">
                                            <Share2 className="h-5 w-5" />
                                        </button>
                                        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAFAFA]  text-black ">
                                            <MessageCircle className="h-5 w-5" />
                                        </button>
                                        <StatusButton status={post.status} />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </div>
        </div>
    );
}