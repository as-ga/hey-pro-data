"use client";

import { Dot } from "lucide-react";
import { useState } from "react";

const TERMS_CHUNK_SIZE = 2;

type TermsListProps = {
    terms: string[];
};

export function TermsList({ terms }: TermsListProps) {
    const total = terms.length;
    const chunksCount = Math.ceil(total / TERMS_CHUNK_SIZE);
    const [visibleChunks, setVisibleChunks] = useState(1);

    const handleShowMore = () => {
        setVisibleChunks((prev) => Math.min(prev + 1, chunksCount));
    };

    const handleCollapseAll = () => {
        setVisibleChunks(1);
    };

    return (
        <section className="space-y-3 mb-5">
            <h3 className="text-lg font-semibold text-[#000000]">T&amp;Cs</h3>
            {Array.from({ length: visibleChunks }).map((_, chunkIndex) => {
                const start = chunkIndex * TERMS_CHUNK_SIZE;
                const end = Math.min(start + TERMS_CHUNK_SIZE, total);
                return (
                    <ol
                        key={chunkIndex}
                        className="list-decimal space-y-2 text-[#000000]"
                    >
                        {terms.slice(start, end).map((term, index) => {
                            const absoluteIndex = start + index; // 0-based
                            return (
                                <li
                                    key={`${chunkIndex}-${index}`}
                                    className="flex items-start justify-start list-decimal"
                                >
                                    <span className="mr-2 text-[12px] font-semibold">
                                        {absoluteIndex + 1}.
                                    </span>
                                    <span className="text-[12px]">{term}</span>
                                </li>
                            );
                        })}
                    </ol>
                );
            })}
            <div className="flex items-center gap-4">
                {visibleChunks < chunksCount && (
                    <button
                        type="button"
                        className="text-sm font-semibold text-[#31A7AC] hover:underline"
                        onClick={handleShowMore}
                    >
                        Show more
                    </button>
                )}
                {visibleChunks > 1 && (
                    <button
                        type="button"
                        className="text-sm font-semibold text-gray-500 hover:underline"
                        onClick={handleCollapseAll}
                    >
                        Okay, got it
                    </button>
                )}
            </div>
        </section>
    );
}