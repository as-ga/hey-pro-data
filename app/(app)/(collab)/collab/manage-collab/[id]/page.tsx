import { notFound } from "next/navigation";

import { getCollabById } from "@/data/collabPosts";

import { ManageCollabHeader } from "../../../components/Header";
import { EditCollabForm } from "./EditCollabForm";

type ManageCollabPageProps = {
    params: { id: string };
};

export default function ManageCollabPage({ params }: ManageCollabPageProps) {
    const collabId = Number(params.id);
    if (Number.isNaN(collabId)) {
        notFound();
    }

    const collab = getCollabById(collabId);
    if (!collab) {
        notFound();
    }

    return (
        <div className="space-y-10">
            <ManageCollabHeader />
            <EditCollabForm collab={collab} />
        </div>
    );
}