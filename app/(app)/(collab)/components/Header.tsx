import { Search } from "lucide-react"
import Link from "next/link"

const Header = () => {
    return (
        <div className="">
            <div className="flex flex-row items-center justify-between mb-5">
                <span className="bg-gradient-to-r from-[#FA6E80] via-[#6A89BE] to-[#31A7AC] bg-clip-text text-transparent text-3xl font-semibold">{"Collab"}</span>
                <Link href="/collab/manage-collab" className="ml-2 text-white bg-[#31A7AC] border rounded-[10px] px-4 py-2 ">Manage Collab</Link>
            </div>
            <div className=" flex flex-row border border-[#FA6E80] rounded-full px-4 py-2 justify-center items-center h-[48px] w-[773px] mx-auto">
                <input
                    placeholder="Search by name, role, or department..."
                    className="w-full border-none outline-none focus:ring-0 text-sm"
                // onChange={(e) => console.log(e.target.value)} // Add onChange handler
                />
                <span className="flex items-center justify-center border rounded-full h-[34px] w-[34px] bg-[#FA6E80]">
                    <Search className="h-5 w-5 text-white" />
                </span>
            </div>
        </div>
    )
}

const ManageCollabHeader = () => {
    return (
        <div className="mt-10">
            <div className="flex flex-row items-center justify-between mb-5">
                <span className="bg-gradient-to-r from-[#FA6E80] via-[#6A89BE] to-[#31A7AC] bg-clip-text text-transparent text-3xl font-semibold">{"Manage Collab"}</span>
                <Link href="/collab/manage-collab" className="ml-2 text-white bg-[#31A7AC] border rounded-[10px] px-4 py-2 ">Manage Collab</Link>
            </div>
            <div className=" flex flex-row border border-[#FA6E80] rounded-full px-4 py-2 justify-center items-center h-[48px] w-[773px] mx-auto">
                <input
                    placeholder="Search by name, role, or department..."
                    className="w-full border-none outline-none focus:ring-0 text-sm"
                // onChange={(e) => console.log(e.target.value)} // Add onChange handler
                />
                <span className="flex items-center justify-center border rounded-full h-[34px] w-[34px] bg-[#FA6E80]">
                    <Search className="h-5 w-5 text-white" />
                </span>
            </div>
        </div>
    )
}
export { Header, ManageCollabHeader }
