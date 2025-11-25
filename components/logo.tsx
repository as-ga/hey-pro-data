'use client'
import Image from "next/image"
export default function Logo() {
    return (
        <div className="flex items-center justify-center w-full h-full">
            <Image src="/logo/LogoIcon.svg" alt="Logo" width={100} height={100} className="bg-transparent" />
        </div>
    )
}        