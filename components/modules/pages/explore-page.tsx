"use client";
import { useEffect, useState } from "react";
import { ChevronDown, Filter, Search, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import ProjectCard from "@/components/modules/common/projectCard";
import { ProjectCardType } from "@/types";

const tags = [
  "1st Assistant Director (1st AD)",
  "2D Animation",
  "2nd AC",
  "2nd Assistant Director (2nd AD)",
  "3D Animation",
  "3rd Assistant Director (3rd AD)",
  "Action Director",
  "Aerial Filming",
  "AI Video AD Creator",
  "Animator",
  "Art Director",
  "Art PA",
  "Artist Liaison",
  "Assistant Director",
  "Assistant Director | TV",
  "Assistant Producer",
  "Associate Producer",
  "Camera Assistant",
  "Camera Assistant | Junior",
  "Camera Operator",
  "Camera Operator | Remote Head",
  "Camera Operator | Steadicam",
  "Camera Operator | Trinity 2",
  "Camera Trainee",
  "Casting",
  "Casting Director",
  "Colorist",
  "Content Creator",
  "Costume Designer",
  "Creative Director",
  "Data Wrangler",
  "Director",
  "Director | Commercial",
  "DIT",
  "DOP",
  "DOP | Assistant",
  "DOP | Associate",
  "Drone",
  "Editor",
  "Editor | Offline",
  "Editor | Senior",
  "Equipment Rental",
  "Event Manager",
  "Event Organizer",
  "Events | Fashion Backstage Director",
  "Fashion Assistant | Celebrity",
  "Fashion Show Director",
  "Fashion Stylist",
  "Fashion Stylist | Assistant",
  "Fight Choreographer",
  "Gaffer",
  "Graphic Designer",
  "Grip",
  "Hair Stylist",
  "Image Consultant",
  "Infographics",
];
export default function ExplorePage({
  projectsCardData,
}: {
  projectsCardData: ProjectCardType[];
}) {
  const [projects, setProjects] = useState<ProjectCardType[]>(projectsCardData);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
  const [clearFilter, setClearFilter] = useState(false);

  useEffect(() => {
    let filteredProjects = projectsCardData;
    if (filterTags.length > 0) {
      filteredProjects = filteredProjects.filter((project) =>
        filterTags.every((tag) => project.skills.includes(tag))
      );
    }
    if (searchTerm) {
      filteredProjects = filteredProjects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (clearFilter) {
      setFilterTags([]);
      setSearchTerm("");
      setClearFilter(false);
      filteredProjects = projectsCardData;
    }
    setProjects(filteredProjects);
  }, [filterTags, searchTerm, projectsCardData, clearFilter]);
  return (
    <>
      <div className="flex flex-row p-4 pb-0 gap-5">
        <div className="basis-4/5 relative">
          <Input
            placeholder="Search profiles..."
            className="w-full m-4 h-15 mx-10 rounded-full border-pink focus:border-pink focus-visible:border-pink focus-visible:ring-pink/50"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
          <div className="absolute -right-9 top-1/2 h-12 w-12 -translate-y-1/2 bg-pink hover:bg-pink text-white rounded-full flex items-center justify-center">
            <Search className="h-6 w-6 " />
          </div>
        </div>
        <button
          onClick={() => setClearFilter(!clearFilter)}
          className="flex items-center justify-around ml-8 m-4 px-2 gap-5 border border-pink rounded-full text-2xl cursor-pointer"
        >
          <span>Filter</span>
          <Filter className="h-6 w-6" />
        </button>
      </div>
      {/* filter tags */}
      {filterTags.length > 0 && (
        <div className="flex items-center space-x-2 mb-4 px-20 ">
          {filterTags.map((tag) => (
            <div
              key={tag}
              className="flex items-center border-[1px] border-light-green rounded-full px-3 py-1"
            >
              <span className="px-3 py-1 rounded-full text-sm">{tag}</span>
              <X
                className="h-5 w-5 cursor-pointer"
                onClick={() =>
                  setFilterTags(filterTags.filter((t) => t !== tag))
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* main content */}
      <div className="flex flex-row-2 px-10">
        <div className="w-1/3">
          <ScrollArea className="flex max-h-screen flex-col p-4 rounded-4xl">
            {!showAllTags
              ? tags.slice(0, 10).map((tag) => (
                  <button
                    key={tag}
                    className="w-full text-start text-xl my-2 p-2  cursor-pointer hover:text-pink/70 hover:bg-pink/10 rounded-full"
                    onClick={() => {
                      if (!filterTags.includes(tag))
                        setFilterTags([...filterTags, tag]);
                    }}
                  >
                    {tag}
                  </button>
                ))
              : tags.map((tag) => (
                  <button
                    key={tag}
                    className="w-full text-start text-xl my-2 p-2  cursor-pointer hover:text-pink/70 hover:bg-pink/10 rounded-full"
                    onClick={() => {
                      if (!filterTags.includes(tag))
                        setFilterTags([...filterTags, tag]);
                    }}
                  >
                    {tag}
                  </button>
                ))}
          </ScrollArea>
          {!showAllTags && tags.length > 10 && (
            <button
              className="pl-5 text-pink flex gap-5 items-center cursor-pointer hover:text-pink/70"
              onClick={() => setShowAllTags(true)}
            >
              See more <ChevronDown />
            </button>
          )}
        </div>
        <div className="w-2/3 flex flex-wrap gap-5 p-4">
          {projects.length > 0 &&
            projects.map((project) => (
              <ProjectCard key={project.name} {...project} />
            ))}
        </div>
      </div>
    </>
  );
}
