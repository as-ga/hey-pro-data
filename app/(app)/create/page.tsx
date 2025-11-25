import { Folder } from "lucide-react";
export default function CreateJobPage() {
    return (
        <main className="mt-10 sm:mt-20 lg:mt-30 w-full max-w-xl min-h-[24rem] shadow-sm mx-auto rounded-2xl flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12">
            <div className="w-full">
                <div className="flex flex-col justify-center items-center mb-6 sm:mb-8 lg:mb-10">
                    <Folder className="mx-auto mb-3 sm:mb-4" size={40} />
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-normal mb-2 text-center">Create New Project</h1>
                        <p className="text-gray-600 text-center px-4 sm:px-6 text-sm sm:text-base">Let&apos;s bring your creative vision to life. We&apos;ll guide you through setting up your project.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-9 px-4 sm:px-6 lg:px-10">

                    <div className="flex flex-col h-full items-center p-8 border rounded-lg  cursor-pointer border-[#FA6E80] font-normal">
                        <Folder className="mx-auto " size={30} color="#FA6E80" />
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-center text-[#FA6E80]">Design Project</h2>
                            <p className="text-[10px]">Define your project details</p>
                        </div>

                    </div>
                    <div className="flex flex-col items-center p-8 border border-[#31A7AC] rounded-lg  cursor-pointer">
                        <Folder className="mx-auto " size={30} color="#31A7AC" />
                        <h2 className="text-lg font-semibold text-center text-[#31A7AC]">Add Gigs</h2>
                        <p className="text-[10px]">Create roles for your team</p>
                    </div>
                </div>

            </div>
        </main>
    );
}