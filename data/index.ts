import type { ProjectCardType } from "@/types";

const profileData = {
  name: "John Doe",
  image: "/assets/profile-image.png",
  banner: "/assets/profile-banner.png",
  bio: "Passionate developer with a love for creating web applications.",
  age: 30,
  occupation: "Software Developer",
  location: "San Francisco, CA",
  about:
    "I'm a passionate cinematographer who believes in the power of visual storytelling to evoke emotions and transport audiences. With over a decade in the industry, I've had the privilege of working on everything from intimate indie films to large-scale commercial productions. My approach combines technical expertise with creative vision, blending classic cinematic techniques with innovative handheld camera work, bringing an authentic, human quality to every frame.",
  skills: ["JavaScript", "TypeScript", "React", "Node.js"],
  experience: [
    {
      company: "Tech Corp",
      role: "Frontend Developer",
      duration: "2 years",
    },
    {
      company: "Web Solutions",
      role: "Full Stack Developer",
      duration: "3 years",
    },
  ],
  education: {
    degree: "Bachelor of Science in Computer Science",
    university: "State University",
    graduationYear: 2015,
  },
};
const gigsData = [
  { id: 1, title: "Build a React Website", price: 500 },
  { id: 2, title: "Develop a Node.js API", price: 800 },
  { id: 3, title: "Create a Mobile App", price: 1200 },
];

const projectCardData: ProjectCardType[] = [
  {
    id: 1,
    name: "Project One",
    banner: "/assets/profile-banner.png",
    image: "/assets/profile-image.png",
    bio: "Behind-the-scenes documentary capturing the energy and creativity of Dubai Fashion Week 2024. We need a skilled team to document designers, models, and the fashion industry magic.",
    location: "New York, NY",
    skills: ["React", "Node.js", "GraphQL"],
  },
  {
    id: 2,
    name: "Project Two",
    banner: "/assets/profile-banner.png",
    image: "/assets/profile-image.png",
    bio: "This is a brief description of Project Two.",
    location: "Los Angeles, CA",
    skills: ["Vue.js", "Firebase", "TypeScript"],
  },
  {
    id: 3,
    name: "Project Three",
    banner: "/assets/profile-banner.png",
    image: "/assets/profile-image.png",
    bio: "This is a brief description of Project Three.",
    location: "Chicago, IL",
    skills: ["Angular", "Express", "MongoDB"],
  },
];

export { profileData, gigsData, projectCardData };

export type ProfileDataType = typeof profileData;
export type GigsDataType = typeof gigsData;
