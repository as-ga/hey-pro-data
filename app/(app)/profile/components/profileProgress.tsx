"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  imageUrl: string
  size?: number
  strokeWidth?: number
}

function ProfileProgress({
  className,
  value = 0,
  imageUrl,
  size = 120,
  strokeWidth = 8,
  ...props
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg width={size} height={size} className="absolute">
        {/* Background Circle */}
        <circle
          stroke="#FFFFFF"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Circle */}
        <circle
          stroke="url(#progress-gradient)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transform: "rotate(-0deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset 0.3s ease",
          }}
        />
        <defs>
          <linearGradient id="progress-gradient">
            <stop offset="0%" stopColor="#FA6E80" />
            <stop offset="50%" stopColor="#8DE0E4" />
            <stop offset="100%" stopColor="#31A7AC" />
          </linearGradient>
        </defs>
      </svg>
      {imageUrl?.length > 0 ? (
        <Image
          src={imageUrl}
          alt="Profile"
          width={100}
          height={100}
          className="h-full w-full rounded-full object-cover"
          style={{ padding: strokeWidth }}
        />
      ) : (
        <div
          className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500"
          style={{ padding: strokeWidth }}
        >
          N/A
        </div>
      )}

    </div>
  )
}

export { ProfileProgress }
