
import Image from "next/image";
import Link from "next/link";

import { getAllCollabs } from "@/data/collabPosts";
import { ManageCollabHeader } from "../../components/Header";

export default function ManageCollab() {
    const collabPosts = getAllCollabs();

    const TagPill = ({ label }: { label: string }) => (
        <span className="rounded-full border border-[#0FC6D1] px-4 py-1 text-xs font-medium text-[#0FC6D1]">{label}</span>
    );
    return (
        <div className="space-y-10">
            <ManageCollabHeader />
            <section className="space-y-10">
                {collabPosts.map((post) => (
                    <Link
                        href={`/collab/manage-collab/${post.id}`}
                        key={post.id}
                        className="flex w-full flex-col gap-6 rounded-[36px] border border-[#F2F4F7] bg-white p-6 shadow-[0_25px_120px_rgba(0,0,0,0.08)] md:flex-row"
                    >
                        <div className="overflow-hidden rounded-[30px] md:min-w-[360px]">
                            <Image
                                src={post.cover}
                                alt={post.title}
                                width={360}
                                height={240}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-4 text-gray-800">
                            <div className="text-sm text-gray-500">Posted on {post.postedOn}</div>
                            <div>
                                <h3 className="text-2xl font-semibold text-gray-900">{post.title}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-gray-600">{post.summary}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag) => (
                                    <TagPill key={tag} label={tag} />
                                ))}
                            </div>
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {post.interestAvatars.map((avatar, index) => (
                                            <Image
                                                key={`${avatar}-${index}`}
                                                src={avatar}
                                                alt="Interested member"
                                                width={28}
                                                height={28}
                                                className="rounded-full border-2 border-white object-cover shadow"
                                                style={{ marginLeft: index === 0 ? 0 : -12 }}
                                                unoptimized
                                            />
                                        ))}
                                    </div>
                                    <div className="text-sm font-medium text-gray-600">
                                        <span className="mr-1 text-[#0FC6D1]">{post.interests}</span>
                                        interested
                                    </div>
                                </div>

                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                <Image
                                    src={post.avatar}
                                    alt={post.author}
                                    width={32}
                                    height={32}
                                    className="rounded-full border border-[#F2F4F7]"
                                />
                                <div>
                                    Posted by <span className="font-medium text-gray-800">{post.author}</span>
                                </div>
                                <Link href="#" className="text-[#FA6E80] hover:underline">
                                    View applicants
                                </Link>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>
        </div>
    )
}