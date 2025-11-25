import { type GigsDataType } from "@/data";

export default function GigDetails(gig: GigsDataType[0]) {
  return (
    <>
      <h1 className="text-pink text-4xl font-bold">{gig.title}</h1>
      <p>Price: ${gig.price}</p>
    </>
  );
}
