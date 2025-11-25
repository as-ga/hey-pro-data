export const sampleApplicants = [
    {
        id: "1",
        name: "Aarav Mehta",
        city: "Dubai",
        skills: ["Guitarist", "Sound Engineer"],
        credits: "View credits",
        referrals: 15,
        phone: "+91 9876543210",
        email: "aaravmehta12@gmail.com",
        avatar: "/assets/profile-image.png",
    },
    {
        id: "2",
        name: "Leila Khan",
        city: "Abu Dhabi",
        skills: ["Vocalist", "Composer"],
        credits: "View credits",
        referrals: 12,
        phone: "+91 9876543210",
        email: "leilakhan22@gmail.com",
        avatar: "/assets/profile-image.png",
    },
    {
        id: "3",
        name: "Noah Elder",
        city: "Dubai",
        skills: ["Editor", "Colorist"],
        credits: "View credits",
        referrals: 9,
        phone: "+91 9876543210",
        email: "noahelder@email.com",
        avatar: "/assets/profile-image.png",
    },
];

export type SampleApplicant = (typeof sampleApplicants)[number];

export const contactGroups = [
    {
        id: "camera",
        department: "Camera",
        summary: "4 Camera Operator for Shortfilm",
        entries: [
            { role: "Camera Operator", company: "Central Films", person: sampleApplicants[0] },
            { role: "Camera Operator", company: "Central Films", person: sampleApplicants[1] },
        ],
    },
    {
        id: "lighting",
        department: "Lighting",
        summary: "4 Lighting Operator for Shortfilm",
        entries: [
            { role: "Lighting Operator", company: "Central Films", person: sampleApplicants[2] },
            { role: "Lighting Operator", company: "Central Films", person: sampleApplicants[0] },
        ],
    },
];

export type ContactGroup = (typeof contactGroups)[number];
