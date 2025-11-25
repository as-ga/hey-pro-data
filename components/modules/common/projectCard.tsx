import { ProjectCardType } from "@/types";
import { MapPin } from "lucide-react";
import Image from "next/image";

export default function ProjectCard(props: ProjectCardType) {
  return (
    <div className="w-80 h-[26rem] bg-[#FAFAFA] shadow-xl rounded-2xl">
      <div>
        <Image
          src={props.banner}
          alt={`Banner image for ${props.name}`}
          width={300}
          height={200}
          className="w-full rounded-t-2xl"
        />
      </div>
      <div className="flex justify-center items-center -mt-10 mx-auto">
        <Image
          src={props.image}
          alt={props.name}
          width={100}
          height={100}
          className="rounded-full"
        />
      </div>
      <div className="px-2">
        <div className="flex flex-col justify-center items-center mt-2 space-y-2">
          <h1 className="text-lg font-semibold">{props.name}</h1>
        </div>
        <div className="flex justify-center items-center space-x-1 text-gray-500">
          <MapPin strokeWidth={1.2} absoluteStrokeWidth />
          <p>{props.location}</p>
        </div>

        <p className="block w-full text-gray-500 my-1 text-start px-2">
          {props.bio}
        </p>

        <div className="w-full flex flex-wrap gap-0.5 p-2">
          {props.skills.map((skill) => (
            <span
              key={skill}
              className="text-light-green text-sm font-medium mr-2 px-2.5 py-0.5 border border-light-green rounded-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
