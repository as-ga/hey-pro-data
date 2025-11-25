"use client"

import { Edit, List, GripVertical, ChevronLeft, ChevronRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { gradientText, HighlightCard, letters } from "@/app/(app)/profile/components/Highlights"
type SectionType = "about" | "skills" | "credits"
import React, { useState, useRef, useEffect } from "react";
import AboutSectionComponent from "./components/About";
import VisaSection from "./components/visa";
import WorkStatusSection from "./components/WorkStatus";
import AddLanguageSection from "./components/Language";
import WhatupNumbers from "./components/WhatAppNumber";
import AvalableCountryForTravel from "./components/AvalableCountryForTravel";
import SkillEditor from "@/app/(app)/profile/components/SkillEditor";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ShortProfile from "./components/ShortProfiel";
import Highlights from "./components/Highlights";
import CreditsSection from "./components/CreditView";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "activities">("dashboard")
  const [coverImageHovered, setCoverImageHovered] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scroll = (scrollOffset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };


  useEffect(() => {
    handleScroll();
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);
  const Profile = {
    "id": "1",
    "avtar": "/image (2).png",
    "backgroundAvtar": "/image.png",
    "persionalDetails": {
      "name": "John Doe",
      "aliasName": "JD",
      "location": "India, Tamil Nadu, Chennai ",
      "availability": "Available",
      "shortAbout": "Award-winning cinematographer with 10+ years in narrative film and commercial work. Visual storytelling and collaborative filmmaking.",
      "links": [
        {
          "label": "LinkedIn",
          "url": "https://www.linkedin.com/in/johndoe",
        },
        {
          "label": "Portfolio",
          "url": "https://johndoe.com/portfolio",
        },
        {
          "label": "GitHub",
          "url": "https://github.com/johndoe",
        },
        {
          "label": "Twitter",
          "url": "https://twitter.com/johndoe",
        }
      ],

    },
    "language": ["English", "Spanish", "French"],
    "countryCode": "IN",
    "phoneNumber": "9876543230",
    "AvailableCountriesForTravel": [
      { name: "Bolivia", dial_code: "+591", code: "BO", flag: "🇧🇴" },
      { name: "Bosnia and Herzegovina", dial_code: "+387", code: "BA", flag: "🇧🇦" },
      { name: "Botswana", dial_code: "+267", code: "BW", flag: "🇧🇼" },
      { name: "Brazil", dial_code: "+55", code: "BR", flag: "🇧🇷" },
    ],
    "profileCompletion": 80,
    'about': `I'm a passionate cinematographer who believes in the power of visual storytelling. With over a decade of experience in the film industry, I've had the privilege of working on everything from intimate indie films to large-scale commercial productions.
  My approach combines technical expertise with creative vision, always in service of the story. I specialize in natural lighting and handheld camera work, bringing an authentic, human quality to every frame.`,
    "skills": [
      {
        "id": "1",
        "skillName": "Cinematography",
        "description": "the art and science of capturing moving images for films and television, serving as visual storytelling"
      },
      {
        "id": "2",
        "skillName": "Color Grading",
        "description": "a post-production process that involves the artistic manipulation of an image's or video's color to cre..."
      }, {
        "id": "3",
        "skillName": "Editing",
        "description": ""
      }
    ],
    "credits": [
      {
        "id": "1",
        "creditTitle": "ABC Films",
        "startDate": new Date("2018-01-01"),
        "endDate": new Date("2020-01-01"),
        "imgUrl": "/image (1).png",
        "description": `Marvel Entertainment, LLC was an American entertainment company founded on June 2, 1998 and based in New York City, formed by the merger of Marvel Entertainment Group and Toy Biz.`
      },
      {
        "id": "2",
        "creditTitle": "XYZ Productions",
        "startDate": new Date("2016-01-01"),
        "endDate": new Date("2018-01-01"),
        "imgUrl": "/image (2).png",
        "description": "Marvel Entertainment, LLC was an American entertainment creditTitle founded on June 2, 1998 and based in New York City, formed by the merger of Marvel Entertainment Group and Toy Biz."
      },
      {
        "id": "3",
        "creditTitle": "123 Cinemas",
        "startDate": new Date("2014-01-01"),
        "endDate": new Date("2016-01-01"),
        "imgUrl": "/image (3).png",
        "description": "Marvel Entertainment, LLC was an American entertainment creditTitle founded on June 2, 1998 and based in New York City, formed by the merger of Marvel Entertainment Group and Toy Biz."
      },
      {
        "id": "4",
        "creditTitle": "456 Studios",
        "startDate": new Date("2012-01-01"),
        "endDate": new Date("2014-01-01"),
        "imgUrl": "/image (4).png",
        "description": "Marvel Entertainment, LLC was an American entertainment creditTitle founded on June 2, 1998 and based in New York City, formed by the merger of Marvel Entertainment Group and Toy Biz."
      },
    ],
    "recomendPeoples": [
      {
        "imgUrl": "/image (2).png"
      },
      {
        "imgUrl": "/image (1).png"
      },
      {
        "imgUrl": "/image (1).png"
      }
    ]
  }
  const highlights = [
    {
      id: '1',
      title: 'Highlights',
      description: `Cinematography is the art and technology of capturing motion pictures to tell a story visually. It involves using techniques like camera angles, lighting, composition, color, and camera movement to evoke emotions, create a mood, and direct the audience's focus to enhance the narrative. A director of photography (DP) or cinematographer is responsible for making these creative and technical choices, working with their crews to achieve the director's vision. `,
      images: "/image (3).png"
    }, {
      id: '2',
      title: 'Cinematography',
      description: `Cinematography is the art and technology of capturing motion pictures to tell a story visually. It involves using techniques like camera angles, lighting, composition, color, and camera movement to evoke emotions, create a mood, and direct the audience's focus to enhance the narrative. A director of photography (DP) or cinematographer is responsible for making these creative and technical choices, working with their crews to achieve the director's vision. `,
      images: "/image (4).png"
    }, {
      id: '3',
      title: 'Editing',
      description: `Cinematography is the art and technology of capturing motion pictures to tell a story visually. It involves using techniques like camera angles, lighting, composition, color, and camera movement to evoke emotions, create a mood, and direct the audience's focus to enhance the narrative. A director of photography (DP) or cinematographer is responsible for making these creative and technical choices, working with their crews to achieve the director's vision. `,
      images: "/image (5).png"
    }

  ]
  const [sectionOrder, setSectionOrder] = useState<SectionType[]>(["about", "skills", "credits"])
  const [isReorderDialogOpen, setIsReorderDialogOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as SectionType)
        const newIndex = items.indexOf(over.id as SectionType)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const sectionComponents = {
    about: <AboutSection key="about" Profile={Profile} />,
    skills: <SkillsSection key="skills" Profile={Profile} />,
    credits: <CreditsSection key="credits" Profile={Profile} />,
  }

  return (
    <section className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-6 pt-6 pb-20 px-3 xs:px-4 sm:px-6 lg:px-8">
      <main className="flex-1 w-full max-w-full lg:max-w-[700px] space-y-3 flex flex-col">
        <div className="relative mb-16 sm:mb-20 lg:mb-24" onMouseEnter={() => setCoverImageHovered(true)} onMouseLeave={() => setCoverImageHovered(false)}>
          <div className="relative h-40 xs:h-44 sm:h-56 md:h-60 rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-500">
            <Image src={Profile.backgroundAvtar} alt="Cover" width={100} height={100} className="w-full h-full object-cover" />

            <div className={`absolute inset-0 flex flex-col items-center justify-center px-4 text-center transition-opacity ${coverImageHovered ? 'opacity-100 bg-black/60 text-white' : 'opacity-0'}`}>
              <div className="flex flex-col items-center justify-center mb-4 text-center">
                <span className="text-white font-semibold mb-2 text-sm sm:text-base">Replace Banner Image</span>
                <span className="text-[10px] sm:text-xs">Optimal dimensions: 3000x759px</span>
              </div>
              <div className="flex flex-col xs:flex-row gap-3 -mt-1 sm:-mt-2">
                <Button variant="default" className="rounded-full bg-[#FA6E80] hover:bg-[#FA6E80] w-full xs:w-auto">
                  Replace Image
                </Button>
                <Button variant="ghost" className="rounded-full border border-white hover:bg-transparent hover:text-white w-full xs:w-auto">
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>

        <ShortProfile Profile={Profile} />
        <div className="w-full bg-slate-200 h-px sm:h-[1px] mb-5" />

        <div className="space-y-2 mx-auto w-full">
          <div className="flex flex-row  gap-3 sm:gap-6 text-black mb-6 sm:mb-8">
            <Button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 min-h-[44px] text-sm sm:text-base font-semibold rounded-[12px] sm:rounded-[15px] ${activeTab === "dashboard"
                ? "bg-[#FA6E80] text-white hover:bg-[#FA6E80] hover:text-white hover:opacity-100"
                : "bg-[#f3f4f6] shadow-sm text-foreground hover:bg-[#f3f4f6] hover:text-foreground hover:opacity-100"
                }`}
            >
              Profile Dashboard
            </Button>
            <Button
              onClick={() => setActiveTab("activities")}
              className={`flex-1 min-h-[44px] text-sm sm:text-base font-semibold rounded-[12px] sm:rounded-[15px] ${activeTab === "activities"
                ? "bg-[#FA6E80] text-white hover:bg-[#FA6E80] hover:text-white hover:opacity-100"
                : "bg-[#ffffff] shadow-sm text-foreground hover:bg-[#ffffff] hover:text-foreground hover:opacity-100"
                }`}
            >
              Activities
            </Button>
          </div>

          <div className="relative">
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex flex-row overflow-x-auto gap-x-4 mb-6 sm:mb-7 scrollbar-hide -mx-2 xs:-mx-1 sm:mx-0 px-2 xs:px-1 sm:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex-none ">
                <AboutSectionComponent title="About" about={Profile.about} />
              </div>
              <div className="flex-none ">
                <VisaSection visaType={''} visaIssueBy={''} visaExpData={''} />
              </div>
              <div className="flex-none ">
                <WorkStatusSection statusProp={Profile.persionalDetails.availability} />
              </div>
              <div className="flex-none ">
                <AddLanguageSection languages={Profile.language} />
              </div>
              <div className="flex-none ">
                <WhatupNumbers
                  countryCode={Profile.countryCode}
                  phoneNumber={Profile.phoneNumber}
                />
              </div>
              <div className="flex-none ">
                <AvalableCountryForTravel availableCountries={Profile.AvailableCountriesForTravel} />
              </div>
            </div>
            {showLeftArrow && (
              <Button
                variant="default"
                size="icon"
                className="absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 transform rounded-full shadow-md z-10"
                onClick={() => scroll(-200)}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            {showRightArrow && (
              <Button
                variant="default"
                size="icon"
                className="absolute right-1 sm:right-0 top-1/2 -translate-y-1/2 transform rounded-full shadow-md z-10"
                onClick={() => scroll(200)}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}
          </div>

          <Dialog open={isReorderDialogOpen} onOpenChange={setIsReorderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto gap-2 text-sm sm:text-base h-12 rounded-full bg-transparent">
                <List className="h-5 w-5" />
                Reorder sections
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-[90vw] sm:w-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-bold">Reorder Sections</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop to reorder the sections on your profile
                </p>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {sectionOrder.map((section) => (
                        <SortableItem key={section} id={section} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
                <Button
                  onClick={() => setIsReorderDialogOpen(false)}
                  className="bg-coral-500 hover:bg-coral-600 w-full sm:w-auto"
                >
                  Done
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="lg:hidden">
            <Button
              variant="outline"
              className="h-11 rounded-[10px] w-full border-[#31A7AC] text-black hover:bg-transparent px-4 flex-shrink-0 mb-3"
            >
              Edit Highlights
            </Button>
            <div className="flex flex-col items-center gap-3 px-2">
              <div className="flex  items-center gap-3 w-full">
                <div className="flex gap-1 flex-nowrap">
                  {letters.map((char, index) => (
                    <span key={index} className={`text-lg font-semibold leading-none ${gradientText}`}>
                      {char}
                    </span>
                  ))}
                </div>
                <span className="flex-1 h-px bg-gradient-to-r from-[#FA6E80] via-[#6A89BE] to-[#31A7AC]" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex gap-4 overflow-x-auto pb-4 px-4">
                {highlights.map((highlight) => (
                  <div key={highlight.id} className="flex-shrink-0 w-[260px]">
                    <HighlightCard highlight={highlight} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="my-8" />
          {sectionOrder.map((section, index) => (
            <div key={section}>
              {sectionComponents[section]}
              {index < sectionOrder.length - 1 && <div className="my-8" />}
            </div>
          ))}
        </div>
      </main>
      <Highlights highlights={highlights} />
    </section>
  )
}

function SkillItem({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
      {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
    </div>
  )
}



function SortableItem({ id }: { id: SectionType }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const sectionNames = {
    about: "About",
    skills: "Skills",
    credits: "Credits",
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 sm:p-4 bg-secondary/50 rounded-lg border border-border hover:bg-secondary cursor-move"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-5 w-5 text-muted-foreground" />
      <span className="font-medium text-sm sm:text-base">{sectionNames[id]}</span>
    </div>
  )
}

function AboutSection({ Profile }: { Profile: { about: string } }) {
  return (
    <div className="space-y-4 max-w-full sm:max-w-3xl mx-auto shadow-md p-6 sm:p-8 lg:p-10 rounded-xl bg-[#FAFAFA]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold">About</h2>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Edit className="h-5 w-5 text-cyan-500" />
        </Button>
      </div>
      <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
        {Profile.about}
      </div>
    </div>
  )
}

function SkillsSection({ Profile }: { Profile: { skills: { id: string, skillName: string, description: string }[] } }) {
  return (
    <div className="space-y-4 max-w-full sm:max-w-3xl mx-auto shadow-md p-6 sm:p-8 lg:p-10 rounded-xl bg-[#FAFAFA]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold">Skills</h2>
        <SkillEditor
          initialSkills={Profile.skills}
          trigger={
            <Button size="icon" variant="ghost" className="rounded-full">
              <Edit className="h-4 w-4 sm:h-5 sm:w-5" color="#31A7AC" />
            </Button>
          }
        />
      </div>
      <div className="space-y-2">
        {Profile.skills.map((skill, index) => (
          <SkillItem key={index} title={skill.skillName} description={skill.description} />
        ))}
      </div>
    </div>
  )
}

