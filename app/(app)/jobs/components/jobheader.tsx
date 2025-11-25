import { Button } from "@/components/ui/button"
import { Plus, Wrench } from "lucide-react"

export default function JobsHeader() {
    const islogin = true;
    return (
        <div className="fixed  left-0 right-0 z-10   supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4 py-4">
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-semibold">Jobs you created</h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">
                            The jobs you have created for your projects
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <div className="flex flex-row items-center justify-end gap-2">
                            {islogin && <Button className="w-auto"><span><Wrench /></span> Producer tools</Button>}
                            <Button className="w-auto bg-[#31A7AC] hover:bg-[#2a9498] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />
                                <span>Create Jobs</span>
                            </Button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}